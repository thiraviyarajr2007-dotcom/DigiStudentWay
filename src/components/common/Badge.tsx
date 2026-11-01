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
    // Green = Sourced fact (#22C55E)
    fact: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
    // Red = Conflict (#F43F5E)
    conflict: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30',
    // Orange = Outdated / undated (#F59E0B)
    outdated: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
    // Purple = Unanswered gap / dark spot (#A78BFA)
    gap: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30',
    // Blue dashed border + "AI suggestion" badge (#3B82F6)
    ai: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-dashed border-blue-400/50 shadow-sm',
    // Gray = Uncertainty / low confidence (#94A3B8)
    uncertainty: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30',
    // General Brand & Neutral
    neutral: 'bg-slate-900/5 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10',
    brand: 'bg-primary/10 dark:bg-primary/15 text-blue-700 dark:text-blue-300 border border-primary/30',
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
