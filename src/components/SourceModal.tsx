import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, ExternalLink, Calendar, Layers } from 'lucide-react';
import { CitationSource } from '../types.ts';

interface SourceModalProps {
  source: CitationSource | null;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ source, onClose }) => {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {source.category}
                </span>
                {source.isOutdated ? (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Superseded / Outdated
                  </span>
                ) : (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Official Active Document
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-100 text-base mt-1 line-clamp-1">
                {source.docTitle}
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

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Metadata chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">Section</span>
              <strong className="text-slate-200 font-semibold">{source.section || 'General'}</strong>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block text-[11px]">Est. Page</span>
              <strong className="text-slate-200 font-semibold">Page {source.pageNumber || 1}</strong>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[11px]">RAG Match Confidence</span>
              <strong className="text-indigo-400 font-bold">{source.confidence}% Semantic Match</strong>
            </div>
          </div>

          {/* Excerpt Box */}
          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Exact Grounded Context Excerpt
            </label>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 text-sm leading-relaxed font-mono whitespace-pre-wrap select-text">
              {source.excerpt}
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-indigo-950/30 border border-indigo-800/40 p-3 rounded-xl flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              This verified passage was retrieved from the college knowledge repository by vector similarity and BM25 token matching, providing ground truth for CampusMind&apos;s answer.
            </p>
          </div>
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
