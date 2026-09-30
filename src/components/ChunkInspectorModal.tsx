import React, { useState } from 'react';
import { X, Layers, Hash, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { DocumentChunk, DocumentMetadata } from '../types.ts';

interface ChunkInspectorModalProps {
  document: DocumentMetadata | null;
  chunks: DocumentChunk[];
  onClose: () => void;
}

export const ChunkInspectorModal: React.FC<ChunkInspectorModalProps> = ({
  document,
  chunks,
  onClose,
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  if (!document) return null;

  const filteredChunks = chunks.filter(
    (c) =>
      c.section.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.text.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Vector Store Chunks
                </span>
                <span className="text-xs text-slate-400">
                  {chunks.length} Total Chunks Indexed
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-base mt-0.5 line-clamp-1">
                {document.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Filter chunks by keyword or section title..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          <span className="text-xs text-slate-400 shrink-0 font-medium">
            Showing {filteredChunks.length} of {chunks.length}
          </span>
        </div>

        {/* Chunks List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {filteredChunks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No vector chunks match &ldquo;{searchFilter}&rdquo;.
            </div>
          ) : (
            filteredChunks.map((chunk, index) => (
              <div
                key={chunk.id || index}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Chunk #{index + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {chunk.section}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Est. Page {chunk.pageNumber || 1}</span>
                    <span>•</span>
                    <span>~{chunk.tokenCount} tokens</span>
                    {chunk.isOutdated && (
                      <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                        Outdated
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-800/80">
                  {chunk.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-800/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
