import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Step {
  id: number;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between relative">
          {/* Connector line */}
          <div
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-brand-teal transition-all duration-500 ease-in-out -z-0"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            aria-hidden="true"
          />

          {steps.map(step => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <li key={step.id} className="relative flex flex-col items-center group">
                <button
                  type="button"
                  disabled={!onStepClick || step.id > currentStep + 1}
                  onClick={() => onStepClick && onStepClick(step.id)}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ring-4',
                    isCompleted &&
                      'bg-brand-teal text-white ring-teal-100 dark:ring-teal-950/60 shadow-soft-sm',
                    isCurrent &&
                      'bg-white dark:bg-brand-navy-900 border-2 border-brand-teal text-brand-teal ring-teal-200/80 dark:ring-teal-900/60 shadow-soft',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-400 ring-transparent',
                    onStepClick && step.id <= currentStep + 1 ? 'cursor-pointer' : 'cursor-default'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </button>

                {/* Step title label */}
                <div className="text-center mt-2 absolute top-10 whitespace-nowrap">
                  <span
                    className={cn(
                      'text-xs font-semibold block transition-colors',
                      isCurrent && 'text-brand-teal dark:text-brand-teal font-bold',
                      isCompleted && 'text-slate-800 dark:text-slate-200',
                      !isCompleted && !isCurrent && 'text-slate-400 dark:text-slate-500'
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-[10px] text-slate-400 hidden sm:block">
                      {step.description}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
      {/* Spacer for bottom labels */}
      <div className="h-8" />
    </div>
  );
};
