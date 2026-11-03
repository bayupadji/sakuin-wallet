'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { Bell, KeyRound, Lock, Shield, Smartphone, ToggleLeft, ToggleRight } from 'lucide-react';
import { KycStatusBadge, KycStatus } from '@/features/kyc';

interface SecuritySettingsCardProps {
  kycStatus: KycStatus;
  className?: string;
}

export function SecuritySettingsCard({
  kycStatus,
  className,
}: SecuritySettingsCardProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [largeTxNotice, setLargeTxNotice] = useState(true);

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl space-y-5 text-zinc-100',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-950/60 text-[#22D3EE] border border-sky-800/40">
            <Shield className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">
              Keamanan & Notifikasi
            </h2>
            <p className="text-[11px] text-zinc-400">
              Proteksi standar perbankan dan notifikasi transaksi seketika
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-950/80 px-2.5 py-1 text-[11px] font-semibold text-[#67E8F9] border border-sky-800/50">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
          Proteksi Maksimal
        </span>
      </div>

      {/* Security Items List */}
      <div className="divide-y divide-white/6 text-xs">
        {/* KYC Compliance Status */}
        <div className="flex items-center justify-between py-3 first:pt-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#12141a] text-[#22D3EE] border border-white/8">
              <Shield className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-white block">
                Verifikasi KTP Indonesia (KYC)
              </span>
              <span className="text-[11px] text-zinc-400">
                NIK 16 digit terenkripsi dalam brankas privat
              </span>
            </div>
          </div>
          <KycStatusBadge status={kycStatus} />
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#12141a] text-[#22D3EE] border border-white/8">
              <Smartphone className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-white block">
                Autentikasi Dua Faktor (2FA)
              </span>
              <span className="text-[11px] text-zinc-400">
                Kunci keamanan hardware atau TOTP autentikator
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] font-semibold text-[#22D3EE] bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
            Aktif
          </span>
        </div>

        {/* Transaction PIN */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#12141a] text-[#22D3EE] border border-white/8">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-white block">
                PIN Transaksi 6 Digit
              </span>
              <span className="text-[11px] text-zinc-400">
                Dibutuhkan untuk buka kartu & intip CVV
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] font-semibold text-[#22D3EE] bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
            Terkonfigurasi
          </span>
        </div>

        {/* Email Alerts Toggle */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#12141a] text-[#22D3EE] border border-white/8">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-white block">
                Bukti Transaksi Instan
              </span>
              <span className="text-[11px] text-zinc-400">
                Konfirmasi email seketika saat ada transaksi kartu
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEmailAlerts(!emailAlerts)}
            className="text-[#1D9BF0] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] rounded p-1"
            aria-label="Toggle bukti transaksi instan"
          >
            {emailAlerts ? (
              <ToggleRight className="h-6 w-6 text-[#1D9BF0]" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-zinc-600" />
            )}
          </button>
        </div>

        {/* Large Transaction SMS/Push Alert */}
        <div className="flex items-center justify-between py-3 last:pb-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#12141a] text-[#22D3EE] border border-white/8">
              <Lock className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-white block">
                Peringatan Transaksi Besar (&gt; $100)
              </span>
              <span className="text-[11px] text-zinc-400">
                Verifikasi sekunder untuk pembelian nominal tinggi
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLargeTxNotice(!largeTxNotice)}
            className="text-[#1D9BF0] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] rounded p-1"
            aria-label="Toggle peringatan transaksi besar"
          >
            {largeTxNotice ? (
              <ToggleRight className="h-6 w-6 text-[#1D9BF0]" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-zinc-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
