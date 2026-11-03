import React from 'react';
import { cn } from '@/shared/utils/cn';

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

/** Centered page column with responsive horizontal padding (360 / 768 / 1280+). */
export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Alternate surface to separate neighbouring sections without hardcoded colors. */
  tone?: 'default' | 'muted';
}

/** Vertical rhythm for a landing section. Pass `aria-labelledby` pointing at its heading. */
export function Section({ className, tone = 'default', ...props }: SectionProps) {
  return (
    <section
      className={cn(
        'scroll-mt-20 py-12 md:py-16 lg:py-24 border-t border-border',
        tone === 'muted' ? 'bg-card dark:bg-muted' : 'bg-background',
        className,
      )}
      {...props}
    />
  );
}

