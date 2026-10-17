import React from 'react';
import Link from 'next/link';
import { cn } from '@/shared/utils/cn';
import { Button } from './button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50',
        className
      )}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
      {actionLabel && (
        <div className="mt-6">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="primary">{actionLabel}</Button>
            </Link>
          ) : onAction ? (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
