'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useKycStatus, canTransact } from '@/features/kyc';
import { VirtualDebitCard } from './virtual-debit-card';
import { useCardStore } from '../../application/stores/use-card-store';
import { useCardQuery } from '../../application/queries/use-card';
import { useTransactionsQuery } from '@/features/transactions';
import { Button } from '@/shared/presentation/ui/button';
import {
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Sliders,
} from 'lucide-react';

export function CardHub() {
  const { data: kycSubmission } = useKycStatus();
  const kycStatus = kycSubmission?.status || 'not_verified';
  const isApproved = canTransact(kycStatus);

  const { data: cardDetails } = useCardQuery();
  const { data: cardTransactions = [] } = useTransactionsQuery({ type: 'card' });

  const { monthlyLimit, setMonthlyLimit } = useCardStore();
  const currentSpent = 105.5;
  const percentageUsed = Math.min(100, Math.round((currentSpent / monthlyLimit) * 100));

  return (
    <div className="space-y-6 font-sans antialiased text-slate-100">
      {/* 1. Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-950 text-teal-400 border border-teal-800/50">
              <CreditCard className="h-4 w-4" aria-hidden="true" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Kartu Debit Virtual
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Diterbitkan via mitra perbankan berlisensi MAS. Gunakan saldo USD untuk transaksi global online dan e-Commerce.
          </p>
        </div>
      </div>

      {/* 2. KYC Notice Banner (if unapproved) */}
      {!isApproved && (
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-amber-200">
                Kartu Virtual Memerlukan Verifikasi Identitas
              </h2>
              <p className="text-xs text-amber-300/80 mt-1">
                Lengkapi verifikasi KTP Anda untuk mengaktifkan kartu dan membuka detail nomor serta kode CVV.
              </p>
            </div>

            {kycStatus !== 'in_review' && (
              <Link href="/kyc/submit" className="shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-500 border-amber-600 text-slate-950 font-bold gap-2"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  <span>Verifikasi KTP Sekarang</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 3. Bybit-Style Virtual Debit Card (Full Width) */}
      <VirtualDebitCard
        cardholderName={cardDetails?.cardholderName || 'Bayu Prasetya Adji Sugiyarto'}
        last4={cardDetails?.last4 || '4821'}
        expiry={cardDetails?.expiry || '08/29'}
        issuingCountry={cardDetails?.issuingCountry || 'Singapura (MAS)'}
        isFrozen={!isApproved || (cardDetails?.isFrozen ?? false)}
      />

      {/* 4. Full-Width Apple Pay & Apple Wallet Integration Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#111726] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-black border border-slate-800 p-2 flex items-center justify-center shrink-0 shadow-inner">
            <Image
              src="/icons/apple-wallet.png"
              alt="Apple Wallet"
              width={48}
              height={36}
              className="h-auto w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">Mendukung Apple Pay</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                Siap Ditambahkan
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tambahkan kartu debit virtual ke Apple Wallet untuk pembayaran contactless global via iPhone, Apple Watch, dan Mac.
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-xl bg-black border border-slate-700/80 hover:border-slate-600 px-4 py-2.5 text-white shadow-lg hover:bg-slate-900 transition-colors cursor-pointer select-none"
            aria-label="Add to Apple Wallet"
          >
            <Image
              src="/icons/apple-wallet.png"
              alt="Apple Wallet"
              width={28}
              height={21}
              className="h-5 w-auto object-contain"
            />
            <div className="text-left">
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 leading-none">
                Add to
              </span>
              <span className="block text-xs font-semibold leading-tight">
                Apple Wallet
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Bottom Grid: Spending Limits + Card Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Spending Limit Controller */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-950 text-teal-400 border border-teal-800/40">
                  <Sliders className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Batas Belanja Bulanan
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Batasi total pengeluaran online dalam satu siklus billing
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-teal-300 tabular-nums">
                ${monthlyLimit.toFixed(2)} USD
              </span>
            </div>

            {/* Limit Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Terpakai: ${currentSpent.toFixed(2)}</span>
                <span className="font-mono font-semibold text-slate-200">
                  Sisa ${(monthlyLimit - currentSpent).toFixed(2)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${percentageUsed}%` }}
                />
              </div>
            </div>

            {/* Slider control */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Atur Batas Maksimal:</span>
                <span className="font-mono font-bold text-white">${monthlyLimit} USD</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>$50</span>
                <span>$2,500</span>
                <span>$5,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Card-Specific Transactions Section */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-[#111726] p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">
                Mutasi Kartu
              </h2>
              <p className="text-xs text-slate-400">
                Transaksi yang dipotong langsung dari saldo buku besar USD Anda.
              </p>
            </div>

            <Link
              href="/transactions"
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
            >
              Semua &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 border-t border-slate-800 pt-1">
            {cardTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada transaksi kartu virtual tercatat.
              </div>
            ) : (
              cardTransactions.slice(0, 3).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 hover:bg-[#0c121e]/80 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-slate-900 text-teal-400 border border-slate-800">
                      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-white truncate">
                        {tx.merchant || tx.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tx.category} &bull; {tx.timestampWib}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-mono text-sm font-bold tabular-nums text-white">
                      -${(Number(tx.amountUsdCents) / 100).toFixed(2)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                      Rp {tx.amountIdr.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
