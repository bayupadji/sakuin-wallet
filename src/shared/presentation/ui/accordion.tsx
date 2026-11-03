import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface AccordionItemData {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: readonly AccordionItemData[];
}

/**
 * Accordion built on native <details>/<summary>: keyboard operable (Enter/Space),
 * announced with expanded state by browsers, and readable with JavaScript off.
 */
export function Accordion({ items, className, ...props }: AccordionProps) {
  return (
    <div className={cn('divide-y divide-border rounded-xl border border-border bg-card', className)} {...props}>
      {items.map((item) => (
        <details key={item.id} className="group">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-left text-base font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            <span className="text-balance">{item.question}</span>
            <ChevronDown
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground text-pretty">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}

