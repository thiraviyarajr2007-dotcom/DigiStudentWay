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
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30 font-heading',
      border: 'border-l-rose-500',
    },
    P2: {
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-heading',
      border: 'border-l-amber-500',
    },
    P3: {
      badge: 'bg-primary/15 text-blue-300 border-primary/30 font-heading',
      border: 'border-l-primary',
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
        'p-4 sm:p-5 rounded-2xl border border-l-4 transition-all duration-200 flex items-start gap-3.5 backdrop-blur-xl',
        priorityStyles[displayItem.priority].border,
        displayItem.completed
          ? 'bg-slate-900/40 border-[rgba(148,163,184,0.15)] opacity-60'
          : 'bg-[rgba(16,26,46,0.7)] border-[rgba(148,163,184,0.15)] shadow-soft hover:shadow-glow-blue/10 hover:-translate-y-0.5'
      )}
    >
      {/* Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={displayItem.completed}
        onClick={() => onToggle(displayItem.id)}
        className={cn(
          'w-5 h-5 rounded-lg flex items-center justify-center border mt-0.5 transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-accent',
          displayItem.completed
            ? 'bg-gradient-to-r from-primary to-secondary border-primary text-white shadow-glow-blue'
            : 'border-[rgba(148,163,184,0.3)] hover:border-accent bg-white/5'
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
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 capitalize">
            {getActionIcon()}
            {displayItem.actionType.replace('_', ' ')}
          </span>

          {/* Verification Badge */}
          {displayItem.type === 'ai_suggestion' ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-primary/15 text-blue-300 border border-dashed border-primary/40 font-heading">
              <Sparkles className="w-2.5 h-2.5 text-primary" />
              Unverified AI Hypothesis
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-heading">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              Verified Quote
            </span>
          )}

          {/* Language Indicator */}
          {displayItem.isTamilApplied && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/15 text-accent font-semibold border border-primary/30">
              🇮🇳 தமிழ்
            </span>
          )}

          {displayItem.deadline && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 ml-auto font-mono">
              <Clock className="w-3 h-3" /> Due {displayItem.deadline}
            </span>
          )}
        </div>

        <h5
          className={cn(
            'text-sm font-semibold mb-1 text-white font-heading',
            displayItem.completed && 'line-through text-slate-500'
          )}
        >
          {displayItem.title}
        </h5>

        <p className="text-xs text-slate-300 mb-2.5 leading-relaxed">
          <strong className="text-slate-200">
            {language === 'ta' ? 'காரணம்:' : 'Why:'}{' '}
          </strong>
          {displayItem.reason}
        </p>

        {/* Action instruction */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-[rgba(148,163,184,0.10)] text-xs text-slate-300 flex items-start gap-2">
          <strong className="text-accent shrink-0 font-heading">
            {language === 'ta' ? 'செயல்முறை:' : 'Step:'}
          </strong>
          <span>{displayItem.suggestedAction}</span>
        </div>

        {/* Where to verify */}
        {displayItem.whereToVerify && (
          <div className="mt-2.5 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="font-semibold text-accent font-heading">
              {language === 'ta' ? 'சரிபார்க்க வேண்டிய இடம்:' : 'Where to verify:'}
            </span>
            <span className="font-medium text-slate-200">
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
              className="text-accent hover:text-white underline underline-offset-2 transition-colors font-mono"
            >
              {displayItem.sourceRef}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
