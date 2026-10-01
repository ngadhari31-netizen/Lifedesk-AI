import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral' | 'navy' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-[#DBE2EF] text-[#112D4E] border border-[#3F72AF]/30 shadow-xs',
    navy: 'bg-[#112D4E] text-[#F9F7F7] border border-[#112D4E] shadow-sm',
    blue: 'bg-[#3F72AF] text-[#F9F7F7] border border-[#2E5E9B] shadow-sm',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs',
    warning: 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs',
    danger: 'bg-rose-100 text-rose-800 border border-rose-300 shadow-xs',
    info: 'bg-[#DBE2EF] text-[#112D4E] border border-[#3F72AF]/40 shadow-xs',
    purple: 'bg-[#DBE2EF] text-[#3F72AF] border border-[#3F72AF]/30 shadow-xs',
    neutral: 'bg-[#F9F7F7] text-[#112D4E] border border-[#DBE2EF] shadow-xs',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-semibold',
  };

  return (
    <span className={clsx('inline-flex items-center gap-1 backdrop-blur-xs', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
