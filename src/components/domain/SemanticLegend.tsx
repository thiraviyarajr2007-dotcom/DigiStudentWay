import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SemanticLegend: React.FC<{ className?: string }> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(true);

  const legendItems = [
    {
      color: 'bg-emerald-500',
      label: 'Sourced Fact',
      desc: 'Verified clause with linked primary source',
      badgeClass: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300',
    },
    {
      color: 'bg-rose-500',
      label: 'Conflict',
      desc: 'Two or more sources state contradictory terms',
      badgeClass: 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300',
    },
    {
      color: 'bg-amber-500',
      label: 'Outdated / Undated',
      desc: 'References old application cycle or lacks timestamp',
      badgeClass: 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300',
    },
    {
      color: 'bg-purple-500',
      label: 'Unanswered Gap',
      desc: 'Critical prerequisites completely omitted',
      badgeClass: 'border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300',
    },
    {
      color: 'bg-blue-500',
      label: 'AI Suggestion',
      desc: 'AI hypothesis, requires human desk verification',
      badgeClass: 'border-blue-400 dark:border-blue-700 border-dashed bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300',
    },
    {
      color: 'bg-slate-400',
      label: 'Low Confidence',
      desc: 'Sparse, ambiguous or unconfirmed statements',
      badgeClass: 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    },
  ];

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-brand-navy-900/90 backdrop-blur-sm p-4 transition-all shadow-soft-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-brand-teal" />
            Platform Semantic Color System
          </h4>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs flex items-center gap-1 p-1 rounded transition-colors"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? 'Minimize' : 'Show Colors'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {legendItems.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'p-2 rounded-xl border text-xs flex flex-col justify-between transition-transform hover:scale-[1.02]',
                item.badgeClass
              )}
            >
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                <span className={cn('w-2 h-2 rounded-full shrink-0', item.color)} />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="text-[10px] opacity-80 leading-tight">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
