import React from 'react';
import clsx from 'clsx';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  // Support both icon as component or as JSX element
  icon?: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
}

export function StatsCard({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon,
  variant,
  color,
}: StatsCardProps) {
  const resolvedVariant = variant || color || 'indigo';

  const iconVariants: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && (
          <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', iconVariants[resolvedVariant])}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {value}
        </div>
        {(subtitle || change) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
            {change && (
              <span
                className={clsx(
                  'font-semibold',
                  changeType === 'positive'
                    ? 'text-emerald-600'
                    : changeType === 'negative'
                    ? 'text-rose-600'
                    : 'text-slate-500'
                )}
              >
                {change}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
