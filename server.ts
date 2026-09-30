import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { vectorStore } from './server/vectorStore.ts';
import { ai, extractDocumentTextWithGemini } from './server/gemini.ts';
import { resolveTimetableQuery } from './server/timetableEngine.ts';
import { CitationSource, DocumentCategory } from './server/types.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize vector store on startup
vectorStore.init().catch((err) => {
  console.error('[Server] VectorStore init failed:', err);
});

// ----------------- API ROUTES ----------------- //

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// List all documents
app.get('/api/documents', (_req: Request, res: Response) => {
  try {
    const docs = vectorStore.getAllDocuments();
    res.json({ documents: docs });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch documents' });
  }
});

// Get document content and chunks
app.get('/api/documents/:id', (req: Request, res: Response) => {
  try {
    const doc = vectorStore.getDocument(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const chunks = vectorStore.getDocumentChunks(req.params.id);
    res.json({ document: doc.metadata, content: doc.content, chunks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload and ingest a new document
app.post('/api/documents/upload', async (req: Request, res: Response) => {
  try {
    const {
      title,
      category,
      department = 'All',
      semester = 'All',
      academicYear = '2026-2027',
      version = 'v1.0',
      fileType = 'txt',
      content,
      base64Data,
      mimeType,
      tags = [],
      autoDetectOutdated = true,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let finalContent = content || '';

    // If PDF or image base64 is provided, perform OCR extraction via Gemini 3.8 Flash
    if (base64Data && (fileType === 'pdf' || fileType === 'image' || mimeType?.includes('pdf') || mimeType?.includes('image'))) {
      try {
        console.log(`[Upload] Performing OCR extraction on ${title} (${mimeType})...`);
        const ocrResult = await extractDocumentTextWithGemini(
          base64Data,
          mimeType || (fileType === 'pdf' ? 'application/pdf' : 'image/png'),
          title
        );
        finalContent = ocrResult.extractedText;
      } catch (ocrErr: any) {
        console.warn('[Upload] OCR error:', ocrErr);
        if (!finalContent) {
          finalContent = `# ${title}\n(Uploaded document: ${title})\n\nOCR processing encountered an issue: ${ocrErr.message || 'Unknown'}`;
        }
      }
    }

    if (!finalContent.trim()) {
      return res.status(400).json({ error: 'Document text content could not be extracted or was empty.' });
    }

    const docId = 'doc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newDocMeta = {
      id: docId,
      title,
      category: category as DocumentCategory,
      department,
      semester,
      academicYear,
      version,
      effectiveDate: new Date().toISOString().split('T')[0],
      isOutdated: false,
      fileType: fileType as any,
      fileSize: finalContent.length,
      uploadedAt: new Date().toISOString(),
      tags: Array.isArray(tags) ? tags : [],
    };

    const indexedDoc = await vectorStore.indexDocument(newDocMeta, finalContent, true);

    let outdatedReplacedIds: string[] = [];
    if (autoDetectOutdated) {
      outdatedReplacedIds = vectorStore.detectAndMarkOutdated(indexedDoc);
    }

    res.json({
      success: true,
      document: indexedDoc,
      outdatedReplacedIds,
      message: `Document "${title}" successfully indexed into ${indexedDoc.chunkCount} vector chunks.`,
    });
  } catch (error: any) {
    console.error('[Upload] Document ingestion failed:', error);
    res.status(500).json({ error: error.message || 'Failed to ingest document' });
  }
});

// Delete document
app.delete('/api/documents/:id', (req: Request, res: Response) => {
  try {
    const success = vectorStore.deleteDocument(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update document outdated status
app.patch('/api/documents/:id/status', (req: Request, res: Response) => {
  try {
    const { isOutdated } = req.body;
    const success = vectorStore.setDocumentStatus(req.params.id, Boolean(isOutdated));
    if (!success) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ success: true, message: `Document status updated to ${isOutdated ? 'Outdated' : 'Active'}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Re-index document
app.post('/api/documents/:id/reindex', async (req: Request, res: Response) => {
  try {
    const doc = vectorStore.getDocument(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const updated = await vectorStore.indexDocument(doc.metadata, doc.content, true);
    res.json({ success: true, document: updated, message: 'Document successfully re-indexed.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// RAG Playground / Hybrid Search Inspector
app.post('/api/rag/search', async (req: Request, res: Response) => {
  try {
    const { query, department, semester, category, includeOutdated, topK } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    const searchRes = await vectorStore.hybridSearch({
      query,
      department,
      semester,
      category,
      includeOutdated: Boolean(includeOutdated),
      topK: Number(topK) || 6,
    });
    res.json(searchRes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Timetable quick view for student widgets
app.get('/api/timetable/quick', (req: Request, res: Response) => {
  try {
    const department = (req.query.department as string) || 'Computer Engineering';
    const semester = (req.query.semester as string) || 'Semester 5';
    const day = (req.query.day as string) || 'Wednesday';

    const result = resolveTimetableQuery({
      query: `Show my ${day} timetable`,
      department,
      semester,
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Feedback submission
app.post('/api/rag/feedback', (req: Request, res: Response) => {
  try {
    const { messageId, feedback, comment } = req.body;
    if (!messageId || !feedback) {
      return res.status(400).json({ error: 'messageId and feedback are required' });
    }
    vectorStore.recordFeedback(messageId, feedback, comment);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin analytics
app.get('/api/admin/analytics', (_req: Request, res: Response) => {
  try {
    const analytics = vectorStore.getAnalytics();
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- RAG CHAT & STREAMING ----------------- //

// Helper to construct RAG prompt
function buildRagPrompt(params: {
  query: string;
  contextChunks: string;
  department: string;
  semester: string;
  historyText: string;
  timetableSummary?: string;
}): string {
  return `You are "CampusMind", the official AI College Knowledge Assistant for Apex Institute of Technology & Science.
Your mission is to provide accurate, helpful, and officially verified answers to students and faculty strictly based on the official college documents provided below.

==================== STRICT RAG GROUNDING RULES ====================
1. Rely ONLY on the provided Official College Context. Do NOT invent dates, fees, rules, or professor names.
2. If the answer cannot be found in the provided context, state clearly and politely:
   "I could not find official information regarding this in the uploaded college documents. Please consult the Department Office or Academic Registrar for further details."
3. Every factual statement must cite its official source document name and section, e.g. [Source: Academic Calendar 2026–2027, Fall Semester Schedule].
4. If a document in context is marked [OUTDATED / ARCHIVED], warn the student and prioritize the latest active document.
5. If the student asks about timetables, class schedules, or professor cabins, provide clear, concise details with timings, subject code, and room numbers.
6. Tone: Professional, warm, academic, and direct. Format with clean Markdown headers, bullet points, and tables where suitable.
=====================================================================

STUDENT PROFILE CONTEXT:
Department: ${params.department || 'Not specified'}
Semester: ${params.semester || 'Not specified'}
Today's Academic Reference Date: Wednesday, 30 September 2026

${params.timetableSummary ? `TIMETABLE REASONING DATA:\n${params.timetableSummary}\n` : ''}

OFFICIAL COLLEGE CONTEXT CHUNKS:
${params.contextChunks || 'No matching college documents found.'}

CONVERSATION HISTORY:
${params.historyText || '(No previous history)'}

STUDENT'S CURRENT QUESTION:
${params.query}

Please provide your grounded, cited response now:`;
}

// Streaming RAG chat endpoint via Server-Sent Events (SSE)
app.post('/api/rag/chat-stream', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { messages = [], department = 'Computer Engineering', semester = 'Semester 5', category = 'All' } = req.body;
    
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const latestUserMsg = messages[messages.length - 1];
    const userQuery = latestUserMsg.content;

    // Check timetable engine
    const timetableMatch = resolveTimetableQuery({
      query: userQuery,
      department,
      semester,
    });

    // Run Hybrid Retrieval in Vector Store
    const searchRes = await vectorStore.hybridSearch({
      query: userQuery,
      department,
      semester,
      category,
      includeOutdated: false,
      topK: 5,
    });

    const contextChunksText = searchRes.results
      .map((r, i) => `[Chunk ${i + 1}] Document: "${r.chunk.docTitle}" | Section: "${r.chunk.section}" | Page: ${r.chunk.pageNumber || 1} ${r.isOutdated ? '(OUTDATED ARCHIVE)' : '(ACTIVE OFFICIAL)'} (Match Confidence: ${r.relevanceConfidence}%):\n${r.chunk.text}\n`)
      .join('\n---\n');

    // Citations to return to client
    const citations: CitationSource[] = searchRes.results.map((r) => ({
      documentId: r.chunk.documentId,
      docTitle: r.chunk.docTitle,
      category: r.chunk.category,
      section: r.chunk.section,
      pageNumber: r.chunk.pageNumber,
      excerpt: r.chunk.text.slice(0, 280) + (r.chunk.text.length > 280 ? '...' : ''),
      confidence: r.relevanceConfidence,
      isOutdated: r.isOutdated,
    }));

    // Previous history formatting
    const historyText = messages
      .slice(-5, -1)
      .map((m: any) => `${m.role === 'user' ? 'Student' : 'CampusMind'}: ${m.content}`)
      .join('\n');

    const prompt = buildRagPrompt({
      query: userQuery,
      contextChunks: contextChunksText,
      department,
      semester,
      historyText,
      timetableSummary: timetableMatch.matched ? timetableMatch.summary : undefined,
    });

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send metadata header first
    const metadataEvent = {
      type: 'meta',
      citations,
      structuredData: timetableMatch.matched && timetableMatch.slots.length > 0 ? {
        type: 'timetable',
        title: `${timetableMatch.day || 'Weekly'} Schedule (${department})`,
        payload: {
          day: timetableMatch.day,
          slots: timetableMatch.slots,
          department,
          semester,
        },
      } : undefined,
      suggestedFollowUps: generateFollowUps(userQuery, searchRes.results),
    };
    res.write(`data: ${JSON.stringify(metadataEvent)}\n\n`);

    // Stream generation from Gemini 3.8 Flash
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    for await (const chunk of responseStream) {
      const text = chunk.text || '';
      if (text) {
        res.write(`data: ${JSON.stringify({ type: 'token', text })}\n\n`);
      }
    }

    const latency = Date.now() - startTime;
    res.write(`data: ${JSON.stringify({ type: 'done', latency })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('[RAG Stream] Error:', error);
    // If headers already sent, write error event
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message || 'Generation failed' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: error.message || 'RAG stream failed' });
    }
  }
});

// Non-streaming RAG chat endpoint (fallback)
app.post('/api/rag/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { messages = [], department = 'Computer Engineering', semester = 'Semester 5', category = 'All' } = req.body;
    
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const latestUserMsg = messages[messages.length - 1];
    const userQuery = latestUserMsg.content;

    const timetableMatch = resolveTimetableQuery({
      query: userQuery,
      department,
      semester,
    });

    const searchRes = await vectorStore.hybridSearch({
      query: userQuery,
      department,
      semester,
      category,
      includeOutdated: false,
      topK: 5,
    });

    const contextChunksText = searchRes.results
      .map((r, i) => `[Chunk ${i + 1}] Document: "${r.chunk.docTitle}" | Section: "${r.chunk.section}" | Page: ${r.chunk.pageNumber || 1} ${r.isOutdated ? '(OUTDATED ARCHIVE)' : '(ACTIVE OFFICIAL)'}:\n${r.chunk.text}\n`)
      .join('\n---\n');

    const citations: CitationSource[] = searchRes.results.map((r) => ({
      documentId: r.chunk.documentId,
      docTitle: r.chunk.docTitle,
      category: r.chunk.category,
      section: r.chunk.section,
      pageNumber: r.chunk.pageNumber,
      excerpt: r.chunk.text.slice(0, 280) + (r.chunk.text.length > 280 ? '...' : ''),
      confidence: r.relevanceConfidence,
      isOutdated: r.isOutdated,
    }));

    const historyText = messages
      .slice(-5, -1)
      .map((m: any) => `${m.role === 'user' ? 'Student' : 'CampusMind'}: ${m.content}`)
      .join('\n');

    const prompt = buildRagPrompt({
      query: userQuery,
      contextChunks: contextChunksText,
      department,
      semester,
      historyText,
      timetableSummary: timetableMatch.matched ? timetableMatch.summary : undefined,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const latency = Date.now() - startTime;
    const answer = response.text || 'I apologize, but I could not formulate an answer based on official documents.';

    res.json({
      content: answer,
      citations,
      structuredData: timetableMatch.matched && timetableMatch.slots.length > 0 ? {
        type: 'timetable',
        title: `${timetableMatch.day || 'Weekly'} Schedule (${department})`,
        payload: {
          day: timetableMatch.day,
          slots: timetableMatch.slots,
          department,
          semester,
        },
      } : undefined,
      suggestedFollowUps: generateFollowUps(userQuery, searchRes.results),
      retrievalLatencyMs: latency,
    });
  } catch (error: any) {
    console.error('[RAG Chat] Error:', error);
    res.status(500).json({ error: error.message || 'Chat generation failed' });
  }
});

// Helper for dynamic follow-up suggestions
function generateFollowUps(query: string, results: any[]): string[] {
  const q = query.toLowerCase();
  if (q.includes('timetable') || q.includes('class') || q.includes('lecture') || q.includes('dbms')) {
    return [
      'What classes do I have tomorrow?',
      'Who is the professor for DBMS?',
      'Where is the DBMS Lab held?',
      'What is my schedule on Friday afternoon?',
    ];
  }
  if (q.includes('exam') || q.includes('calendar') || q.includes('midterm')) {
    return [
      'What are the passing criteria for exams?',
      'What is the minimum attendance required for exam eligibility?',
      'When is the Diwali vacation?',
      'What is the internal vs external exam weightage?',
    ];
  }
  if (q.includes('attendance') || q.includes('detention') || q.includes('rule')) {
    return [
      'What is the procedure for medical leave condonation?',
      'What happens if attendance falls below 65%?',
      'Are electronic devices allowed in exam halls?',
      'Who do I submit medical certificates to?',
    ];
  }
  if (q.includes('fee') || q.includes('hostel') || q.includes('payment')) {
    return [
      'What is the penalty for late fee payment?',
      'Can semester fees be paid in installments?',
      'What are the hostel room options and mess charges?',
      'Who is the Finance Officer contact?',
    ];
  }
  if (q.includes('scholarship')) {
    return [
      'What are the documents needed for merit scholarship?',
      'What is the income threshold for EWS financial aid?',
      'What is the scholarship application deadline?',
      'Where is Scholarship Counter No. 4 located?',
    ];
  }
  if (q.includes('placement') || q.includes('job') || q.includes('drive')) {
    return [
      'What is the minimum CGPA required for campus placement?',
      'Can students with backlogs sit for placement drives?',
      'Which recruiters are visiting this year?',
      'What is the Dream Company offer policy?',
    ];
  }
  return [
    'Show my Monday timetable',
    'What are the attendance requirements?',
    'When do mid-term examinations start?',
    'What scholarships are available?',
  ];
}

// ----------------- VITE / STATIC SERVING ----------------- //

async function setupServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware mounted in dev mode.');
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
      console.log('[Server] Serving production static bundle from ./dist');
    } else {
      console.warn('[Server] dist directory not found. Please run npm run build.');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CampusMind] Server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('[Server] Fatal bootstrap error:', err);
});
