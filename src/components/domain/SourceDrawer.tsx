import React from 'react';
import { X, ExternalLink, ShieldCheck, Globe, Calendar, FileText, CheckCircle2, Bookmark, Layers } from 'lucide-react';
import { Source } from '../../types';
import { cn, formatDate } from '../../lib/utils';

export interface SourceDrawerProps {
  source: Source | null;
  isOpen: boolean;
  onClose: () => void;
  activeHighlightQuote?: string;
  activeChunkIndex?: number;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({
  source,
  isOpen,
  onClose,
  activeHighlightQuote,
  activeChunkIndex,
}) => {
  if (!isOpen || !source) return null;

  const quoteToHighlight = activeHighlightQuote || source.highlightedText || '';
  const textToDisplay = source.fullText || source.excerpt || '';

  // Render text with highlight
  const renderHighlightedText = () => {
    if (!quoteToHighlight || !textToDisplay.includes(quoteToHighlight)) {
      return <span>{textToDisplay}</span>;
    }

    const parts = textToDisplay.split(quoteToHighlight);
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <mark className="bg-amber-200 dark:bg-amber-800/90 text-amber-950 dark:text-amber-100 font-semibold px-1 py-0.5 rounded shadow-sm">
                {quoteToHighlight}
              </mark>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-brand-navy-900 border-l border-slate-200 dark:border-slate-800 shadow-soft-xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-brand-navy-950/60">
            <div className="pr-4">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {source.isOfficial ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" /> Official Authority (.gov/.edu)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                    <Globe className="w-3.5 h-3.5" /> Secondary Reference
                  </span>
                )}
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  Reliability: {source.reliabilityScore}%
                </span>
                {activeChunkIndex !== undefined && (
                  <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                    Chunk #{activeChunkIndex}
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base leading-snug">
                {source.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Metadata pills */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <div>
                <span className="text-slate-400 block mb-0.5">Source Domain:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {source.domain}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Published / Circular Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {source.publishDate ? formatDate(source.publishDate) : 'Not Specified (Undated)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Scanned By DigiStudentWay:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(source.crawledDate)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Source Type:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {source.sourceType.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Credibility Signals Note */}
            {source.credibilitySignals && (
              <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Credibility Signals Heuristic:
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  {source.credibilitySignals.domainNotes}
                </p>
              </div>
            )}

            {/* Focused Highlight Snippet */}
            {quoteToHighlight && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                    Exact Quoted Claim / Clause
                  </h4>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase font-mono">
                    Verified Raw Quote
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs font-semibold text-amber-950 dark:text-amber-100 leading-relaxed">
                  "{quoteToHighlight}"
                </div>
              </div>
            )}

            {/* Document Full Text Context */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-teal" />
                  Full Ingested Text & Chunk Coordinates
                </h4>
                {source.chunks && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {source.chunks.length} Chunks
                  </span>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-brand-navy-950 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-serif max-h-72 overflow-y-auto whitespace-pre-line">
                {renderHighlightedText()}
              </div>
            </div>

            {/* Provenance Guarantee Note */}
            <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold text-teal-900 dark:text-teal-200 block mb-0.5">
                  Anti-Hallucination Provenance Guarantee
                </span>
                DigiStudentWay ensures all findings cite verifiable verbatim phrases from raw official documents, guarding against generative hallucination.
              </div>
            </div>
          </div>

          {/* Footer with External Link */}
          <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-brand-navy-950 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 truncate max-w-[240px]">
              {source.url}
            </span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-navy dark:bg-slate-800 hover:bg-brand-navy-700 dark:hover:bg-slate-700 text-white text-xs font-semibold shadow-soft-sm transition-all"
            >
              Open Original Circular <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
