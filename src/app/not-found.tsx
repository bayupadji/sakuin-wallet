'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Compass,
  CreditCard,
  History,
  Home,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0F1115] text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Main Card */}
        <div className="rounded-3xl border border-white/8 bg-[#050507]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Status Badge */}
          <div className="flex items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-950/80 px-3 py-1 text-xs font-semibold text-[#22D3EE] border border-sky-800/50">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
              <span>404</span>
              <span className="text-sky-600">|</span>
              <span className="font-normal text-sky-300/80">Route Mismatch</span>
            </span>
            <span className="text-xs text-zinc-500 font-mono">ERR_NOT_FOUND</span>
          </div>

          {/* Heading and Description */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#12141a] text-[#22D3EE] border border-white/8">
                <Compass className="h-5 w-5" aria-hidden="true" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
                Halaman Tidak Ditemukan
              </h1>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed text-pretty pt-1">
              Alamat URL yang Anda tuju mungkin salah ketik, telah dipindahkan, atau fitur sedang dalam penyesuaian rute.
            </p>
          </div>

          {/* Contextual Quick Links */}
          <div className="space-y-3 mb-8">
            <p className="text-xs font-medium text-zinc-400">
              Destinasi Utama Dompet:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Link
                href="/wallet"
                className="group flex flex-col p-3 rounded-xl border border-white/8 bg-[#12141a] hover:border-[#1D9BF0]/60 hover:bg-sky-950/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-zinc-300 group-hover:text-[#22D3EE] mb-1">
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px] text-zinc-500 font-mono">USD</span>
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-[#67E8F9]">
                  Ringkasan
                </span>
                <span className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                  Saldo &amp; Kurs Real-time
                </span>
              </Link>

              <Link
                href="/card"
                className="group flex flex-col p-3 rounded-xl border border-white/8 bg-[#12141a] hover:border-[#1D9BF0]/60 hover:bg-sky-950/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-zinc-300 group-hover:text-[#22D3EE] mb-1">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px] text-zinc-500 font-mono">VISA</span>
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-[#67E8F9]">
                  Kartu Virtual
                </span>
                <span className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                  Apple Pay &amp; Limit
                </span>
              </Link>

              <Link
                href="/transactions"
                className="group flex flex-col p-3 rounded-xl border border-white/8 bg-[#12141a] hover:border-[#1D9BF0]/60 hover:bg-sky-950/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-zinc-300 group-hover:text-[#22D3EE] mb-1">
                  <History className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px] text-zinc-500 font-mono">LEDGER</span>
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-[#67E8F9]">
                  Mutasi Transaksi
                </span>
                <span className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                  Riwayat &amp; Bukti VA
                </span>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-white/8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              className="flex-1 gap-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Kembali</span>
            </Button>

            <Link href="/" className="flex-1">
              <Button type="button" variant="primary" className="w-full gap-2">
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>Ke Beranda Utama</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Security Reassurance Footnote */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="h-4 w-4 text-[#22D3EE] shrink-0" aria-hidden="true" />
          <span>Keamanan Terjamin: Sesi akun dan saldo Anda tetap aman terlindungi.</span>
        </div>
      </div>
    </main>
  );
}
