'use client';

import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const incidentId = error.digest ? `INC-${error.digest.slice(0, 8).toUpperCase()}` : 'INC-ROOT-FATAL';

  return (
    <html lang="id">
      <body className="bg-[#090D14] text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        <main className="w-full max-w-lg rounded-3xl border border-rose-900/40 bg-[#111726] p-8 shadow-2xl text-center space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-800/40 mx-auto">
            <AlertOctagon className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Gangguan Aplikasi Kritis
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Aplikasi mengalami kendala mendasar pada kerangka utama. Seluruh data rekening dan dana Anda tetap berada dalam pengawasan aman.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0C121E] p-3 text-xs font-mono text-slate-400">
            Referensi: <span className="text-slate-200 font-bold">{incidentId}</span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition-colors cursor-pointer w-full"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>Muat Ulang Aplikasi</span>
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
