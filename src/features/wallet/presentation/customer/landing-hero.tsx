'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePublicStore } from '@/features/public';
import { useFxRateQuery } from '@/shared/application/queries/use-fx-rate';
import {
  ArrowRight,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Wifi,
  Zap,
} from 'lucide-react';

export function LandingHero() {
  const { usdInput, setUsdInput } = usePublicStore();
  const [rateCountdown, setRateCountdown] = useState(892); // ~14m 52s

  const { data: fxData } = useFxRateQuery();
  const fxRate = fxData?.rate ?? 16250;
  const parsedUsd = Math.max(1, parseFloat(usdInput) || 0);
  const totalIdr = Math.round(parsedUsd * fxRate);

  // 15-minute guaranteed rate countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setRateCountdown((prev) => (prev <= 1 ? 900 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Ambient background glow accents */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-teal-500/10 via-cyan-500/10 to-indigo-600/10 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & Main CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3.5 py-1 text-xs font-semibold text-teal-300">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
              <span>Dompet Digital Dollar &bull; KTP Terverifikasi</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              Satu Dompet, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-400">
                Tanpa Batas.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl text-pretty leading-relaxed">
              Buat kartu virtual instan, hubungkan ke Apple Pay, dan transaksi ke seluruh dunia tanpa biaya tersembunyi.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/signup">
                <button
                  type="button"
                  className="min-h-[44px] px-6 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-teal-500/25 flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <span>Buka Akun Gratis</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </Link>
              <a href="#fitur">
                <button
                  type="button"
                  className="min-h-[44px] px-6 py-2.5 rounded-full border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  <span>Lihat Cara Kerja</span>
                </button>
              </a>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-400">
              <div>
                <span className="font-mono font-bold text-white block text-sm tabular-nums">
                  15 Menit
                </span>
                <span>Garansi Kunci Kurs</span>
              </div>
              <div>
                <span className="font-mono font-bold text-white block text-sm">
                  1-Dokumen KTP
                </span>
                <span>Tanpa Ribet Selfie</span>
              </div>
              <div>
                <span className="font-mono font-bold text-white block text-sm">
                  Append-Only
                </span>
                <span>Buku Besar Imutabel</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Device Mockup & Holographic Card Showcase */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[420px] sm:max-w-[460px]">
              {/* Back: Angled Smartphone Device Mockup */}
              <div className="relative mx-auto w-[240px] sm:w-[260px] rounded-[44px] border-[5px] border-slate-700/70 bg-slate-950 p-2.5 shadow-2xl shadow-cyan-950/30 transform -rotate-6 transition-transform duration-500 hover:-rotate-3">
                {/* Dynamic Island / Speaker */}
                <div className="h-4 w-20 bg-black rounded-full mx-auto mb-2 flex items-center justify-end px-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                </div>

                {/* Smartphone Screen UI */}
                <div className="rounded-[32px] bg-[#0c121e] border border-slate-800 p-3.5 space-y-3 select-none">
                  {/* Mini App Header */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span className="h-4 w-4 rounded-md bg-teal-500 text-slate-950 flex items-center justify-center font-mono text-[10px]">
                        S
                      </span>
                      <span>Sakuin</span>
                    </div>
                    <span className="text-[10px] font-mono">9:41</span>
                  </div>

                  {/* Mini Mobile Card Stack in Phone */}
                  <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 p-2.5 space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-teal-400 font-semibold">Virtual USD</span>
                      <span className="font-mono text-slate-400">•••• 5678</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-white tabular-nums">
                      $1,250.00
                    </div>
                  </div>

                  {/* Mini Actions Grid */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      Top Up
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      Kirim
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      Kartu
                    </div>
                  </div>

                  {/* Mini Activity Feed */}
                  <div className="space-y-1.5 pt-1 text-[10px]">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold block">
                      Aktivitas Terakhir
                    </span>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/60 text-slate-300">
                      <span className="truncate max-w-[100px]">AWS Cloud</span>
                      <span className="font-mono text-slate-200">-$24.50</span>
                    </div>
                    <div className="flex justify-between items-center py-1 text-slate-300">
                      <span className="truncate max-w-[100px]">Top Up BCA VA</span>
                      <span className="font-mono text-teal-400">+$150.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Front: Floating Holographic Virtual Debit Card */}
              <div className="absolute top-8 sm:top-10 -right-2 sm:-right-4 w-[280px] sm:w-[320px] rounded-2xl p-4 sm:p-5 text-white shadow-2xl transition-all duration-300 select-none border backdrop-blur-md bg-gradient-to-br from-cyan-600/90 via-teal-700/95 to-indigo-900/95 border-cyan-400/40 shadow-cyan-500/20">
                {/* Holographic metallic light sheen */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 via-transparent to-cyan-300/10 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Card Top: Chip, Contactless, Status Badge */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    {/* Realistic Gold EMV Chip */}
                    <div
                      className="h-6 w-8 rounded-sm bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 p-0.5 border border-amber-400/60 shadow-inner flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <div className="w-full h-full border border-amber-900/30 grid grid-cols-2 gap-0.5 opacity-70">
                        <div className="border-b border-amber-900/30" />
                        <div className="border-b border-amber-900/30" />
                        <div />
                        <div />
                      </div>
                    </div>
                    <Wifi className="h-4 w-4 text-white/70 rotate-90" aria-hidden="true" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase border bg-teal-400/20 text-teal-200 border-teal-400/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-pulse" />
                      <span>Aktif</span>
                    </span>
                  </div>
                </div>

                {/* Card Number */}
                <div className="mt-5 relative z-10">
                  <span className="text-[10px] uppercase tracking-wider text-cyan-200/80 block">
                    Virtual Card
                  </span>
                  <div className="font-mono text-base sm:text-lg font-bold tracking-widest text-white flex items-center justify-between tabular-nums mt-0.5">
                    <span>1234</span>
                    <span>5678</span>
                    <span>9678</span>
                    <span>9031</span>
                  </div>
                </div>

                {/* Cardholder & Expiry & VISA */}
                <div className="mt-4 flex items-end justify-between text-[11px] relative z-10">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-cyan-200/70">
                      Cardholder
                    </span>
                    <span className="font-semibold tracking-wider uppercase text-white block">
                      BUDI SANTOSO
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-cyan-200/70">
                      Valid Thru
                    </span>
                    <span className="font-mono font-medium text-slate-100 block tabular-nums">
                      08/29
                    </span>
                  </div>
                  <div className="font-mono font-black italic text-sm tracking-tighter text-white">
                    VISA
                  </div>
                </div>
              </div>

              {/* Official "Add to Apple Wallet" Marketing Badge */}
              <div className="absolute -bottom-4 right-2 sm:right-6 z-20">
                <div
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-black border border-slate-700/80 text-white shadow-xl flex items-center gap-2.5 select-none"
                  aria-label="Mendukung Apple Wallet"
                >
                  {/* Apple Wallet Multi-card Icon */}
                  <div className="flex -space-x-1 items-center" aria-hidden="true">
                    <span className="h-3 w-4 rounded-xs bg-cyan-400 border border-black" />
                    <span className="h-3.5 w-4 rounded-xs bg-amber-400 border border-black" />
                    <span className="h-4 w-4 rounded-xs bg-rose-500 border border-black" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 leading-none">
                      Add to
                    </span>
                    <span className="block text-xs font-semibold leading-tight">
                      Apple Wallet
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Hero Section: Marketing Value & Live Converter Grid */}
        <div className="mt-14 sm:mt-18 pt-8 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Widget 1: Live Currency Converter */}
          <div className="md:col-span-5 rounded-2xl border border-slate-800/90 bg-[#111726]/90 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-950 text-teal-400">
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Currency Converter
                  </span>
                </div>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-800/60 tabular-nums">
                  Kunci Kurs {formatCountdown(rateCountdown)}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-left">
                <div>
                  <label htmlFor="usd-input" className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Nominal USD
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-400">
                      🇺🇸 USD
                    </span>
                    <input
                      id="usd-input"
                      type="number"
                      min="5"
                      max="5000"
                      value={usdInput}
                      onChange={(e) => setUsdInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-20 pr-4 py-2.5 font-mono text-sm font-bold text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Estimasi Rupiah (Kurs 1:{fxRate.toLocaleString('id-ID')})
                  </span>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-3.5 py-2.5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">🇮🇩 IDR</span>
                    <span className="font-mono text-sm font-bold text-teal-300 tabular-nums">
                      Rp {totalIdr.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
              <Zap className="h-3 w-3 text-teal-400 shrink-0" aria-hidden="true" />
              <span>0% markup tersembunyi. Pengisian instan via Virtual Account & QRIS.</span>
            </p>
          </div>

          {/* Widget 2: Dashboard Volume & Growth Preview */}
          <div className="md:col-span-3 rounded-2xl border border-slate-800/90 bg-[#111726]/90 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-semibold text-white">Dashboard</span>
                <TrendingUp className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
              </div>
              <div className="mt-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                  Total Volume Pengguna
                </span>
                <span className="font-mono text-xl font-bold text-white tabular-nums block mt-0.5">
                  $33,300+
                </span>
              </div>
              {/* Mini Sparkline Chart */}
              <div className="mt-3 h-8 w-full flex items-end gap-1.5" aria-hidden="true">
                <span className="h-2 w-full rounded-xs bg-slate-800" />
                <span className="h-4 w-full rounded-xs bg-slate-700" />
                <span className="h-3 w-full rounded-xs bg-slate-700" />
                <span className="h-5 w-full rounded-xs bg-teal-500/60" />
                <span className="h-4 w-full rounded-xs bg-teal-500/80" />
                <span className="h-7 w-full rounded-xs bg-teal-400" />
              </div>
            </div>
            <span className="text-[10px] text-teal-400 font-mono mt-3 block">
              +14.2% pertumbuhan bulan ini
            </span>
          </div>

          {/* Widget 3: Key Value Propositions */}
          <div className="md:col-span-4 rounded-2xl border border-slate-800/90 bg-[#111726]/90 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between text-left space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <CreditCard className="h-4 w-4 text-teal-400" aria-hidden="true" />
                <span>Instan & Aman</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Penerbitan kartu virtual instan dengan standar perbankan terpercaya. Kontrol transaksi seketika langsung dari genggaman Anda.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Zap className="h-4 w-4 text-teal-400" aria-hidden="true" />
                <span>Kurs Transparan & Terbaik</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Konversi USD/IDR kompetitif harian dengan jaminan kunci kurs 15 menit tanpa biaya administrasi tersembunyi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
