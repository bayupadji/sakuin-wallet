import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  CreditCard,
  History,
  Home,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';
import { NotFoundBackButton } from './not-found-back-button';

export const metadata: Metadata = {
  title: '404 Halaman Tidak Ditemukan',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
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
              <span className="font-normal text-sky-300/80">Halaman Tidak Ditemukan</span>
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
              Alamat URL yang Anda tuju mungkin salah ketik, telah dipindahkan, atau sudah tidak tersedia. Pilih salah satu halaman utama di bawah untuk melanjutkan.
            </p>
          </div>

          {/* Contextual Quick Links */}
          <div className="space-y-3 mb-8">
            <p className="text-xs font-medium text-zinc-400">
              Navigasi Halaman Publik:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Link
                href="/#produk-kartu"
                className="group flex flex-col p-3 rounded-xl border border-white/8 bg-[#12141a] hover:border-[#1D9BF0]/60 hover:bg-sky-950/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-zinc-300 group-hover:text-[#22D3EE] mb-1">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px] text-zinc-500 font-mono">VDC</span>
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-[#67E8F9]">
                  Kartu Debit Virtual
                </span>
                <span className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                  Belanja Global &amp; 3D Secure
                </span>
              </Link>

              <Link
                href="/#cara-kerja"
                className="group flex flex-col p-3 rounded-xl border border-white/8 bg-[#12141a] hover:border-[#1D9BF0]/60 hover:bg-sky-950/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-zinc-300 group-hover:text-[#22D3EE] mb-1">
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px] text-zinc-500 font-mono">QRIS</span>
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-[#67E8F9]">
                  Cara Kerja
                </span>
                <span className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                  Top Up QRIS &amp; VA Bank
                </span>
              </Link>

              <Link
                href="/#faq"
                className="group flex flex-col p-3 rounded-xl border border-white/8 bg-[#12141a] hover:border-[#1D9BF0]/60 hover:bg-sky-950/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-zinc-300 group-hover:text-[#22D3EE] mb-1">
                  <History className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px] text-zinc-500 font-mono">FAQ</span>
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-[#67E8F9]">
                  Bantuan &amp; FAQ
                </span>
                <span className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                  Panduan Layanan Resmi
                </span>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-white/8">
            <NotFoundBackButton />

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
