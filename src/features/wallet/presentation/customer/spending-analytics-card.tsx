'use client';

import React, { useMemo } from 'react';
import { TransactionItem } from '@/features/transactions';
import { messages } from '@/shared/messages';
import { cn } from '@/shared/utils/cn';
import { PieChart, ShoppingBag } from 'lucide-react';

export interface SpendingAnalyticsCardProps {
  transactions?: TransactionItem[];
  monthlyLimitUsd?: number;
  className?: string;
}

export function SpendingAnalyticsCard({
  transactions = [],
  monthlyLimitUsd = 2000,
  className,
}: SpendingAnalyticsCardProps) {
  const settledCardTx = useMemo(
    () => transactions.filter((tx) => tx.type === 'card' && tx.status === 'success'),
    [transactions]
  );

  const totalSpentCents = useMemo(
    () => settledCardTx.reduce((sum, tx) => sum + Number(tx.amountUsdCents), 0),
    [settledCardTx]
  );

  const categories = useMemo(() => {
    if (totalSpentCents <= 0) return [];
    const grouped = new Map<string, number>();
    for (const tx of settledCardTx) {
      const key = tx.category || 'Pembayaran Online';
      grouped.set(key, (grouped.get(key) ?? 0) + Number(tx.amountUsdCents));
    }
    return Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, cents], index) => ({
        id: name,
        name,
        cents,
        amountFormatted: `$${(cents / 100).toFixed(2)}`,
        percentage: Math.round((cents / totalSpentCents) * 100),
        barColor: index === 0 ? 'bg-[#1D9BF0]' : index === 1 ? 'bg-[#22D3EE]' : 'bg-zinc-600',
      }));
  }, [settledCardTx, totalSpentCents]);

  const totalSpentUsd = totalSpentCents / 100;
  const limitUsd = Math.max(1, monthlyLimitUsd);
  const usedPercent = Math.min(100, Number(((totalSpentUsd / limitUsd) * 100).toFixed(1)));
  const remainingUsd = Math.max(0, limitUsd - totalSpentUsd);

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl space-y-5 text-zinc-100',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-950/60 text-[#22D3EE] border border-sky-800/40">
            <PieChart className="h-4 w-4" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-white">
            {messages.wallet.spendingAnalyticsTitle}
          </h2>
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-xs text-zinc-400">Total Pengeluaran Settled</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold tracking-tight text-white font-mono tabular-nums">
              ${totalSpentUsd.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-zinc-400">Batas Kartu Opsional</span>
          <p className="text-xs font-mono font-semibold text-zinc-200 mt-1 tabular-nums">
            ${totalSpentUsd.toFixed(2)} / ${limitUsd.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div
          className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden flex"
          role="progressbar"
          aria-valuenow={totalSpentUsd}
          aria-valuemin={0}
          aria-valuemax={limitUsd}
          aria-label="Rincian pengeluaran bulanan"
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{ width: `${cat.percentage}%` }}
              className={cn('h-full transition-all duration-500', cat.barColor)}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span>{usedPercent.toLocaleString('id-ID')}% batas kartu terpakai</span>
          <span className="text-[#22D3EE] font-mono tabular-nums">
            Sisa ${remainingUsd.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="divide-y divide-white/6 pt-1">
        {categories.length === 0 ? (
          <p className="py-5 text-center text-xs text-zinc-400">
            {messages.wallet.spendingEmpty}
          </p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#12141a] text-[#22D3EE] border border-white/8">
                  <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div>
                  <span className="font-semibold text-white block">{cat.name}</span>
                  <span className="text-[11px] text-zinc-400">
                    {cat.percentage}% dari total belanja kartu
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-white tabular-nums block">
                  {cat.amountFormatted}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">USD</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
