import React from 'react';
import clsx from 'clsx';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'blue' | 'navy';
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'blue' | 'navy';
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
  return (
    <div className="card-3d rounded-2xl p-5 hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#112D4E]/70">
          {title}
        </span>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DBE2EF] text-[#3F72AF] border border-[#3F72AF]/30 shadow-xs">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#112D4E] tracking-tight">
          {value}
        </div>
        {(subtitle || change) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs text-[#112D4E]/70">
            {change && (
              <span
                className={clsx(
                  'font-bold px-1.5 py-0.5 rounded',
                  changeType === 'positive'
                    ? 'text-emerald-700 bg-emerald-100'
                    : changeType === 'negative'
                    ? 'text-rose-700 bg-rose-100'
                    : 'text-[#112D4E] bg-[#DBE2EF]'
                )}
              >
                {change}
              </span>
            )}
            {subtitle && <span className="font-medium">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
