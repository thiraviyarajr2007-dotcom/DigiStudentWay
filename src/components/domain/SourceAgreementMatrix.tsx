import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Minus,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { Source, ExpectedAttributeCheck, ConflictItem, OutdatedItem, FactItem } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export interface SourceAgreementMatrixProps {
  sources: Source[];
  expectedAttributes: ExpectedAttributeCheck[];
  conflicts: ConflictItem[];
  outdated: OutdatedItem[];
  facts: FactItem[];
  onOpenSourceDrawer: (source: Source, quote?: string, chunkIdx?: number) => void;
}

export interface CellStatus {
  status: 'stated' | 'conflict' | 'outdated' | 'missing';
  quote?: string;
  chunkIndex?: number;
  label: string;
}

export const SourceAgreementMatrix: React.FC<SourceAgreementMatrixProps> = ({
  sources,
  expectedAttributes,
  conflicts,
  outdated,
  facts,
  onOpenSourceDrawer,
}) => {
  // Helper to determine cell status for a given attribute and source
  const getCellStatus = (attr: ExpectedAttributeCheck, src: Source): CellStatus => {
    const attrLower = attr.label.toLowerCase();
    const attrId = attr.attributeId.toLowerCase();

    // 1. Check if there is a conflict involving this source and attribute
    const matchingConflict = conflicts.find(c => {
      const topicMatches =
        c.topic.toLowerCase().includes(attrId) ||
        c.summary.toLowerCase().includes(attrId) ||
        (attrId === 'documents' && c.topic.toLowerCase().includes('income proof')) ||
        (attrId === 'deadline' && c.topic.toLowerCase().includes('cut-off'));

      if (!topicMatches) return false;
      return c.sourceA.sourceId === src.id || c.sourceB.sourceId === src.id;
    });

    if (matchingConflict) {
      const isSrcA = matchingConflict.sourceA.sourceId === src.id;
      const quote = isSrcA ? matchingConflict.sourceA.quote : matchingConflict.sourceB.quote;
      const chunkIndex = isSrcA ? matchingConflict.sourceA.chunkIndex : matchingConflict.sourceB.chunkIndex;
      return {
        status: 'conflict',
        quote,
        chunkIndex,
        label: 'Conflicting Clause',
      };
    }

    // 2. Check if this source is flagged as outdated for this topic
    const matchingOutdated = outdated.find(o => {
      if (o.sourceId !== src.id) return false;
      return (
        o.title.toLowerCase().includes(attrId) ||
        o.warningText.toLowerCase().includes(attrId) ||
        (attrId === 'income_ceiling' && o.warningText.includes('income'))
      );
    });

    if (matchingOutdated) {
      return {
        status: 'outdated',
        quote: matchingOutdated.warningText,
        label: `Stale Cycle (${matchingOutdated.stalenessMonths}m out of date)`,
      };
    }

    // 3. Check if there is a verified fact from this source matching the attribute
    const matchingFact = facts.find(f => {
      if (f.sourceId !== src.id) return false;
      const text = (f.statement + ' ' + f.exactQuote).toLowerCase();
      if (attrId === 'eligibility' && (text.includes('eligible') || text.includes('undergraduate') || text.includes('degree'))) return true;
      if (attrId === 'income_ceiling' && (text.includes('income') || text.includes('ceiling') || text.includes('lakh'))) return true;
      if (attrId === 'deadline' && (text.includes('deadline') || text.includes('date') || text.includes('november') || text.includes('october'))) return true;
      if (attrId === 'documents' && (text.includes('certificate') || text.includes('proof') || text.includes('itr') || text.includes('form 16'))) return true;
      if (attrId === 'disbursement' && (text.includes('dbt') || text.includes('tranche') || text.includes('account') || text.includes('reimbursement'))) return true;
      if (attrId === 'portal_link' && (text.includes('portal') || text.includes('url') || text.includes('link'))) return true;
      return text.includes(attrLower);
    });

    if (matchingFact) {
      return {
        status: 'stated',
        quote: matchingFact.exactQuote,
        chunkIndex: matchingFact.chunkIndex,
        label: 'Verifiable Quote',
      };
    }

    // 4. Fallback check inside source fullText / excerpt
    const srcText = (src.fullText || src.excerpt || '').toLowerCase();
    if (
      (attrId === 'eligibility' && srcText.includes('eligible')) ||
      (attrId === 'income_ceiling' && srcText.includes('income')) ||
      (attrId === 'deadline' && (srcText.includes('deadline') || srcText.includes('cut-off'))) ||
      (attrId === 'documents' && (srcText.includes('certificate') || srcText.includes('form 16'))) ||
      (attrId === 'disbursement' && (srcText.includes('dbt') || srcText.includes('disbursement'))) ||
      (attrId === 'portal_link' && srcText.includes('portal'))
    ) {
      return {
        status: 'stated',
        quote: src.excerpt?.slice(0, 120),
        label: 'Covered in Notice',
      };
    }

    return {
      status: 'missing',
      label: 'Not Addressed',
    };
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-brand-teal text-xs font-semibold mb-1 border border-brand-teal/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature Multi-Source Agreement Matrix</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
            Source Cross-Correlation Grid
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Click any cell to inspect the source drawer with highlighted verbatim quotes. Purple glowing rows denote Digital Dark Spots omitted by all reviewed sources.
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Stated
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <AlertTriangle className="w-3.5 h-3.5" /> Contradiction
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" /> Outdated
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            <Minus className="w-3.5 h-3.5" /> Omitted
          </span>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 text-xs font-heading uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4 font-bold min-w-[200px]">
                Expected Attribute
              </th>
              {sources.map(src => (
                <th key={src.id} className="py-3.5 px-4 font-bold min-w-[150px]">
                  <div className="flex flex-col">
                    <span className="text-slate-900 dark:text-white font-bold truncate max-w-[180px]">
                      {src.domain}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono normal-case truncate max-w-[180px]">
                      {src.isOfficial ? '🏛️ Official Portal' : '📄 Secondary Guide'}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {expectedAttributes.map(attr => {
              // Check if entire row is missing across all sources = Digital Dark Spot
              const isDarkSpotRow = sources.every(src => {
                const c = getCellStatus(attr, src);
                return c.status === 'missing';
              });

              return (
                <tr
                  key={attr.attributeId}
                  className={`transition-colors duration-150 ${
                    isDarkSpotRow
                      ? 'bg-purple-50/70 dark:bg-purple-950/30 border-l-4 border-l-purple-600 hover:bg-purple-100/60 dark:hover:bg-purple-950/50'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Attribute Row Header */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {isDarkSpotRow && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping shrink-0" />
                      )}
                      <div>
                        <span
                          className={`font-semibold block ${
                            isDarkSpotRow
                              ? 'text-purple-900 dark:text-purple-200 font-bold'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {attr.label}
                        </span>
                        {isDarkSpotRow && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                            <HelpCircle className="w-3 h-3" /> Digital Dark Spot (Omitted)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Source Columns */}
                  {sources.map(src => {
                    const cell = getCellStatus(attr, src);

                    return (
                      <td key={src.id} className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => onOpenSourceDrawer(src, cell.quote, cell.chunkIndex)}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all group flex items-start gap-2 ${
                            cell.status === 'stated'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 text-emerald-950 dark:text-emerald-100'
                              : cell.status === 'conflict'
                              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 hover:border-rose-500 text-rose-950 dark:text-rose-100 ring-1 ring-rose-500/20'
                              : cell.status === 'outdated'
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 hover:border-amber-400 text-amber-950 dark:text-amber-100'
                              : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={cell.quote ? `Quote: "${cell.quote}"` : 'Click to inspect in source drawer'}
                        >
                          {/* Icon indicator */}
                          <div className="shrink-0 mt-0.5">
                            {cell.status === 'stated' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : cell.status === 'conflict' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
                            ) : cell.status === 'outdated' ? (
                              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            ) : (
                              <Minus className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>

                          {/* Content label */}
                          <div className="min-w-0 flex-1">
                            <span className="font-bold block text-[11px] leading-tight truncate">
                              {cell.label}
                            </span>
                            {cell.quote ? (
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 italic mt-0.5">
                                "{cell.quote}"
                              </p>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono">
                                No mention
                              </span>
                            )}
                          </div>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
