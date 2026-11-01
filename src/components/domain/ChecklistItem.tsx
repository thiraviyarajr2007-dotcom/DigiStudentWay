import React from 'react';
import { Check, Clock, PhoneCall, FileText, CheckCircle2 } from 'lucide-react';
import { ChecklistItem as ChecklistItemType, PriorityLevel } from '../../types';
import { cn } from '../../lib/utils';

export interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onOpenSource?: (sourceRef?: string) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ item, onToggle, onOpenSource }) => {
  const priorityStyles: Record<PriorityLevel, { badge: string; border: string }> = {
    P1: {
      badge: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      border: 'border-l-rose-500',
    },
    P2: {
      badge: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      border: 'border-l-amber-500',
    },
    P3: {
      badge: 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      border: 'border-l-blue-500',
    },
  };

  const getActionIcon = () => {
    switch (item.actionType) {
      case 'call_helpdesk':
        return <PhoneCall className="w-3.5 h-3.5" />;
      case 'request_document':
        return <FileText className="w-3.5 h-3.5" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      className={cn(
        'p-4 rounded-xl border border-l-4 transition-all duration-200 flex items-start gap-3.5',
        priorityStyles[item.priority].border,
        item.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
          : 'bg-white dark:bg-brand-navy-900 border-slate-200/90 dark:border-slate-800 shadow-soft-sm hover:shadow-soft'
      )}
    >
      {/* Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={item.completed}
        onClick={() => onToggle(item.id)}
        className={cn(
          'w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-teal/50',
          item.completed
            ? 'bg-emerald-600 border-emerald-600 text-white'
            : 'border-slate-300 dark:border-slate-600 hover:border-brand-teal dark:hover:border-brand-teal bg-white dark:bg-slate-800'
        )}
      >
        {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {/* Priority Tag */}
          <span
            className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono tracking-wider',
              priorityStyles[item.priority].badge
            )}
          >
            {item.priority} Action
          </span>

          {/* Action type pill */}
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 capitalize">
            {getActionIcon()}
            {item.actionType.replace('_', ' ')}
          </span>

          {item.deadline && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 ml-auto">
              <Clock className="w-3 h-3" /> Due {item.deadline}
            </span>
          )}
        </div>

        <h5
          className={cn(
            'text-sm font-semibold mb-1 text-slate-900 dark:text-white',
            item.completed && 'line-through text-slate-400 dark:text-slate-500'
          )}
        >
          {item.title}
        </h5>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
          <strong className="text-slate-700 dark:text-slate-200">Why: </strong>
          {item.reason}
        </p>

        {/* Action instruction */}
        <div className="p-2.5 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <strong className="text-brand-teal shrink-0">Step:</strong>
          <span>{item.suggestedAction}</span>
        </div>

        {item.whereToVerify && (
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="font-semibold text-brand-teal">Where to verify:</span>
            <span>{item.whereToVerify}</span>
          </div>
        )}

        {item.sourceRef && (
          <div className="mt-2 text-[11px] text-slate-400">
            Based on:{' '}
            <button
              type="button"
              onClick={() => onOpenSource && onOpenSource(item.sourceRef)}
              className="text-brand-navy-400 hover:text-brand-teal dark:text-teal-400 underline underline-offset-2 transition-colors"
            >
              {item.sourceRef}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
