'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { ArrowRightLeft, Clock, TrendingUp } from 'lucide-react';
import { useFxRateQuery } from '@/shared/application/queries/use-fx-rate';

export interface FxRateWidgetProps {
  rateIdr?: number;
  guaranteedMinutes?: number;
  className?: string;
  compact?: boolean;
}

export function FxRateWidget({
  rateIdr,
  guaranteedMinutes = 15,
  className,
  compact = false,
}: FxRateWidgetProps) {
  const { data: fxData } = useFxRateQuery();
  const effectiveRate = fxData?.rate ?? rateIdr ?? 16250;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setNow(Date.now());
    });
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(interval);
    };
  }, []);

  const targetExpiresAt = fxData?.expiresAt ?? (now ? now + guaranteedMinutes * 60 * 1000 : null);
  const secondsRemaining =
    now && targetExpiresAt
      ? Math.max(0, Math.floor((targetExpiresAt - now) / 1000))
      : guaranteedMinutes * 60;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const formattedRate = effectiveRate.toLocaleString('id-ID');

  if (compact) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#050507] px-3 py-1 text-xs font-medium text-zinc-300 shadow-xl',
          className
        )}
      >
        <TrendingUp className="h-3.5 w-3.5 text-[#22D3EE]" aria-hidden="true" />
        <span className="font-mono tabular-nums text-white">1 USD = Rp {formattedRate}</span>
        <span className="h-1 w-1 rounded-full bg-zinc-700" />
        <span className="text-[11px] text-[#22D3EE] flex items-center gap-1 font-mono tabular-nums">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {timeFormatted}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/8 bg-[#050507] p-4 sm:p-5 shadow-xl',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-950/60 text-[#22D3EE] border border-sky-800/40 shrink-0">
            <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Garansi Kurs Valas Real-Time
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Nilai konversi IDR/USD dikunci selama 15 menit tanpa markup kurs tersembunyi saat deposit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 sm:self-center">
          <div className="text-left sm:text-right">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-base sm:text-lg font-bold text-white tabular-nums">
                $1.00 USD
              </span>
              <span className="text-zinc-500 font-light">=</span>
              <span className="font-mono text-base sm:text-lg font-bold text-[#22D3EE] tabular-nums">
                Rp {formattedRate}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 block">Bebas spread perbankan siluman</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums text-[#67E8F9] bg-sky-950/80 px-3 py-1.5 rounded-full border border-sky-800/60 shrink-0">
            <Clock className="h-3.5 w-3.5 text-[#22D3EE]" aria-hidden="true" />
            <span>Terkunci {timeFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
