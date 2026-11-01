import React from 'react';
import { Check, Clock, PhoneCall, FileText, CheckCircle2, Sparkles, MapPin, Building, Lock } from 'lucide-react';
import { ChecklistItem as ChecklistItemType, PriorityLevel } from '../../types';
import { getTranslatedChecklistItem } from '../../lib/tamilTranslation';
import { cn } from '../../lib/utils';

export interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onOpenSource?: (sourceRef?: string) => void;
  language?: 'en' | 'ta';
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onToggle,
  onOpenSource,
  language = 'en',
}) => {
  const displayItem = getTranslatedChecklistItem(item, language);

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
    switch (displayItem.actionType) {
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
        'p-4 sm:p-5 rounded-xl border border-l-4 transition-all duration-200 flex items-start gap-3.5',
        priorityStyles[displayItem.priority].border,
        displayItem.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
          : 'bg-white dark:bg-brand-navy-900 border-slate-200/90 dark:border-slate-800 shadow-soft-sm hover:shadow-soft'
      )}
    >
      {/* Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={displayItem.completed}
        onClick={() => onToggle(displayItem.id)}
        className={cn(
          'w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-teal/50',
          displayItem.completed
            ? 'bg-emerald-600 border-emerald-600 text-white'
            : 'border-slate-300 dark:border-slate-600 hover:border-brand-teal dark:hover:border-brand-teal bg-white dark:bg-slate-800'
        )}
      >
        {displayItem.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {/* Priority Tag */}
          <span
            className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono tracking-wider',
              priorityStyles[displayItem.priority].badge
            )}
          >
            {displayItem.priority} {language === 'ta' ? 'நடவடிக்கை' : 'Action'}
          </span>

          {/* Action type pill */}
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 capitalize">
            {getActionIcon()}
            {displayItem.actionType.replace('_', ' ')}
          </span>

          {/* Verification Badge */}
          {displayItem.type === 'ai_suggestion' ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-dashed border-blue-400">
              <Sparkles className="w-2.5 h-2.5 text-blue-500" />
              Unverified AI Hypothesis
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
              Verified Quote
            </span>
          )}

          {/* Language Indicator */}
          {displayItem.isTamilApplied && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 font-semibold border border-teal-300 dark:border-teal-800">
              🇮🇳 தமிழ்
            </span>
          )}

          {displayItem.deadline && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 ml-auto">
              <Clock className="w-3 h-3" /> Due {displayItem.deadline}
            </span>
          )}
        </div>

        <h5
          className={cn(
            'text-sm font-semibold mb-1 text-slate-900 dark:text-white',
            displayItem.completed && 'line-through text-slate-400 dark:text-slate-500'
          )}
        >
          {displayItem.title}
        </h5>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2.5 leading-relaxed">
          <strong className="text-slate-700 dark:text-slate-200">
            {language === 'ta' ? 'காரணம்:' : 'Why:'}{' '}
          </strong>
          {displayItem.reason}
        </p>

        {/* Action instruction */}
        <div className="p-2.5 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <strong className="text-brand-teal shrink-0">
            {language === 'ta' ? 'செயல்முறை:' : 'Step:'}
          </strong>
          <span>{displayItem.suggestedAction}</span>
        </div>

        {/* Where to verify */}
        {displayItem.whereToVerify && (
          <div className="mt-2.5 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-brand-teal shrink-0" />
            <span className="font-semibold text-brand-teal">
              {language === 'ta' ? 'சரிபார்க்க வேண்டிய இடம்:' : 'Where to verify:'}
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {displayItem.whereToVerify}
            </span>
          </div>
        )}

        {/* Source link */}
        {displayItem.sourceRef && (
          <div className="mt-2 text-[11px] text-slate-400">
            {language === 'ta' ? 'ஆதாரம்:' : 'Based on:'}{' '}
            <button
              type="button"
              onClick={() => onOpenSource && onOpenSource(displayItem.sourceRef)}
              className="text-brand-navy-400 hover:text-brand-teal dark:text-teal-400 underline underline-offset-2 transition-colors"
            >
              {displayItem.sourceRef}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
