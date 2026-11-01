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
          : 'bg-white dark:bg-brand-navy-900 border-slate-200/80 dark:border-slate-800 shadow-soft-sm',
        hoverEffect && 'hover:shadow-soft hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
