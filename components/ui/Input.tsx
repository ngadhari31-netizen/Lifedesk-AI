import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wider text-[#112D4E] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3F72AF]/70">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'block w-full rounded-xl border border-[#DBE2EF] bg-white/90 backdrop-blur-sm px-3.5 py-2.5 text-sm text-[#112D4E] placeholder-[#3F72AF]/40 transition-all duration-200',
              'focus:border-[#3F72AF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/20 focus:shadow-md',
              'disabled:bg-[#DBE2EF]/30 disabled:text-[#112D4E]/40',
              icon && 'pl-10',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
