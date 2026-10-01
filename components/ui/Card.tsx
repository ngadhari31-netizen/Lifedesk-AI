import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  effect3d?: boolean;
  glass?: boolean;
}

export function Card({
  children,
  className,
  hover = false,
  effect3d = false,
  glass = false,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        effect3d
          ? 'card-3d rounded-2xl p-0.5'
          : glass
          ? 'glass-card rounded-2xl'
          : 'bg-white/85 backdrop-blur-md border border-[#DBE2EF] rounded-2xl shadow-card transition-all duration-300',
        hover && !effect3d && 'hover:-translate-y-1 hover:shadow-card-hover hover:border-[#3F72AF]/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'px-6 py-4 border-b border-[#DBE2EF] flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'px-6 py-3.5 bg-[#DBE2EF]/25 border-t border-[#DBE2EF] rounded-b-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
