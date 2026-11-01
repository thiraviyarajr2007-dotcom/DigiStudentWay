import React from 'react';
import { HelpCircle, AlertCircle, ArrowRight, Sparkles, ShieldCheck, Lock, Landmark } from 'lucide-react';
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
  const isHypothesis = gap.isAiSuggestion || gap.type === 'ai_suggestion';
  const confidencePercent = gap.confidence ? Math.round(gap.confidence * 100) : 85;

  return (
    <Card
      className={cn(
        'p-5 sm:p-6 transition-all border-l-4 relative overflow-hidden',
        isHypothesis
          ? 'border-l-blue-500 border-dashed border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20'
          : 'border-l-purple-500 border-purple-100 dark:border-purple-900/40 bg-white dark:bg-brand-navy-900'
      )}
      hoverEffect
    >
      {/* Top badges bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Verified vs AI hypothesis badge */}
          {isHypothesis ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-dashed border-blue-400">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Unverified AI Hypothesis
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              <HelpCircle className="w-3 h-3 text-purple-600" />
              Verified Gap (Omitted Clause)
            </span>
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

        {/* Confidence bar */}
        <div className="flex items-center gap-2">
          <div className="w-16 sm:w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                confidencePercent >= 90
                  ? 'bg-emerald-500'
                  : confidencePercent >= 75
                  ? 'bg-brand-teal'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">
            {confidencePercent}% conf
          </span>
        </div>
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
            className="text-xs font-semibold text-brand-teal hover:underline inline-flex items-center gap-1 shrink-0 self-end sm:self-auto"
          >
            <span>Copy inquiry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Credibility signals strip */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Landmark className="w-3 h-3 text-slate-400" />
            Cross-examined across {gap.sourcesConsulted.length} sources
          </span>
          <span className="inline-flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" /> HTTPS Verified
          </span>
        </div>
        {gap.sourcesConsulted.length > 0 && onConsultSource && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Sources:</span>
            {gap.sourcesConsulted.slice(0, 2).map((srcName, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onConsultSource(srcName)}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-teal font-mono"
              >
                {srcName}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
