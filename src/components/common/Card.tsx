import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  glass = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200',
        glass
          ? 'glassmorphism'
          : 'bg-white/90 dark:bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border-slate-200/80 dark:border-[rgba(148,163,184,0.15)] shadow-soft',
        hoverEffect && 'hover:shadow-glow-blue/20 hover:border-primary/40 dark:hover:border-[rgba(148,163,184,0.3)] hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
