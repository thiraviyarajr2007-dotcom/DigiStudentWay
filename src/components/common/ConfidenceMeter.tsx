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
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          desc: 'High documentation integrity. Required clauses are verified with minimal omitted prerequisites.',
          icon: ShieldCheck,
          strokeStart: '#3B82F6',
          strokeEnd: '#8B5CF6',
          glowColor: 'rgba(59, 130, 246, 0.45)',
        }
      : score >= 50
      ? {
          title: 'Caution: Pre-Verification Required',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          desc: 'Dark spots detected! Contradictory document formats or unstated renewal benchmarks need desk review.',
          icon: AlertTriangle,
          strokeStart: '#F59E0B',
          strokeEnd: '#F97316',
          glowColor: 'rgba(245, 158, 11, 0.45)',
        }
      : {
          title: 'High Risk: Critical Blocker Clauses',
          badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          desc: 'Severe document clashes and missing deadline prerequisites. Submitting now risks outright rejection.',
          icon: ShieldAlert,
          strokeStart: '#EF4444',
          strokeEnd: '#F43F5E',
          glowColor: 'rgba(239, 68, 68, 0.45)',
        };

  const StatusIcon = statusConfig.icon;
  const gradientId = `readiness-grad-${size}-${score}`;

  if (size === 'compact') {
    return (
      <div className={cn('inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border bg-[#101A2E]/80 backdrop-blur-md border-[rgba(148,163,184,0.15)] shadow-soft-sm', className)}>
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id={`${gradientId}-compact`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={statusConfig.strokeStart} />
                <stop offset="100%" stopColor={statusConfig.strokeEnd} />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-800"
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
              stroke={`url(#${gradientId}-compact)`}
              fill="none"
              style={{ filter: `drop-shadow(0 0 3px ${statusConfig.glowColor})` }}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-[11px] font-extrabold text-white font-heading">
            {score}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading">
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
        'p-6 rounded-3xl border transition-all bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border-[rgba(148,163,184,0.15)] shadow-soft',
        className
      )}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Big Circular Gauge + Status Text */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Big Circular SVG Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={statusConfig.strokeStart} />
                  <stop offset="100%" stopColor={statusConfig.strokeEnd} />
                </linearGradient>
              </defs>
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-800/80"
                strokeWidth="8"
                stroke="currentColor"
                fill="none"
              />
              {/* Animated Progress Arc with Glow */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeWidth="9"
                strokeLinecap="round"
                stroke={`url(#${gradientId})`}
                fill="none"
                style={{ filter: `drop-shadow(0 0 6px ${statusConfig.glowColor})` }}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Score Center Label with Space Grotesk numerals */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white leading-none tracking-tight">
                {score}%
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1 font-heading">
                Readiness
              </span>
            </div>
          </div>

          {/* Description & Status Badge */}
          <div className="space-y-1.5 max-w-md">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border font-heading tracking-wide',
                  statusConfig.badge
                )}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.title}
              </span>
              <span className="text-xs text-slate-400 font-heading">
                Mathematical Model
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {statusConfig.desc}
            </p>
          </div>
        </div>

        {/* Right: Quick Stat Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs shrink-0">
          {sourcesCount !== undefined && (
            <div className="p-2.5 px-3 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-[rgba(148,163,184,0.15)] text-center min-w-[70px]">
              <span className="block font-black text-white text-base font-heading">
                {sourcesCount}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Sources</span>
            </div>
          )}

          {gapsCount !== undefined && (
            <div className="p-2.5 px-3 rounded-2xl bg-purple-500/10 backdrop-blur-md border border-purple-500/30 text-center min-w-[70px]">
              <span className="block font-black text-purple-300 text-base font-heading">
                {gapsCount}
              </span>
              <span className="text-[10px] text-purple-400 font-semibold block uppercase">Dark Spots</span>
            </div>
          )}

          {conflictsCount !== undefined && (
            <div className="p-2.5 px-3 rounded-2xl bg-rose-500/10 backdrop-blur-md border border-rose-500/30 text-center min-w-[70px]">
              <span className="block font-black text-rose-300 text-base font-heading">
                {conflictsCount}
              </span>
              <span className="text-[10px] text-rose-400 font-semibold block uppercase">Conflicts</span>
            </div>
          )}

          {outdatedCount !== undefined && (
            <div className="p-2.5 px-3 rounded-2xl bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-center min-w-[70px]">
              <span className="block font-black text-amber-300 text-base font-heading">
                {outdatedCount}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold block uppercase">Stale</span>
            </div>
          )}

          {p1Count !== undefined && (
            <div className="p-2.5 px-3 rounded-2xl bg-rose-500/15 backdrop-blur-md text-rose-200 border border-rose-500/40 text-center min-w-[70px]">
              <span className="block font-black text-base font-heading">
                {p1Count}
              </span>
              <span className="text-[10px] font-bold block uppercase text-rose-300">P1 Pending</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
