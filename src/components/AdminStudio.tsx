import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Search, 
  Plus, 
  Database, 
  Sliders, 
  Cpu, 
  Sparkles,
  BarChart3,
  HelpCircle,
  Eye,
  FileCheck
} from 'lucide-react';
import { DocumentMetadata, DocumentCategory, AdminAnalytics, SearchInspectorResult } from '../types.ts';
import { DEPARTMENTS, SEMESTERS } from './Header.tsx';

interface AdminStudioProps {
  documents: DocumentMetadata[];
  onRefreshDocs: () => void;
  onInspectDocument: (doc: DocumentMetadata) => void;
}

const CATEGORIES: DocumentCategory[] = [
  'Timetable',
  'Exams',
  'Notices',
  'Attendance & Rules',
  'Academic Calendar',
  'Fees',
  'Scholarships',
  'Placements',
  'Faculty & Department',
  'Events',
  'General',
];

export const AdminStudio: React.FC<AdminStudioProps> = ({
  documents,
  onRefreshDocs,
  onInspectDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'upload' | 'inspector' | 'analytics'>('inventory');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('Notices');
  const [uploadDept, setUploadDept] = useState('All');
  const [uploadSem, setUploadSem] = useState('All');
  const [uploadVersion, setUploadVersion] = useState('v1.0');
  const [uploadContent, setUploadContent] = useState('');
  const [autoDetectOutdated, setAutoDetectOutdated] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState<string>('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Inspector State
  const [inspectorQuery, setInspectorQuery] = useState('What are the rules for exam attendance eligibility?');
  const [inspectorDept, setInspectorDept] = useState('All');
  const [inspectorCategory, setInspectorCategory] = useState('All');
  const [inspectorResults, setInspectorResults] = useState<SearchInspectorResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStats, setSearchStats] = useState<{ queryEmbeddingTimeMs: number; searchTimeMs: number } | null>(null);

  // Filter in Inventory
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCatFilter, setInventoryCatFilter] = useState('All');

  // Load analytics
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error('Failed to load analytics:', e);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [documents]);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        // strip data url prefix
        const base64 = res.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      alert('Please provide a document title.');
      return;
    }

    setIsUploading(true);
    setUploadSuccessMessage(null);
    setUploadStage('Reading document file...');

    try {
      let base64Data: string | undefined = undefined;
      let fileType = 'txt';
      let contentText = uploadContent;

      if (selectedFile) {
        const name = selectedFile.name.toLowerCase();
        if (name.endsWith('.pdf')) fileType = 'pdf';
        else if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) fileType = 'image';
        else if (name.endsWith('.docx')) fileType = 'docx';
        else if (name.endsWith('.md')) fileType = 'md';

        if (fileType === 'pdf' || fileType === 'image') {
          setUploadStage('Executing Neural OCR & Markdown Structuring via Gemini 3.8 Flash...');
          base64Data = await fileToBase64(selectedFile);
        } else {
          // Read as text
          setUploadStage('Reading text content...');
          contentText = await selectedFile.text();
        }
      }

      setUploadStage('Semantic Chunking, Embedding with Gemini & Vector Indexing...');

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          category: uploadCategory,
          department: uploadDept,
          semester: uploadSem,
          version: uploadVersion,
          fileType,
          content: contentText,
          base64Data,
          mimeType: selectedFile?.type,
          autoDetectOutdated,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Upload failed');
      }

      setUploadSuccessMessage(resData.message);
      if (resData.outdatedReplacedIds && resData.outdatedReplacedIds.length > 0) {
        setUploadSuccessMessage(
          `${resData.message} (Superseded ${resData.outdatedReplacedIds.length} older documents to Outdated status)`
        );
      }

      // Reset form
      setUploadTitle('');
      setUploadContent('');
      setSelectedFile(null);
      onRefreshDocs();
      fetchAnalytics();
    } catch (err: any) {
      alert('Error ingesting document: ' + err.message);
    } finally {
      setIsUploading(false);
      setUploadStage('');
    }
  };

  // 1-Click Preset Template Ingestion
  const handleLoadSampleTemplate = (type: 'bus' | 'antiragging' | 'internship') => {
    if (type === 'bus') {
      setUploadTitle('Campus Bus Routes & Transport Fee Circular 2026–2027');
      setUploadCategory('Fees');
      setUploadDept('All');
      setUploadSem('All');
      setUploadVersion('v1.0');
      setUploadContent(`# APEX INSTITUTE OF TECHNOLOGY
## CAMPUS TRANSPORT & COMMUTER BUS SCHEDULE (2026–2027)

### 1. Routes and Timings
- **Route 1 (City Center to Campus)**: Departure at 07:45 AM from Metro Station Gate 2. Stops: Mall Road, Civil Lines, University Circle.
- **Route 2 (Green Valley & North Suburbs)**: Departure at 07:30 AM.
- **Return Buses**: Scheduled at 04:30 PM and 05:45 PM from Main Campus Gate 1.

### 2. Transport Fee
- Annual bus pass: INR 18,000 for standard routes.
- Contact: Transport Superintendent Shri K. Patil, Transport Office, Ground Floor.`);
    } else if (type === 'internship') {
      setUploadTitle('Mandatory Summer Internship & Industry Project Guidelines 2026–2027');
      setUploadCategory('Placements');
      setUploadDept('Computer Engineering');
      setUploadSem('Semester 5');
      setUploadVersion('v2.0');
      setUploadContent(`# DEPARTMENT OF COMPUTER ENGINEERING
## SUMMER INTERNSHIP & CAPSTONE PROJECT MANUAL (2026–2027)

### 1. Requirements
- Every Semester 5 student must complete an industry internship of minimum 6 weeks (minimum 240 hours).
- The internship must be with a registered tech company, startup, or recognized research laboratory (e.g. DRDO, ISRO, CDAC).
- Evaluation carries 3 academic credits and comprises:
  1. Mid-Term Progress Report & Industry Mentor Evaluation (40 marks)
  2. Final Project Presentation & Code Defense (60 marks).

### 2. Submission Deadlines
- NOC Application submission to TPO: by 15 November 2026.
- Final Report submission: First week of January 2027.`);
    }
  };

  // Toggle Outdated
  const handleToggleOutdated = async (docId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/documents/${docId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOutdated: !currentStatus }),
      });
      if (res.ok) {
        onRefreshDocs();
        fetchAnalytics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Re-index doc
  const handleReindex = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}/reindex`, { method: 'POST' });
      if (res.ok) {
        alert('Document re-indexed successfully!');
        onRefreshDocs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete doc
  const handleDeleteDoc = async (docId: string, title: string) => {
    if (!window.confirm(`Delete "${title}" and all its vector embeddings from the database?`)) return;
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshDocs();
        fetchAnalytics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Test RAG Retrieval Inspector
  const handleRunInspector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectorQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: inspectorQuery,
          department: inspectorDept,
          category: inspectorCategory,
          includeOutdated: true,
          topK: 6,
        }),
      });
      const data = await res.json();
      setInspectorResults(data.results || []);
      setSearchStats({
        queryEmbeddingTimeMs: data.queryEmbeddingTimeMs,
        searchTimeMs: data.searchTimeMs,
      });
    } catch (err: any) {
      alert('Search failed: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  // Filtered documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      doc.department.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCat = inventoryCatFilter === 'All' || doc.category === inventoryCatFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner / Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
            <span>Documents Repository</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {documents.length}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            {documents.filter((d) => !d.isOutdated).length} Active • {documents.filter((d) => d.isOutdated).length} Archived
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
            <span>Total Vector Chunks</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {analytics?.totalChunks || documents.reduce((acc, d) => acc + d.chunkCount, 0)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Indexed with gemini-embedding-2
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
            <span>Student Inquiries</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {analytics?.totalQueries || 0}
          </div>
          <div className="text-[11px] text-indigo-400 font-medium mt-1">
            Avg. Latency ~{analytics?.averageLatencyMs || 240}ms
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
            <span>Knowledge Gaps</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {analytics?.failedSearchesCount || 0}
          </div>
          <div className="text-[11px] text-amber-400 font-medium mt-1">
            Low confidence queries
          </div>
        </div>
      </div>

      {/* Admin Studio Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inventory'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Knowledge Inventory ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upload'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Ingest New Document / OCR</span>
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inspector'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>RAG Hybrid Search Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Query Analytics & Knowledge Gaps</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Controls */}
          <div className="p-4 border-b border-slate-800 bg-slate-800/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search document title or department..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <select
                value={inventoryCatFilter}
                onChange={(e) => setInventoryCatFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveTab('upload')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Department & Sem</th>
                  <th className="py-3 px-3">Version</th>
                  <th className="py-3 px-3">Chunks</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      doc.isOutdated ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <strong className="text-slate-100 font-medium block">
                            {doc.title}
                          </strong>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {doc.id} • {Math.round(doc.fileSize / 1024)} KB
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-400">
                      <div>{doc.department}</div>
                      <div className="text-[10px] text-slate-500">{doc.semester}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-300">
                      {doc.version}
                    </td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => onInspectDocument(doc)}
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                        title="Inspect Vector Chunks"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{doc.chunkCount} chunks</span>
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      {doc.isOutdated ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" />
                          Outdated
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onInspectDocument(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                          title="Inspect Chunks"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleOutdated(doc.id, doc.isOutdated)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            doc.isOutdated
                              ? 'text-emerald-400 hover:bg-emerald-500/20'
                              : 'text-amber-400 hover:bg-amber-500/20'
                          }`}
                          title={doc.isOutdated ? 'Mark as Active' : 'Mark as Outdated'}
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleReindex(doc.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                          title="Re-index Chunks"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteDoc(doc.id, doc.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: UPLOAD & INGESTION WITH OCR */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Form */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                Ingest College Document into Vector Database
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload PDFs, DOCX, TXT, or scanned image notices. Uses Gemini 3.8 Flash for OCR extraction and gemini-embedding-2 for chunk embedding.
              </p>
            </div>

            {uploadSuccessMessage && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{uploadSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fall 2026 Examination Notice & Timetable"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Department
                  </label>
                  <select
                    value={uploadDept}
                    onChange={(e) => setUploadDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="All">All Departments</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Version Tag
                  </label>
                  <input
                    type="text"
                    value={uploadVersion}
                    onChange={(e) => setUploadVersion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* File Dropzone */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Upload File (PDF / DOCX / TXT / Scanned Image)
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-2xl p-6 text-center bg-slate-950/40 transition-colors">
                  <input
                    type="file"
                    id="fileUploadInput"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                  <label htmlFor="fileUploadInput" className="cursor-pointer block">
                    <FileText className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                    <span className="text-slate-200 font-semibold block">
                      {selectedFile ? selectedFile.name : 'Choose a file or drag & drop'}
                    </span>
                    <span className="text-slate-500 text-[11px] block mt-1">
                      PDF, DOCX, TXT, MD, or scanned notice images up to 25MB
                    </span>
                  </label>
                </div>
              </div>

              {/* Content Textarea (Optional manual text) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Or Paste Document Markdown / Raw Text Directly
                </label>
                <textarea
                  rows={4}
                  placeholder="# Enter or paste college notice text here..."
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Outdated Replacement Detection */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoOutdatedCheck"
                  checked={autoDetectOutdated}
                  onChange={(e) => setAutoDetectOutdated(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700 w-4 h-4"
                />
                <label htmlFor="autoOutdatedCheck" className="text-slate-300 text-xs cursor-pointer">
                  Auto-detect older versions of this notice/timetable and mark them as <strong>Outdated</strong>
                </label>
              </div>

              {/* Progress Stage Alert */}
              {isUploading && (
                <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-xl flex items-center gap-3 text-indigo-300 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span className="font-medium">{uploadStage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>Process, Chunk, Embed & Store</span>
              </button>
            </form>
          </div>

          {/* Quick Preset Templates Sidebar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Instant Sample Ingestion
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Click to load pre-formulated official college notices to test OCR & RAG pipeline:
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => handleLoadSampleTemplate('bus')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-colors"
              >
                <strong className="text-slate-200 block">🚌 Campus Bus & Transport Circular</strong>
                <span className="text-slate-400 text-[11px]">Routes, timings, fees, transport superintendent</span>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSampleTemplate('internship')}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-colors"
              >
                <strong className="text-slate-200 block">💼 Mandatory Internship Manual</strong>
                <span className="text-slate-400 text-[11px]">Computer Eng Sem 5 credits, hours, NOC deadline</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="text-indigo-300 font-bold block">RAG Ingestion Pipeline:</span>
              <div>1. OCR & Markdown normalization</div>
              <div>2. Overlapping Chunking (400-600 chars)</div>
              <div>3. Vector Embedding (gemini-embedding-2)</div>
              <div>4. In-Memory & Persistent Vector Store</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HYBRID SEARCH INSPECTOR / PLAYGROUND */}
      {activeTab === 'inspector' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
              <Sliders className="w-5 h-5 text-indigo-400" />
              RAG Hybrid Retrieval Inspector & Score Breakdown
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter any query to observe the exact Cosine Vector Similarity score, BM25 token keyword score, hybrid rank, and retrieved chunk text.
            </p>

            <form onSubmit={handleRunInspector} className="flex flex-wrap gap-2">
              <input
                type="text"
                value={inspectorQuery}
                onChange={(e) => setInspectorQuery(e.target.value)}
                placeholder="Enter query to inspect RAG retrieval..."
                className="flex-1 min-w-[280px] bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Inspect Chunks</span>
              </button>
            </form>

            {searchStats && (
              <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                <span>Vector Embedding: {searchStats.queryEmbeddingTimeMs}ms</span>
                <span>•</span>
                <span>Hybrid Ranking: {searchStats.searchTimeMs}ms</span>
                <span>•</span>
                <span>Top Chunks Retrieved: {inspectorResults.length}</span>
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="space-y-3">
            {inspectorResults.map((res, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 font-mono">
                      Rank #{i + 1}
                    </span>
                    <strong className="text-xs text-slate-200">
                      {res.chunk.docTitle}
                    </strong>
                    <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                      {res.chunk.section}
                    </span>
                  </div>

                  {/* Scores Badges */}
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Semantic Cosine: <strong>{res.semanticScore}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      BM25 Keyword: <strong>{res.keywordScore}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Confidence: {res.relevanceConfidence}%
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {res.chunk.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS & KNOWLEDGE GAPS */}
      {activeTab === 'analytics' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Inquiries */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Most Frequently Searched Topics
            </h4>
            <div className="space-y-2 text-xs">
              {analytics.mostSearchedQueries.length === 0 ? (
                <div className="text-slate-500 py-6 text-center">No student queries logged yet.</div>
              ) : (
                analytics.mostSearchedQueries.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                  >
                    <span className="text-slate-300 line-clamp-1">{q.query}</span>
                    <span className="font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10">
                      {q.count} queries
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Knowledge Gaps / Failed Searches */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Knowledge Gaps (Zero or Low Relevance Inquiries)
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              These queries did not find confident answers in official documents. Upload relevant circulars to satisfy them:
            </p>
            <div className="space-y-2 text-xs">
              {analytics.failedQueries.length === 0 ? (
                <div className="text-emerald-400 py-6 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No knowledge gaps recorded! All inquiries matched official context.</span>
                </div>
              ) : (
                analytics.failedQueries.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-300"
                  >
                    <span className="line-clamp-1">{f.query}</span>
                    <span className="text-[10px] text-amber-400/80 shrink-0">Unsatisfied</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
