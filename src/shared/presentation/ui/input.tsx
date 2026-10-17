import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-800 dark:text-slate-200"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={type}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'flex w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors min-h-[44px]',
              'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
              'dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
              error
                ? 'border-rose-500 focus-visible:ring-rose-500 dark:border-rose-500'
                : 'border-slate-300 focus-visible:ring-teal-600 dark:border-slate-700 dark:focus-visible:ring-teal-500',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p id={errorId} className="text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
