import React from 'react';
import { Sparkles, AlertTriangle, HelpCircle, CheckCircle2, Clock, HelpCircle as UncertaintyIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SemanticType } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: SemanticType | 'neutral' | 'brand';
  size?: 'sm' | 'md';
  icon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  icon = true,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] font-semibold px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-lg gap-1.5',
  };

  const variantStyles = {
    // Green = Sourced fact
    fact: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    // Red = Conflict
    conflict: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    // Orange = Outdated / undated
    outdated: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    // Purple = Unanswered gap
    gap: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    // Blue dashed border + "AI suggestion" badge
    ai: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-dashed border-blue-400 dark:border-blue-500 shadow-sm',
    // Gray = Uncertainty / low confidence
    uncertainty: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700',
    // General Brand & Neutral
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60',
    brand: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800',
  };

  const renderIcon = () => {
    if (!icon) return null;
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
    switch (variant) {
      case 'fact':
        return <CheckCircle2 className={iconSize} />;
      case 'conflict':
        return <AlertTriangle className={iconSize} />;
      case 'outdated':
        return <Clock className={iconSize} />;
      case 'gap':
        return <HelpCircle className={iconSize} />;
      case 'ai':
        return <Sparkles className={iconSize} />;
      case 'uncertainty':
        return <UncertaintyIcon className={iconSize} />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center tracking-tight transition-colors',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {renderIcon()}
      <span>{children}</span>
    </span>
  );
};
