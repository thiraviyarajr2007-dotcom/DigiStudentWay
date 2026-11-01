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
      className="p-5 sm:p-6 border-l-4 border-l-rose-500 border-rose-500/30 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl shadow-soft"
      hoverEffect
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="conflict" size="sm">
            Possible Conflict
          </Badge>
          <span
            className={cn(
              'text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-heading',
              conflict.severity === 'high'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            )}
          >
            {conflict.severity} severity
          </span>

          {/* Verification Badge */}
          {isA_Verified && isB_Verified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-heading">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Sourced (Verified Quotes)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-primary/15 text-blue-300 border border-dashed border-primary/40 font-heading">
              <Sparkles className="w-3 h-3 text-primary" />
              AI Suggestion
            </span>
          )}
        </div>

        {/* Confidence bar & Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>2 Sources Disagree</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold">
              {confidencePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Topic & Summary */}
      <h4 className="font-heading font-extrabold text-white text-base sm:text-lg mb-1.5 tracking-tight">
        {conflict.topic}
      </h4>
      <p className="text-sm text-slate-300 mb-5 leading-relaxed">
        {conflict.summary}
      </p>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Source A */}
        <div className="p-4 rounded-xl bg-white/5 border border-[rgba(148,163,184,0.15)] flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-heading">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-accent text-[11px] font-bold flex items-center justify-center">
                  A
                </span>
                Source A ({conflict.sourceA.date})
              </span>
              {onOpenSource && (
                <button
                  type="button"
                  onClick={() => onOpenSource(conflict.sourceA.url)}
                  className="text-slate-400 hover:text-accent transition-colors"
                  title="Open source"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {conflict.sourceA.sourceTitle}
              </p>
              {isA_Verified ? (
                <span className="text-[10px] text-emerald-400 font-bold shrink-0 font-heading">
                  Quote Verified ✓
                </span>
              ) : (
                <span className="text-[10px] text-blue-400 font-mono shrink-0">
                  Hypothesis
                </span>
              )}
            </div>
            <blockquote className="text-xs italic text-slate-200 bg-[#080D1B]/80 p-2.5 rounded-lg border border-[rgba(148,163,184,0.15)]">
              "{conflict.sourceA.quote}"
            </blockquote>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[rgba(148,163,184,0.10)] flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-400" /> HTTPS
            </span>
            <span>Chunk #{conflict.sourceA.chunkIndex ?? 0}</span>
          </div>
        </div>

        {/* Source B */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-rose-300 flex items-center gap-1.5 font-heading">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold flex items-center justify-center">
                  B
                </span>
                Source B ({conflict.sourceB.date})
              </span>
              {onOpenSource && (
                <button
                  type="button"
                  onClick={() => onOpenSource(conflict.sourceB.url)}
                  className="text-rose-400 hover:text-rose-300 transition-colors"
                  title="Open source"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-semibold text-rose-100 truncate">
                {conflict.sourceB.sourceTitle}
              </p>
              {isB_Verified ? (
                <span className="text-[10px] text-emerald-400 font-bold shrink-0 font-heading">
                  Quote Verified ✓
                </span>
              ) : (
                <span className="text-[10px] text-blue-400 font-mono shrink-0">
                  Hypothesis
                </span>
              )}
            </div>
            <blockquote className="text-xs italic text-rose-100 bg-[#080D1B]/80 p-2.5 rounded-lg border border-rose-500/30">
              "{conflict.sourceB.quote}"
            </blockquote>
          </div>
          <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex items-center justify-between text-[10px] text-rose-300 font-mono">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-400" /> HTTPS
            </span>
            <span>Chunk #{conflict.sourceB.chunkIndex ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Resolution Tip */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-amber-200 font-heading">
            Student Guidance & Resolution:
          </span>{' '}
          <span className="text-amber-300/90 leading-relaxed">
            {conflict.resolutionTip}
          </span>
        </div>
      </div>
    </Card>
  );
};
