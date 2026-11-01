import React from 'react';
import { Sparkles, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AIBanner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'p-3.5 sm:p-4 rounded-2xl border border-dashed border-blue-300 dark:border-blue-800/80 bg-blue-50/70 dark:bg-blue-950/30 flex items-start sm:items-center justify-between gap-3 shadow-soft-sm',
        className
      )}
      role="alert"
    >
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 sm:mt-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs text-blue-950 dark:text-blue-100 leading-relaxed">
          <span className="font-bold mr-1">Verification Advisory:</span>
          AI-generated findings are potential information gaps and discrepancy alerts, not guaranteed final legal facts. Always cross-check with the institutional nodal officer before submission.
        </div>
      </div>
      <div className="shrink-0 hidden md:block">
        <span className="text-[10px] font-mono px-2 py-1 rounded bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-semibold uppercase tracking-wider">
          Hackathon 2026 Guardrail
        </span>
      </div>
    </div>
  );
};
