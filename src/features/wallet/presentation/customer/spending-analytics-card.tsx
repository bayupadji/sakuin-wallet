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
      name: 'Cloud & Infrastructure',
      amount: '$84.50',
      percentage: 80,
      icon: Cloud,
      barColor: 'bg-teal-600 dark:bg-teal-500',
      dotColor: 'bg-teal-500',
    },
    {
      id: 'software',
      name: 'Developer Subscriptions',
      amount: '$21.00',
      percentage: 20,
      icon: Laptop,
      barColor: 'bg-slate-400 dark:bg-slate-500',
      dotColor: 'bg-slate-400',
    },
  ];

  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-[#111726] shadow-2xs space-y-5',
        className
      )}
    >
      {/* Header with Title and Range Switcher */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
            <PieChart className="h-4 w-4" aria-hidden="true" />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Spending Analytics
          </h2>
        </div>

        {/* Range Pill Toggle */}
        <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-[11px]">
          <button
            onClick={() => setSelectedRange('this_month')}
            className={cn(
              'rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
              selectedRange === 'this_month'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            )}
          >
            October 2026
          </button>
          <button
            onClick={() => setSelectedRange('last_month')}
            className={cn(
              'rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
              selectedRange === 'last_month'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            )}
          >
            September
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Outflow</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white font-mono tabular-nums">
              $105.50
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
              <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span>14% vs Sep</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400">Monthly Card Cap</span>
          <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 mt-1 tabular-nums">
            $105.50 / $2,000.00
          </p>
        </div>
      </div>

      {/* Combined Segmented Distribution Bar */}
      <div className="space-y-1.5">
        <div
          className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-850 overflow-hidden flex"
          role="progressbar"
          aria-valuenow={105.5}
          aria-valuemin={0}
          aria-valuemax={2000}
          aria-label="Monthly spending breakdown"
        >
          <div style={{ width: '80%' }} className="h-full bg-teal-600 dark:bg-teal-500 transition-all duration-500" />
          <div style={{ width: '20%' }} className="h-full bg-slate-400 dark:bg-slate-500 transition-all duration-500" />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>5.3% of monthly card limit used</span>
          <span>$1,894.50 remaining</span>
        </div>
      </div>

      {/* Category Breakdown List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 pt-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-850 dark:text-slate-300">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">{cat.name}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{cat.percentage}% of total</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums block">
                  {cat.amount}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">USD</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
