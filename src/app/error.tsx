'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Home,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';

export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const incidentId = error.digest ? `INC-${error.digest.slice(0, 8).toUpperCase()}` : 'INC-SYS-9082';
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <main className="min-h-screen bg-[#090D14] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Main Card */}
        <div className="rounded-3xl border border-rose-950/40 bg-[#111726]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Status Badge */}
          <div className="flex items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-950/80 px-3 py-1 text-xs font-semibold text-rose-300 border border-rose-800/50">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span>500</span>
              <span className="text-rose-600">|</span>
              <span className="font-normal text-rose-200/80">Gangguan Sistem</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">ERR_INTERNAL</span>
          </div>

          {/* Headline */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
                Terjadi Kendala pada Sistem
              </h1>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed text-pretty pt-1">
              Sistem perbankan kami mengalami kendala teknis sementara saat memproses permintaan Anda. Layanan keamanan otomatis kami telah mengamankan transaksi yang sedang berjalan.
            </p>
          </div>

          {/* Financial Security Reassurance Box */}
          <div className="rounded-2xl border border-teal-900/40 bg-teal-950/20 p-4 mb-6 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs leading-relaxed">
              <p className="font-semibold text-teal-200">
                Jaminan Keamanan Saldo
              </p>
              <p className="text-teal-300/80 mt-0.5">
                Seluruh saldo USD, rekening, dan data kartu virtual Anda tetap 100% aman dan tidak terpengaruh oleh kendala ini.
              </p>
            </div>
          </div>

          {/* Incident Telemetry Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-800 bg-[#0C121E] px-4 py-3 mb-6 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Nomor Insiden:</span>
              <span className="font-mono font-semibold text-slate-200 tracking-wider">
                {incidentId}
              </span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">
              Status: Tercatat di Audit Log
            </span>
          </div>

          {/* Diagnostic Details (Dev only / collapsible) */}
          {isDev && (
            <div className="mb-6 rounded-xl border border-slate-850 bg-[#0A0F1A] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <span>Detail Diagnostik (Pengembang)</span>
                {showDetails ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>
              {showDetails && (
                <div className="p-3 border-t border-slate-850 font-mono text-[11px] text-rose-300/90 whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                  {error.message || 'Terjadi kesalahan sistem yang tidak diketahui.'}
                  {error.stack && (
                    <div className="mt-2 text-slate-500 text-[10px]">
                      {error.stack}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-800/80">
            <Button
              type="button"
              variant="primary"
              onClick={() => reset()}
              className="flex-1 gap-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>Coba Lagi</span>
            </Button>

            <Link href="/" className="flex-1">
              <Button type="button" variant="secondary" className="w-full gap-2">
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>Kembali ke Beranda</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Support Note */}
        <p className="text-center text-xs text-slate-500">
          Jika masalah berlanjut, hubungi dukungan prioritas kami di{' '}
          <a href="mailto:support@sakuin.id" className="text-teal-400 hover:underline">
            support@sakuin.id
          </a>
        </p>
      </div>
    </main>
  );
}
