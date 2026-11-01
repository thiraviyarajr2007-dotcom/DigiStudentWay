import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#080D1B] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 select-none';

    const variantStyles = {
      primary: 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-glow-blue hover:shadow-glow-purple/60 focus:ring-accent',
      secondary: 'bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-white border border-[rgba(148,163,184,0.2)] hover:border-accent/40 backdrop-blur-md shadow-soft-sm focus:ring-accent',
      ghost: 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white focus:ring-accent',
      danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-soft-sm focus:ring-rose-500/50',
      outline: 'border border-[rgba(148,163,184,0.2)] hover:border-accent/40 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white backdrop-blur-md focus:ring-accent',
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[32px]',
      md: 'text-sm px-4 py-2.5 gap-2 min-h-[40px]',
      lg: 'text-base px-6 py-3 gap-2.5 min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
