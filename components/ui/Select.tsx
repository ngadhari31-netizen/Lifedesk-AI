import React from 'react';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wider text-[#112D4E] mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'block w-full rounded-xl border border-[#DBE2EF] bg-white/90 backdrop-blur-sm px-3.5 py-2.5 text-sm text-[#112D4E] transition-all duration-200',
            'focus:border-[#3F72AF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3F72AF]/20 focus:shadow-md',
            'disabled:bg-[#DBE2EF]/30 disabled:text-[#112D4E]/40',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
