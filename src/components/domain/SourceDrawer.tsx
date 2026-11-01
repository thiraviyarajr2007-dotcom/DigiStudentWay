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
              <mark className="bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold px-1.5 py-0.5 rounded shadow-sm">
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
        className="fixed inset-0 bg-[#080D1B]/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#101A2E]/95 backdrop-blur-2xl border-l border-[rgba(148,163,184,0.15)] shadow-soft-xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right text-slate-100">
          {/* Header */}
          <div className="p-6 border-b border-[rgba(148,163,184,0.15)] flex items-start justify-between bg-[#080D1B]/60 backdrop-blur-md">
            <div className="pr-4">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {source.isOfficial ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Official Authority (.gov/.edu)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/5 text-slate-300 border border-white/10 px-2.5 py-0.5 rounded-lg">
                    <Globe className="w-3.5 h-3.5 text-slate-400" /> Secondary Reference
                  </span>
                )}
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  Reliability: {source.reliabilityScore}%
                </span>
                {activeChunkIndex !== undefined && (
                  <span className="text-[10px] font-mono bg-primary/20 text-blue-300 border border-primary/30 px-2 py-0.5 rounded-lg">
                    Chunk #{activeChunkIndex}
                  </span>
                )}
              </div>
              <h3 className="font-heading font-extrabold text-white text-base leading-snug tracking-tight">
                {source.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Metadata pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-[rgba(148,163,184,0.15)]">
              <div>
                <span className="text-slate-400 block mb-0.5">Source Domain:</span>
                <span className="font-semibold text-slate-200 font-mono">
                  {source.domain}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Published / Circular Date:</span>
                <span className="font-semibold text-slate-200">
                  {source.publishDate ? formatDate(source.publishDate) : 'Not Specified (Undated)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Scanned By DigiStudentWay:</span>
                <span className="font-semibold text-slate-200">
                  {formatDate(source.crawledDate)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Source Type:</span>
                <span className="font-semibold text-slate-200 capitalize">
                  {source.sourceType.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Credibility Signals Note */}
            {source.credibilitySignals && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-[rgba(148,163,184,0.15)] text-xs">
                <span className="font-semibold text-slate-300 block mb-0.5 font-heading">
                  Credibility Signals Heuristic:
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {source.credibilitySignals.domainNotes}
                </p>
              </div>
            )}

            {/* Focused Highlight Snippet */}
            {quoteToHighlight && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-heading">
                    <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                    Exact Quoted Claim / Clause
                  </h4>
                  <span className="text-[10px] text-amber-300 font-bold uppercase font-mono">
                    Verified Raw Quote
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-200 leading-relaxed">
                  "{quoteToHighlight}"
                </div>
              </div>
            )}

            {/* Document Full Text Context */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-heading">
                  <FileText className="w-4 h-4 text-accent" />
                  Full Ingested Text & Chunk Coordinates
                </h4>
                {source.chunks && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {source.chunks.length} Chunks
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#080D1B]/80 border border-[rgba(148,163,184,0.15)] text-xs leading-relaxed text-slate-300 font-mono max-h-72 overflow-y-auto whitespace-pre-line">
                {renderHighlightedText()}
              </div>
            </div>

            {/* Provenance Guarantee Note */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-accent block mb-0.5 font-heading">
                  Anti-Hallucination Provenance Guarantee
                </span>
                DigiStudentWay ensures all findings cite verifiable verbatim phrases from raw official documents, guarding against generative hallucination.
              </div>
            </div>
          </div>

          {/* Footer with External Link */}
          <div className="p-4 px-6 border-t border-[rgba(148,163,184,0.15)] bg-[#080D1B]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-400 truncate max-w-[240px] font-mono">
              {source.url}
            </span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-xs font-semibold shadow-glow-blue transition-all"
            >
              Open Original Circular <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
