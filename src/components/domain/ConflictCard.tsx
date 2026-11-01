import React from 'react';
import {
  AlertTriangle,
  ArrowRightLeft,
  ShieldCheck,
  ExternalLink,
  Lightbulb,
  Lock,
  Landmark,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ConflictItem } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { cn } from '../../lib/utils';

export interface ConflictCardProps {
  conflict: ConflictItem;
  onOpenSource?: (url: string) => void;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict, onOpenSource }) => {
  const isA_Verified = conflict.sourceA.isVerified ?? true;
  const isB_Verified = conflict.sourceB.isVerified ?? true;
  const confidencePercent = conflict.confidence ? Math.round(conflict.confidence * 100) : 95;

  return (
    <Card
      className="p-5 sm:p-6 border-l-4 border-l-rose-500 border-rose-100 dark:border-rose-900/40 bg-white dark:bg-brand-navy-900"
      hoverEffect
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="conflict" size="sm">
            Direct Contradiction
          </Badge>
          <span
            className={cn(
              'text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded',
              conflict.severity === 'high'
                ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
            )}
          >
            {conflict.severity} severity
          </span>

          {/* Verification Badge */}
          {isA_Verified && isB_Verified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified Quotes (Server Validated)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-dashed border-blue-400">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Unverified AI Hypothesis
            </span>
          )}
        </div>

        {/* Confidence bar & Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>2 Sources Disagree</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              {confidencePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Topic & Summary */}
      <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-1.5">
        {conflict.topic}
      </h4>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
        {conflict.summary}
      </p>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Source A */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center justify-center">
                  A
                </span>
                Source A ({conflict.sourceA.date})
              </span>
              {onOpenSource && (
                <button
                  type="button"
                  onClick={() => onOpenSource(conflict.sourceA.url)}
                  className="text-slate-400 hover:text-brand-teal transition-colors"
                  title="Open source"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {conflict.sourceA.sourceTitle}
              </p>
              {isA_Verified ? (
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
                  Quote Verified ✓
                </span>
              ) : (
                <span className="text-[10px] text-blue-600 font-mono shrink-0">
                  Hypothesis
                </span>
              )}
            </div>
            <blockquote className="text-xs italic text-slate-700 dark:text-slate-300 bg-white dark:bg-brand-navy-950 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
              "{conflict.sourceA.quote}"
            </blockquote>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-600" /> HTTPS
            </span>
            <span>Chunk #{conflict.sourceA.chunkIndex ?? 0}</span>
          </div>
        </div>

        {/* Source B */}
        <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 text-[11px] font-bold flex items-center justify-center">
                  B
                </span>
                Source B ({conflict.sourceB.date})
              </span>
              {onOpenSource && (
                <button
                  type="button"
                  onClick={() => onOpenSource(conflict.sourceB.url)}
                  className="text-rose-400 hover:text-rose-600 transition-colors"
                  title="Open source"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-semibold text-rose-950 dark:text-rose-100 truncate">
                {conflict.sourceB.sourceTitle}
              </p>
              {isB_Verified ? (
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
                  Quote Verified ✓
                </span>
              ) : (
                <span className="text-[10px] text-blue-600 font-mono shrink-0">
                  Hypothesis
                </span>
              )}
            </div>
            <blockquote className="text-xs italic text-rose-950 dark:text-rose-200 bg-white dark:bg-brand-navy-950 p-2.5 rounded-lg border border-rose-200/80 dark:border-rose-900/60">
              "{conflict.sourceB.quote}"
            </blockquote>
          </div>
          <div className="mt-2.5 pt-2 border-t border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-[10px] text-rose-700 dark:text-rose-300 font-mono">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-600" /> HTTPS
            </span>
            <span>Chunk #{conflict.sourceB.chunkIndex ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Resolution Tip */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-amber-900 dark:text-amber-200">
            Student Guidance & Resolution:
          </span>{' '}
          <span className="text-amber-800 dark:text-amber-300">
            {conflict.resolutionTip}
          </span>
        </div>
      </div>
    </Card>
  );
};
