import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { StudentDashboard } from './components/StudentDashboard.tsx';
import { AdminStudio } from './components/AdminStudio.tsx';
import { SourceModal } from './components/SourceModal.tsx';
import { ChunkInspectorModal } from './components/ChunkInspectorModal.tsx';
import { CitationSource, DocumentChunk, DocumentMetadata } from './types.ts';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'student' | 'admin'>('student');
  const [selectedDept, setSelectedDept] = useState<string>('Computer Engineering');
  const [selectedSem, setSelectedSem] = useState<string>('Semester 5');
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [totalChunks, setTotalChunks] = useState<number>(0);

  // Modals state
  const [activeCitationSource, setActiveCitationSource] = useState<CitationSource | null>(null);
  const [inspectingDoc, setInspectingDoc] = useState<DocumentMetadata | null>(null);
  const [inspectingChunks, setInspectingChunks] = useState<DocumentChunk[]>([]);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
        const sumChunks = data.documents.reduce((acc: number, d: DocumentMetadata) => acc + (d.chunkCount || 0), 0);
        setTotalChunks(sumChunks);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Inspect chunks for a document
  const handleInspectDocument = async (doc: DocumentMetadata) => {
    setInspectingDoc(doc);
    try {
      const res = await fetch(`/api/documents/${doc.id}`);
      const data = await res.json();
      setInspectingChunks(data.chunks || []);
    } catch (err) {
      console.error('Error fetching document chunks:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Navigation */}
      <Header
        currentMode={currentMode}
        setCurrentMode={setCurrentMode}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedSem={selectedSem}
        setSelectedSem={setSelectedSem}
        docCount={documents.length}
        chunkCount={totalChunks}
      />

      {/* Main Mode View */}
      <main className="flex-1 flex flex-col">
        {currentMode === 'student' ? (
          <StudentDashboard
            selectedDept={selectedDept}
            selectedSem={selectedSem}
            onOpenSourceModal={(src) => setActiveCitationSource(src)}
            documents={documents}
          />
        ) : (
          <AdminStudio
            documents={documents}
            onRefreshDocs={fetchDocuments}
            onInspectDocument={handleInspectDocument}
          />
        )}
      </main>

      {/* Citation Inspector Modal */}
      <SourceModal
        source={activeCitationSource}
        onClose={() => setActiveCitationSource(null)}
      />

      {/* Document Chunks Inspector Modal */}
      <ChunkInspectorModal
        document={inspectingDoc}
        chunks={inspectingChunks}
        onClose={() => {
          setInspectingDoc(null);
          setInspectingChunks([]);
        }}
      />

    </div>
  );
}
