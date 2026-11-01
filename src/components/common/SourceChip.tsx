import React from 'react';
import { Globe, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';

export interface SourceChipProps {
  domain: string;
  date?: string;
  isOfficial?: boolean;
  reliabilityScore?: number;
  url?: string;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

export const SourceChip: React.FC<SourceChipProps> = ({
  domain,
  date,
  isOfficial,
  reliabilityScore,
  url,
  onClick,
  className,
  compact = false,
}) => {
  const isGovernmentOrEdu = domain.endsWith('.gov.in') || domain.endsWith('.edu.in') || domain.endsWith('.org') || isOfficial;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border transition-all text-left group',
        compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        isGovernmentOrEdu
          ? 'bg-emerald-50/70 hover:bg-emerald-100/70 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
          : 'bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200',
        'focus:outline-none focus:ring-2 focus:ring-brand-teal/40',
        className
      )}
      title={`Inspect source: ${domain} ${date ? `(Date: ${date})` : ''}`}
    >
      {isGovernmentOrEdu ? (
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      ) : (
        <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
      )}

      <span className="font-medium tracking-tight truncate max-w-[140px] sm:max-w-[200px]">
        {domain}
      </span>

      {date && (
        <>
          <span className="text-slate-400 dark:text-slate-500 text-[10px]">•</span>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-normal shrink-0">
            {formatDate(date)}
          </span>
        </>
      )}

      {reliabilityScore !== undefined && !compact && (
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold shrink-0 ml-0.5',
            reliabilityScore >= 80
              ? 'bg-emerald-200/70 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
              : 'bg-amber-200/70 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
          )}
        >
          {reliabilityScore}%
        </span>
      )}

      {url && (
        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-brand-teal transition-colors shrink-0 ml-0.5 opacity-70 group-hover:opacity-100" />
      )}
    </button>
  );
};
