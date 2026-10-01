import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success' | 'navy' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

    const variants = {
      primary:
        'btn-3d text-white focus:ring-[#3F72AF]',
      navy:
        'btn-3d-navy text-[#F9F7F7] focus:ring-[#112D4E]',
      secondary:
        'bg-[#DBE2EF] hover:bg-[#ccd7e8] text-[#112D4E] border-b-2 border-[#b8c7dc] shadow-sm hover:shadow active:translate-y-0.5 focus:ring-[#3F72AF]',
      outline:
        'border-2 border-[#3F72AF] text-[#112D4E] hover:bg-[#DBE2EF]/40 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow active:translate-y-0.5 focus:ring-[#3F72AF]',
      glass:
        'glass text-[#112D4E] hover:bg-white/90 border border-white/80 shadow-glass hover:shadow-lg active:translate-y-0.5 focus:ring-[#3F72AF]',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white border-b-2 border-rose-800 shadow-sm active:translate-y-0.5 focus:ring-rose-500',
      success:
        'bg-emerald-600 hover:bg-emerald-700 text-white border-b-2 border-emerald-800 shadow-sm active:translate-y-0.5 focus:ring-emerald-500',
      ghost:
        'text-[#112D4E] hover:bg-[#DBE2EF]/50 hover:text-[#112D4E] focus:ring-[#3F72AF]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
