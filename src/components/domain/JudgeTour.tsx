import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, ChevronLeft, Check, ShieldCheck, HelpCircle, AlertTriangle, ListTodo } from 'lucide-react';
import { Button } from '../common/Button';

export interface JudgeTourProps {
  isOpen: boolean;
  onClose: () => void;
  onHighlightElement?: (stepId: number) => void;
}

export const JudgeTour: React.FC<JudgeTourProps> = ({ isOpen, onClose, onHighlightElement }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome Hackathon Judges! 🏆',
      badge: 'Step 1 of 5 • Core Innovation',
      icon: Sparkles,
      iconColor: 'text-amber-500 bg-amber-100 dark:bg-amber-950/80',
      description:
        'Generic chatbots summarize or chat. DigiStudentWay solves the "Digital Dark Spot" problem: revealing what critical prerequisites circulars left out, conflicting deadlines, and outdated rules before students apply.',
      actionHint: 'Click Next to see how we score Decision Readiness deterministically.',
    },
    {
      title: 'Deterministic Decision Readiness Meter 📊',
      badge: 'Step 2 of 5 • Mathematical Grounding',
      icon: ShieldCheck,
      iconColor: 'text-brand-teal bg-teal-100 dark:bg-teal-950/80',
      description:
        'Notice the Decision Readiness score: It is NOT hallucinated by an LLM prompt. It is computed from the 8-point Expected Information Matrix penalized mathematically by unresolved P1 blockers and conflicting clauses.',
      actionHint: 'Look at the top gauge and the Covered / Partial / Missing attribute breakdown.',
    },
    {
      title: 'Direct Document Contradiction Detection 🔴',
      badge: 'Step 3 of 5 • Real-World Rejection Prevention',
      icon: AlertTriangle,
      iconColor: 'text-rose-500 bg-rose-100 dark:bg-rose-950/80',
      description:
        'Inspect the Income Proof conflict: The Central NSP portal accepts Form 16 / ITR-V, but the State Directorate Circular mandates a Tehsildar Revenue Certificate and closes verification early on Oct 31. Submitting ITR causes silent rejection!',
      actionHint: 'Side-by-side quotes display exact clauses from both sources.',
    },
    {
      title: 'Information Dark Spot (Unanswered Gap) 🟣',
      badge: 'Step 4 of 5 • What Is MISSING',
      icon: HelpCircle,
      iconColor: 'text-purple-500 bg-purple-100 dark:bg-purple-950/80',
      description:
        'Inspect the Purple gap card: None of the reviewed guidelines define the minimum Year 2 renewal CGPA or 75% attendance benchmark. We supply students with the exact question to ask their college dean before submitting.',
      actionHint: 'Click "Copy inquiry" to copy the exact question text for the college helpdesk.',
    },
    {
      title: 'Anti-Hallucination Provenance & Verification Plan 📋',
      badge: 'Step 5 of 5 • Provenance Guarantee',
      icon: ListTodo,
      iconColor: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-950/80',
      description:
        'Every finding links to its raw chunk coordinates. Clicking any quote opens the Source Explorer Drawer with exact highlighted phrases. The student leaves with a prioritized P1/P2/P3 action checklist.',
      actionHint: 'Export the brief as Markdown, print-ready PDF, or share the summary.',
    },
  ];

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      onHighlightElement?.(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      onHighlightElement?.(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Tour Dialog Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-brand-navy-900 border-2 border-brand-teal shadow-soft-xl p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${step.iconColor}`}>
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-teal block">
                {step.badge}
              </span>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                {step.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {step.description}
        </p>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-navy-950 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-teal shrink-0" />
          <span>{step.actionHint}</span>
        </div>

        {/* Step dots & buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-brand-teal'
                    : idx < currentStep
                    ? 'bg-teal-300 dark:bg-teal-800'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={handlePrev} leftIcon={<ChevronLeft className="w-4 h-4" />}>
                Prev
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              rightIcon={currentStep === tourSteps.length - 1 ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            >
              {currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
