'use client';

import React from 'react';
import { RefreshCw, ShieldCheck, Wrench } from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';

export default function MaintenancePage() {
  function handleRefresh() {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  return (
    <main className="min-h-screen bg-[#090D14] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-lg mx-auto space-y-6">
        {/* Main Card */}
        <div className="rounded-3xl border border-amber-900/30 bg-[#111726]/90 p-8 sm:p-10 shadow-2xl backdrop-blur-md text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-950/80 px-3.5 py-1 text-xs font-semibold text-amber-300 border border-amber-800/50 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>503</span>
            <span className="text-amber-600">|</span>
            <span className="font-normal text-amber-200/80">Pemeliharaan Terjadwal</span>
          </div>

          {/* Central Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-950/50 text-amber-400 border border-amber-800/40 mx-auto mb-5">
            <Wrench className="h-7 w-7" aria-hidden="true" />
          </div>

          {/* Heading & Subheading */}
          <div className="space-y-3 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              Sistem Sedang Dalam Pemeliharaan
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed text-pretty max-w-md mx-auto">
              Kami sedang melakukan peningkatan performa dan pembaruan infrastruktur rutin. Sakuin Wallet akan segera beroperasi kembali secara normal.
            </p>
          </div>

          {/* Reassurance Banner */}
          <div className="rounded-2xl border border-slate-800 bg-[#0C121E] p-3.5 mb-8 flex items-center justify-center gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" aria-hidden="true" />
            <span>Seluruh data rekening dan saldo USD Anda tetap aman terlindungi.</span>
          </div>

          {/* Action Button */}
          <Button
            type="button"
            variant="primary"
            onClick={handleRefresh}
            className="w-full gap-2 text-sm font-semibold"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>Muat Ulang Halaman</span>
          </Button>
        </div>

        {/* Footer Support */}
        <p className="text-center text-xs text-slate-500">
          Membutuhkan bantuan mendesak? Hubungi kami melalui{' '}
          <a href="mailto:support@sakuin.id" className="text-teal-400 hover:underline">
            support@sakuin.id
          </a>
        </p>
      </div>
    </main>
  );
}
