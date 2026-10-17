'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';

export function LandingConverter() {
  const [usdAmount, setUsdAmount] = useState('100');
  const fxRate = 16250;
  const parsedUsd = Math.max(1, parseFloat(usdAmount) || 0);
  const idrSubtotal = Math.round(parsedUsd * fxRate);
  const feeIdr = 4500; // Flat VA fee
  const totalPayableIdr = idrSubtotal + feeIdr;

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-7 shadow-xl shadow-slate-200/40 dark:border-slate-800/90 dark:bg-[#111726]/95 dark:shadow-none text-left backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white uppercase">
            Live FX Calculator
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span>15-min rate lock guaranteed</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* You deposit in Rupiah */}
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
            You Pay (IDR via BCA/Mandiri VA)
          </label>
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="font-mono text-lg sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              Rp {totalPayableIdr.toLocaleString('id-ID')}
            </span>
            <span className="rounded-md bg-white px-2 py-1 font-mono text-xs font-bold text-slate-700 shadow-2xs dark:bg-slate-800 dark:text-slate-300">
              IDR
            </span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="space-y-1.5 px-1 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Guaranteed Rate</span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
              1 USD = Rp {fxRate.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>VA Processing Fee</span>
            <span className="font-mono text-teal-700 dark:text-teal-400 font-semibold">
              Rp 4.500 flat (0% hidden margin)
            </span>
          </div>
        </div>

        {/* You receive in USD */}
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
            You Get in USD Wallet
          </label>
          <div className="relative">
            <input
              type="number"
              min="5"
              max="1000"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              className="w-full rounded-2xl border border-teal-600/40 bg-teal-50/30 pl-4 pr-16 py-3 font-mono text-lg sm:text-xl font-extrabold text-slate-950 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 dark:border-teal-500/40 dark:bg-teal-950/20 dark:text-white tabular-nums"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-teal-700 px-2 py-1 font-mono text-xs font-bold text-white shadow-2xs">
              USD
            </span>
          </div>
        </div>

        <Link href="/wallet" className="block pt-2">
          <Button variant="primary" size="lg" className="w-full gap-2 shadow-md font-semibold">
            <span>Open Wallet & Top Up</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
