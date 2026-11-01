import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { cn, getConfidenceColor } from '../../lib/utils';

export interface ConfidenceMeterProps {
  score: number;
  sourcesCount?: number;
  gapsCount?: number;
  conflictsCount?: number;
  className?: string;
  size?: 'compact' | 'normal' | 'large';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  sourcesCount,
  gapsCount,
  conflictsCount,
  className,
  size = 'normal',
}) => {
  const conf = getConfidenceColor(score);
  const strokeDashoffset = 100 - score;

  if (size === 'compact') {
    return (
      <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border', conf.bgColor, className)}>
        <div className="relative w-7 h-7 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200 dark:text-slate-700"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              strokeDasharray="100, 100"
              strokeDashoffset={strokeDashoffset}
              strokeWidth="3.8"
              strokeLinecap="round"
              stroke={conf.color}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-slate-800 dark:text-slate-100 font-mono">
            {score}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Clarity Score
          </span>
          <span className={cn('text-xs font-bold', conf.textColor)}>{conf.label}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-center gap-5 justify-between',
        conf.bgColor,
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Radial Progress Meter */}
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200 dark:text-slate-700/60"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="transition-all duration-1000 ease-out"
              strokeDasharray="100, 100"
              strokeDashoffset={strokeDashoffset}
              strokeWidth="4"
              strokeLinecap="round"
              stroke={conf.color}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white leading-none">
              {score}%
            </span>
          </div>
        </div>

        {/* Text descriptions */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
              Information Integrity: <span className={conf.textColor}>{conf.label}</span>
            </h3>
            {score >= 80 ? (
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            ) : score >= 50 ? (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md">
            {score >= 80
              ? 'Sources are consistent with minimal missing requirements. Follow standard checklists.'
              : score >= 50
              ? 'Significant dark spots detected: Missing renewal benchmark & conflicting income docs need pre-verification.'
              : 'Critical information contradictions! Do NOT submit without official desk confirmation.'}
          </p>
        </div>
      </div>

      {/* Mini metric badges */}
      {(sourcesCount !== undefined || gapsCount !== undefined || conflictsCount !== undefined) && (
        <div className="flex items-center gap-3 shrink-0 text-xs font-medium">
          {sourcesCount !== undefined && (
            <div className="bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700 text-center">
              <span className="block font-bold text-slate-900 dark:text-white text-sm font-mono">{sourcesCount}</span>
              <span className="text-[11px] text-slate-500">Cross-Checked</span>
            </div>
          )}
          {gapsCount !== undefined && (
            <div className="bg-purple-100/70 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
              <span className="block font-bold text-purple-700 dark:text-purple-300 text-sm font-mono">{gapsCount}</span>
              <span className="text-[11px] text-purple-700/80 dark:text-purple-400">Dark Spots</span>
            </div>
          )}
          {conflictsCount !== undefined && (
            <div className="bg-rose-100/70 dark:bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-center">
              <span className="block font-bold text-rose-700 dark:text-rose-300 text-sm font-mono">{conflictsCount}</span>
              <span className="text-[11px] text-rose-700/80 dark:text-rose-400">Conflicts</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
