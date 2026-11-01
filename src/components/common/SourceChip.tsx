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
        'inline-flex items-center gap-1.5 rounded-xl border backdrop-blur-md transition-all text-left group hover:-translate-y-0.5 select-none focus:outline-none focus:ring-2 focus:ring-accent',
        compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        isGovernmentOrEdu
          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 shadow-soft-sm'
          : 'bg-white/5 hover:bg-white/10 border-[rgba(148,163,184,0.15)] hover:border-accent/40 text-slate-200 shadow-soft-sm',
        className
      )}
      title={`Inspect source: ${domain} ${date ? `(Date: ${date})` : ''}`}
    >
      {isGovernmentOrEdu ? (
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      ) : (
        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      )}

      <span className="font-medium tracking-tight truncate max-w-[140px] sm:max-w-[200px]">
        {domain}
      </span>

      {date && (
        <>
          <span className="text-slate-500 text-[10px]">•</span>
          <span className="text-[11px] text-slate-400 font-normal shrink-0">
            {formatDate(date)}
          </span>
        </>
      )}

      {reliabilityScore !== undefined && !compact && (
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ml-0.5',
            reliabilityScore >= 80
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          )}
        >
          {reliabilityScore}%
        </span>
      )}

      {url && (
        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-accent transition-colors shrink-0 ml-0.5 opacity-70 group-hover:opacity-100" />
      )}
    </button>
  );
};
