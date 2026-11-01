import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getConfidenceColor(score: number): {
  color: string;
  bgColor: string;
  textColor: string;
  label: string;
} {
  if (score >= 80) {
    return {
      color: '#10B981',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      label: 'High Confidence'
    };
  }
  if (score >= 50) {
    return {
      color: '#F59E0B',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-700 dark:text-amber-400',
      label: 'Moderate Gaps'
    };
  }
  return {
    color: '#EF4444',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    textColor: 'text-rose-700 dark:text-rose-400',
    label: 'High Dark Spots'
  };
}
