import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SemanticLegend: React.FC<{ className?: string }> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(true);

  const legendItems = [
    {
      color: 'bg-[#22C55E]',
      label: 'Sourced Fact',
      desc: 'Verified clause with linked primary source',
      badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    },
    {
      color: 'bg-[#F43F5E]',
      label: 'Conflict',
      desc: 'Two or more sources state contradictory terms',
      badgeClass: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    },
    {
      color: 'bg-[#F59E0B]',
      label: 'Outdated / Undated',
      desc: 'References old application cycle or lacks timestamp',
      badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    },
    {
      color: 'bg-[#A78BFA]',
      label: 'Unanswered Gap',
      desc: 'Critical prerequisites completely omitted',
      badgeClass: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    },
    {
      color: 'bg-[#3B82F6]',
      label: 'AI Suggestion',
      desc: 'AI hypothesis, requires human desk verification',
      badgeClass: 'border-blue-400/40 border-dashed bg-blue-500/10 text-blue-300',
    },
    {
      color: 'bg-[#94A3B8]',
      label: 'Low Confidence',
      desc: 'Sparse, ambiguous or unconfirmed statements',
      badgeClass: 'border-[rgba(148,163,184,0.2)] bg-white/5 text-slate-300',
    },
  ];

  return (
    <div
      className={cn(
        'rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[rgba(16,26,46,0.7)] backdrop-blur-xl p-4 transition-all shadow-soft',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-accent" />
            Platform Semantic Color System
          </h4>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-white text-xs flex items-center gap-1 p-1 rounded-lg hover:bg-white/5 transition-colors"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? 'Minimize' : 'Show Colors'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-3 pt-3 border-t border-[rgba(148,163,184,0.15)]">
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
