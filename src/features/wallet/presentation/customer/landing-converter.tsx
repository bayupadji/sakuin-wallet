'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpDown, Clock, Zap } from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';
import {
  useFxRateQuery,
  convertUsdToIdr,
  convertIdrToUsd,
} from '@/shared/application/queries/use-fx-rate';

type ConversionDirection = 'usd_to_idr' | 'idr_to_usd';

export function LandingConverter() {
  const [direction, setDirection] = useState<ConversionDirection>('usd_to_idr');
  const [inputVal, setInputVal] = useState('100');

  const { data: fxData } = useFxRateQuery();
  const fxRate = fxData?.rate ?? 16250;
  const inverseRate = fxData?.inverseRate ?? (1 / fxRate);

  const parsedNum = Math.max(0, parseFloat(inputVal) || 0);
  const feeIdr = 4500; // Flat VA fee

  // Bidirectional calculations
  let calculatedUsd = 0;
  let calculatedIdr = 0;
  let totalPayableIdr = 0;

  if (direction === 'usd_to_idr') {
    calculatedUsd = parsedNum;
    calculatedIdr = convertUsdToIdr(parsedNum, fxRate);
    totalPayableIdr = calculatedIdr > 0 ? calculatedIdr + feeIdr : 0;
  } else {
    calculatedIdr = parsedNum;
    const netIdrAfterFee = Math.max(0, parsedNum - feeIdr);
    calculatedUsd = convertIdrToUsd(netIdrAfterFee, fxRate);
    totalPayableIdr = parsedNum;
  }

  function handleSwapDirection() {
    if (direction === 'usd_to_idr') {
      setDirection('idr_to_usd');
      setInputVal(totalPayableIdr > 0 ? totalPayableIdr.toString() : '1500000');
    } else {
      setDirection('usd_to_idr');
      setInputVal(calculatedUsd > 0 ? Math.round(calculatedUsd).toString() : '100');
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-7 shadow-xl shadow-slate-200/40 dark:border-slate-800/90 dark:bg-[#111726]/95 dark:shadow-none text-left backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white uppercase">
            Kalkulator Kurs Real-Time
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span>Kunci Kurs 15 Menit</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Top Field: Input Currency */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {direction === 'usd_to_idr' ? 'Nominal Dollar (USD)' : 'Nominal Rupiah (IDR)'}
            </label>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
              {direction === 'usd_to_idr' ? 'USD ke IDR' : 'IDR ke USD'}
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              min="1"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full rounded-2xl border border-teal-600/40 bg-teal-50/30 pl-4 pr-16 py-3 font-mono text-lg sm:text-xl font-extrabold text-slate-950 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 dark:border-teal-500/40 dark:bg-teal-950/20 dark:text-white tabular-nums"
              placeholder={direction === 'usd_to_idr' ? '100' : '1500000'}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-teal-700 px-2 py-1 font-mono text-xs font-bold text-white shadow-2xs">
              {direction === 'usd_to_idr' ? 'USD' : 'IDR'}
            </span>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            type="button"
            onClick={handleSwapDirection}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300 cursor-pointer transition-colors"
            title="Tukar arah konversi (USD ⇄ IDR)"
          >
            <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
            <span>Tukar Arah</span>
          </button>
        </div>

        {/* Bottom Field: Converted Target Currency */}
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
            {direction === 'usd_to_idr' ? 'Total Bayar (IDR via VA / QRIS)' : 'Diterima di Dompet USD'}
          </label>
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
            <span className="font-mono text-lg sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              {direction === 'usd_to_idr'
                ? `Rp ${totalPayableIdr.toLocaleString('id-ID')}`
                : `$${calculatedUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
            <span className="rounded-md bg-white px-2 py-1 font-mono text-xs font-bold text-slate-700 shadow-2xs dark:bg-slate-800 dark:text-slate-300">
              {direction === 'usd_to_idr' ? 'IDR' : 'USD'}
            </span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="space-y-1.5 px-1 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Kurs Acuan Pasar</span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
              {direction === 'usd_to_idr'
                ? `1 USD = Rp ${fxRate.toLocaleString('id-ID')}`
                : `1 IDR = $${inverseRate.toFixed(6)} USD`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Biaya Pemrosesan Transaksi</span>
            <span className="font-mono text-teal-700 dark:text-teal-400 font-semibold">
              Rp 4.500 flat (0% margin tersembunyi)
            </span>
          </div>
        </div>

        <Link href="/wallet" className="block pt-2">
          <Button variant="primary" size="lg" className="w-full gap-2 shadow-md font-semibold">
            <span>Buka Dompet & Top Up</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
