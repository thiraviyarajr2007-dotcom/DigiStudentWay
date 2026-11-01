import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Sparkles } from 'lucide-react';
import { cn, getConfidenceColor } from '../../lib/utils';

export interface ConfidenceMeterProps {
  score: number;
  sourcesCount?: number;
  gapsCount?: number;
  conflictsCount?: number;
  outdatedCount?: number;
  p1Count?: number;
  className?: string;
  size?: 'compact' | 'normal' | 'large';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  sourcesCount,
  gapsCount,
  conflictsCount,
  outdatedCount,
  p1Count,
  className,
  size = 'normal',
}) => {
  const conf = getConfidenceColor(score);
  // Normalized stroke circumference for r=42 is 2 * PI * 42 = 263.89
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Status configuration
  const statusConfig =
    score >= 80
      ? {
          title: 'Application Ready',
          badge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          desc: 'High documentation integrity. Required clauses are verified with minimal omitted prerequisites.',
          icon: ShieldCheck,
          strokeColor: '#10B981',
        }
      : score >= 50
      ? {
          title: 'Caution: Pre-Verification Required',
          badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          desc: 'Dark spots detected! Contradictory document formats or unstated renewal benchmarks need desk review.',
          icon: AlertTriangle,
          strokeColor: '#F59E0B',
        }
      : {
          title: 'High Risk: Critical Blocker Clauses',
          badge: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          desc: 'Severe document clashes and missing deadline prerequisites. Submitting now risks outright rejection.',
          icon: ShieldAlert,
          strokeColor: '#EF4444',
        };

  const StatusIcon = statusConfig.icon;

  if (size === 'compact') {
    return (
      <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border', conf.bgColor, className)}>
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-200 dark:text-slate-700"
              strokeWidth="10"
              stroke="currentColor"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeWidth="10"
              strokeLinecap="round"
              stroke={statusConfig.strokeColor}
              fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-[11px] font-extrabold text-slate-800 dark:text-slate-100 font-mono">
            {score}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Decision Readiness
          </span>
          <span className={cn('text-xs font-bold', conf.textColor)}>{statusConfig.title}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-6 rounded-3xl border transition-all bg-white dark:bg-brand-navy-900 shadow-soft-sm',
        conf.bgColor,
        className
      )}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Big Circular Gauge + Status Text */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Big Circular SVG Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-200/80 dark:text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="none"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeWidth="9"
                strokeLinecap="round"
                stroke={statusConfig.strokeColor}
                fill="none"
                className="transition-all duration-1000 ease-out drop-shadow-sm"
              />
            </svg>

            {/* Score Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white leading-none">
                {score}%
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Readiness
              </span>
            </div>
          </div>

          {/* Description & Status Badge */}
          <div className="space-y-1.5 max-w-md">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border font-mono tracking-wide',
                  statusConfig.badge
                )}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.title}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Mathematical Model
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {statusConfig.desc}
            </p>
          </div>
        </div>

        {/* Right: Quick Stat Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs shrink-0">
          {sourcesCount !== undefined && (
            <div className="p-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center min-w-[70px]">
              <span className="block font-black text-slate-900 dark:text-white text-base font-mono">
                {sourcesCount}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Sources</span>
            </div>
          )}

          {gapsCount !== undefined && (
            <div className="p-2.5 px-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-center min-w-[70px]">
              <span className="block font-black text-purple-700 dark:text-purple-300 text-base font-mono">
                {gapsCount}
              </span>
              <span className="text-[10px] text-purple-700/80 dark:text-purple-400 font-semibold block uppercase">Dark Spots</span>
            </div>
          )}

          {conflictsCount !== undefined && (
            <div className="p-2.5 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-center min-w-[70px]">
              <span className="block font-black text-rose-700 dark:text-rose-300 text-base font-mono">
                {conflictsCount}
              </span>
              <span className="text-[10px] text-rose-700/80 dark:text-rose-400 font-semibold block uppercase">Conflicts</span>
            </div>
          )}

          {outdatedCount !== undefined && (
            <div className="p-2.5 px-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-center min-w-[70px]">
              <span className="block font-black text-amber-700 dark:text-amber-300 text-base font-mono">
                {outdatedCount}
              </span>
              <span className="text-[10px] text-amber-700/80 dark:text-amber-400 font-semibold block uppercase">Stale</span>
            </div>
          )}

          {p1Count !== undefined && (
            <div className="p-2.5 px-3 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 text-center min-w-[70px]">
              <span className="block font-black text-base font-mono">
                {p1Count}
              </span>
              <span className="text-[10px] font-bold block uppercase">P1 Pending</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
