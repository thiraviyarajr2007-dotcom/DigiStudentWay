import React from 'react';
import { HelpCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { GapItem } from '../../types';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { cn } from '../../lib/utils';

export interface GapCardProps {
  gap: GapItem;
  onConsultSource?: (sourceDomain: string) => void;
  onAskQuestion?: (question: string) => void;
}

export const GapCard: React.FC<GapCardProps> = ({ gap, onConsultSource, onAskQuestion }) => {
  return (
    <Card
      className={cn(
        'p-5 sm:p-6 transition-all border-l-4 relative overflow-hidden',
        gap.isAiSuggestion
          ? 'border-l-blue-500 border-dashed border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20'
          : 'border-l-purple-500 border-purple-100 dark:border-purple-900/40 bg-white dark:bg-brand-navy-900'
      )}
      hoverEffect
    >
      {/* Top badges bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {gap.isAiSuggestion ? (
            <Badge variant="ai" size="sm">
              AI Suggestion (Unverified)
            </Badge>
          ) : (
            <Badge variant="gap" size="sm">
              Information Dark Spot
            </Badge>
          )}

          <span
            className={cn(
              'text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded',
              gap.severity === 'high'
                ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                : gap.severity === 'medium'
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            )}
          >
            {gap.severity} risk
          </span>

          <span className="text-xs text-slate-400 capitalize hidden sm:inline">
            Category: {gap.category}
          </span>
        </div>

        {/* Consulted sources count */}
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Scanned across {gap.sourcesConsulted.length} sources
        </span>
      </div>

      {/* Title */}
      <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-2">
        {gap.title}
      </h4>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
        {gap.description}
      </p>

      {/* Why it matters box */}
      <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-purple-900 dark:text-purple-200">
              Why this gap matters:{' '}
            </span>
            <span className="text-purple-800 dark:text-purple-300">
              {gap.whyItMatters}
            </span>
          </div>
        </div>
      </div>

      {/* Action / Next Question to ask */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            Suggested inquiry:
          </span>
          <span className="text-xs text-brand-navy-600 dark:text-teal-300 italic font-medium">
            "{gap.suggestedQuestionToAsk}"
          </span>
        </div>

        {onAskQuestion && (
          <button
            type="button"
            onClick={() => onAskQuestion(gap.suggestedQuestionToAsk)}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-teal hover:text-teal-700 dark:hover:text-teal-400 shrink-0 self-end sm:self-auto"
          >
            Copy inquiry <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Consulted source pills */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] text-slate-400 mr-1">Consulted:</span>
        {gap.sourcesConsulted.map((domain, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onConsultSource && onConsultSource(domain)}
            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors font-mono"
          >
            {domain}
          </button>
        ))}
      </div>
    </Card>
  );
};
