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
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-800 -z-0"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary shadow-glow-blue transition-all duration-500 ease-in-out -z-0"
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
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 font-heading',
                    isCompleted &&
                      'bg-gradient-to-r from-primary to-secondary text-white ring-primary/25 shadow-glow-blue',
                    isCurrent &&
                      'bg-[#101A2E] border-2 border-primary text-white ring-primary/30 shadow-glow-blue',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-slate-900/80 border border-[rgba(148,163,184,0.2)] text-slate-500 ring-transparent',
                    onStepClick && step.id <= currentStep + 1 ? 'cursor-pointer hover:border-accent/40' : 'cursor-default'
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
                      'text-xs font-semibold block transition-colors font-heading',
                      isCurrent && 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-bold',
                      isCompleted && 'text-slate-200 font-medium',
                      !isCompleted && !isCurrent && 'text-slate-500'
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
