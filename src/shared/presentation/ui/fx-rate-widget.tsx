'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { ArrowRightLeft, Clock, TrendingUp } from 'lucide-react';

export interface FxRateWidgetProps {
  rateIdr?: number;
  guaranteedMinutes?: number;
  className?: string;
  compact?: boolean;
}

export function FxRateWidget({
  rateIdr = 16250,
  guaranteedMinutes = 15,
  className,
  compact = false,
}: FxRateWidgetProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(guaranteedMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : guaranteedMinutes * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [guaranteedMinutes]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const formattedRate = rateIdr.toLocaleString('id-ID');

  if (compact) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
          className
        )}
      >
        <TrendingUp className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
        <span className="font-mono tabular-nums">1 USD = Rp {formattedRate}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono tabular-nums">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {timeFormatted}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <ArrowRightLeft className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          Guaranteed Exchange Rate
        </span>
        <span className="flex items-center gap-1 text-[11px] font-mono tabular-nums text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
          <Clock className="h-3 w-3" aria-hidden="true" />
          Locked for {timeFormatted}
        </span>
      </div>

      <div className="mt-2.5 flex items-baseline justify-between">
        <div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            $1.00 USD
          </span>
          <span className="mx-2 text-slate-400 font-light">=</span>
          <span className="text-xl font-bold tracking-tight text-teal-700 dark:text-teal-400 font-mono tabular-nums">
            Rp {formattedRate}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Mid-market rate</span>
      </div>
    </div>
  );
}
