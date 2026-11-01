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
        'p-5 sm:p-6 transition-all border-l-4 relative overflow-hidden backdrop-blur-xl',
        isHypothesis
          ? 'border-l-primary border-dashed border-primary/30 bg-primary/10 shadow-soft'
          : 'border-l-purple-500 border-purple-500/30 bg-[rgba(16,26,46,0.7)] shadow-soft'
      )}
      hoverEffect
    >
      {/* Top badges bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Verified vs AI hypothesis badge */}
          {isHypothesis ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-blue-300 border border-dashed border-primary/40 font-heading">
              <Sparkles className="w-3 h-3 text-primary" />
              Unverified AI Hypothesis
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-heading">
              <HelpCircle className="w-3 h-3 text-purple-400" />
              Verified Gap (Omitted Clause)
            </span>
          )}

          <span
            className={cn(
              'text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-heading',
              gap.severity === 'high'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : gap.severity === 'medium'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-white/5 text-slate-400 border border-white/10'
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
          <div className="w-16 sm:w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                confidencePercent >= 90
                  ? 'bg-emerald-400 shadow-sm'
                  : confidencePercent >= 75
                  ? 'bg-primary'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">
            {confidencePercent}% conf
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="font-heading font-extrabold text-white text-base sm:text-lg mb-2 tracking-tight">
        {gap.title}
      </h4>

      {/* Description */}
      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
        {gap.description}
      </p>

      {/* Why it matters box */}
      <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 mb-4 backdrop-blur-sm">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-purple-200 font-heading">
              Why this gap matters:{' '}
            </span>
            <span className="text-purple-300/90 leading-relaxed">
              {gap.whyItMatters}
            </span>
          </div>
        </div>
      </div>

      {/* Action / Next Question to ask */}
      <div className="p-3 rounded-xl bg-white/5 border border-[rgba(148,163,184,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 shrink-0 font-heading">
            Suggested inquiry:
          </span>
          <span className="text-xs text-accent italic font-medium">
            "{gap.suggestedQuestionToAsk}"
          </span>
        </div>

        {onAskQuestion && (
          <button
            type="button"
            onClick={() => onAskQuestion(gap.suggestedQuestionToAsk)}
            className="text-xs font-semibold text-accent hover:text-white inline-flex items-center gap-1 shrink-0 self-end sm:self-auto transition-colors"
          >
            <span>Copy inquiry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Credibility signals strip */}
      <div className="mt-3 pt-3 border-t border-[rgba(148,163,184,0.15)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Landmark className="w-3 h-3 text-slate-400" />
            Cross-examined across {gap.sourcesConsulted.length} sources
          </span>
          <span className="inline-flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> HTTPS Verified
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
                className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-accent font-mono transition-colors"
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
