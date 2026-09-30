import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure shared Gemini client per AI Studio standards
const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Generate embedding for text using gemini-embedding-2-preview.
 * Has smart deterministic fallback if API key is unconfigured or rate limited.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  if (!apiKey) {
    return generateFallbackEmbedding(text);
  }

  try {
    const result = await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: text.slice(0, 2048), // limit chunk length
    });

    const resAny = result as any;
    if (resAny.embedding?.values && resAny.embedding.values.length > 0) {
      return resAny.embedding.values;
    }
    if (resAny.embeddings && resAny.embeddings.length > 0 && resAny.embeddings[0]?.values) {
      return resAny.embeddings[0].values;
    }

    return generateFallbackEmbedding(text);
  } catch (error) {
    console.warn('Gemini embedding API call failed, falling back to semantic token vectorizer:', error);
    return generateFallbackEmbedding(text);
  }
}

/**
 * Perform Multimodal OCR and structured extraction from an uploaded PDF or image
 * using gemini-3.8-flash.
 */
export async function extractDocumentTextWithGemini(
  base64Data: string,
  mimeType: string,
  fileName: string
): Promise<{ extractedText: string; detectedCategory?: string; summary?: string }> {
  if (!apiKey) {
    return {
      extractedText: `Document: ${fileName}\nContent extracted in offline mode.\nPlease configure GEMINI_API_KEY for advanced neural OCR.`,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        {
          text: `You are an expert college registrar and document digitizer.
Please read this uploaded college document (${fileName}) carefully:
1. Extract ALL text faithfully into clean, structured Markdown, maintaining headings (#, ##, ###), bullet points, and tables.
2. If this is a timetable, format the schedule as a clear Markdown table with columns: Day, Time Slot, Subject, Subject Code, Room/Lab, Professor.
3. If this is an exam notice, list dates, subjects, timings, and eligibility criteria explicitly.
4. If this is an attendance or fee document, preserve numbers, percentages, rules, and bank/dates information accurately.
Provide only the clean, complete Markdown representation.`,
        },
      ],
    });

    const text = response.text || '';
    return { extractedText: text };
  } catch (error) {
    console.error('Error during Gemini OCR extraction:', error);
    throw error;
  }
}

/**
 * Fallback semantic token-frequency embedding generator (dimension 128)
 * Ensures vector cosine similarity works even if network/offline or key pending.
 */
function generateFallbackEmbedding(text: string, dimensions = 128): number[] {
  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = clean.split(/\s+/).filter(Boolean);
  const vector = new Array(dimensions).fill(0);

  if (words.length === 0) return vector;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    vector[idx] += 1.0;
    // Also ngram context
    const idx2 = Math.abs((hash * 31) ^ (i % 7)) % dimensions;
    vector[idx2] += 0.5;
  }

  // Normalize to unit vector
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

/**
 * Compute cosine similarity between two vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  const len = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  const sim = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.max(0, Math.min(1, sim)); // clamp 0..1
}
