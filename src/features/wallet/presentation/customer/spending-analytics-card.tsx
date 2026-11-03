'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { ArrowDownRight, Cloud, Laptop, PieChart } from 'lucide-react';

interface SpendingCategory {
  id: string;
  name: string;
  amount: string;
  percentage: number;
  icon: React.ElementType;
  barColor: string;
  dotColor: string;
}

export function SpendingAnalyticsCard({ className }: { className?: string }) {
  const [selectedRange, setSelectedRange] = useState<'this_month' | 'last_month'>('this_month');

  const categories: SpendingCategory[] = [
    {
      id: 'cloud',
      name: 'Infrastruktur Cloud & Server',
      amount: '$84.50',
      percentage: 80,
      icon: Cloud,
      barColor: 'bg-[#1D9BF0]',
      dotColor: 'bg-[#22D3EE]',
    },
    {
      id: 'software',
      name: 'Langganan Developer Tools',
      amount: '$21.00',
      percentage: 20,
      icon: Laptop,
      barColor: 'bg-zinc-600',
      dotColor: 'bg-zinc-500',
    },
  ];

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl space-y-5 text-zinc-100',
        className
      )}
    >
      {/* Header with Title and Range Switcher */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-950/60 text-[#22D3EE] border border-sky-800/40">
            <PieChart className="h-4 w-4" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-white">
            Analisis Pengeluaran
          </h2>
        </div>

        {/* Range Pill Toggle */}
        <div className="flex items-center rounded-lg bg-[#12141a] p-0.5 border border-white/8 text-[11px]">
          <button
            type="button"
            onClick={() => setSelectedRange('this_month')}
            className={cn(
              'rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
              selectedRange === 'this_month'
                ? 'bg-white/10 text-white shadow-2xs font-semibold'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            Oktober 2026
          </button>
          <button
            type="button"
            onClick={() => setSelectedRange('last_month')}
            className={cn(
              'rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
              selectedRange === 'last_month'
                ? 'bg-white/10 text-white shadow-2xs font-semibold'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            September
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-xs text-zinc-400">Total Pengeluaran</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold tracking-tight text-white font-mono tabular-nums">
              $105.50
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#22D3EE]">
              <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span>-14% vs Sep</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-zinc-400">Batas Kartu Bulanan</span>
          <p className="text-xs font-mono font-semibold text-zinc-200 mt-1 tabular-nums">
            $105.50 / $2,000.00
          </p>
        </div>
      </div>

      {/* Combined Segmented Distribution Bar */}
      <div className="space-y-1.5">
        <div
          className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden flex"
          role="progressbar"
          aria-valuenow={105.5}
          aria-valuemin={0}
          aria-valuemax={2000}
          aria-label="Rincian pengeluaran bulanan"
        >
          <div style={{ width: '80%' }} className="h-full bg-[#1D9BF0] transition-all duration-500" />
          <div style={{ width: '20%' }} className="h-full bg-zinc-600 transition-all duration-500" />
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span>5,3% batas kartu terpakai</span>
          <span className="text-[#22D3EE] font-mono">Sisa $1.894,50</span>
        </div>
      </div>

      {/* Category Breakdown List */}
      <div className="divide-y divide-white/6 pt-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#12141a] text-[#22D3EE] border border-white/8">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div>
                  <span className="font-semibold text-white block">{cat.name}</span>
                  <span className="text-[11px] text-zinc-400">{cat.percentage}% dari total belanja</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-white tabular-nums block">
                  {cat.amount}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">USD</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
