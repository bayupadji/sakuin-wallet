'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKycStatus, canTransact, KycStatusBadge } from '@/features/kyc';
import { VirtualDebitCard } from './virtual-debit-card';
import { Button } from '@/shared/presentation/ui/button';
import {
  AlertCircle,
  CreditCard,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export function CardHub() {
  const { data: kycSubmission } = useKycStatus();
  const kycStatus = kycSubmission?.status || 'not_verified';
  const isApproved = canTransact(kycStatus);

  const [monthlyLimit, setMonthlyLimit] = useState(2000);
  const [onlinePurchases, setOnlinePurchases] = useState(true);
  const [internationalUse, setInternationalUse] = useState(true);
  const [autoFreeze, setAutoFreeze] = useState(false);

  const currentSpent = 105.5;
  const percentageUsed = Math.min(100, Math.round((currentSpent / monthlyLimit) * 100));

  const cardTransactions = [
    {
      id: 'tx-card-01',
      merchant: 'AWS Cloud Infrastructure',
      category: 'Cloud & Hosting',
      date: 'Yesterday, 09:15 WIB',
      amountUsd: '-$84.50',
      amountIdr: 'Rp 1.373.125',
      status: 'success',
      icon: ShoppingBag,
    },
    {
      id: 'tx-card-02',
      merchant: 'GitHub Enterprise Subscription',
      category: 'Software & Tools',
      date: '14 Oct 2026, 18:00 WIB',
      amountUsd: '-$21.00',
      amountIdr: 'Rp 341.250',
      status: 'success',
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="space-y-8 font-sans antialiased text-slate-900 dark:text-slate-100">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
              <CreditCard className="h-4 w-4" aria-hidden="true" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Virtual Debit Card
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Issued via Singapore banking partner. Spend your USD balance anywhere online.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-850 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            <span>Primary USD Card</span>
          </span>
        </div>
      </div>

      {/* 2. KYC Unapproved Warning Banner (if unverified) */}
      {!isApproved && (
        <div className="rounded-3xl border border-amber-200/90 bg-amber-50/80 p-6 dark:border-amber-900/60 dark:bg-amber-950/30 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200 shrink-0 mt-0.5">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                  {kycStatus === 'in_review'
                    ? 'Card Activation Pending ID Verification'
                    : 'Verify your ID to activate virtual debit card spending'}
                </h2>
                <p className="text-xs text-amber-900/80 dark:text-amber-300/80 max-w-xl">
                  {kycStatus === 'in_review'
                    ? 'Your Indonesian KTP photo is currently under compliance review. Card activation occurs automatically upon approval.'
                    : 'To comply with monetary regulations, upload a photo of your KTP to unlock virtual debit card creation and online spending.'}
                </p>
              </div>
            </div>

            {kycStatus !== 'in_review' && (
              <Link href="/kyc/submit" className="shrink-0">
                <Button variant="primary" size="sm" className="bg-amber-700 hover:bg-amber-800 border-amber-800 text-white gap-2">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  <span>Verify Identity (KTP)</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 3. Main Hub Grid: Card Simulation & Spending Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Virtual Debit Card & Specification */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 dark:border-slate-800/80 dark:bg-[#111726] shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Card Preview
              </span>
              <KycStatusBadge status={kycStatus} />
            </div>

            {/* Simulated Apple Wallet Card */}
            <div className="flex justify-center">
              <VirtualDebitCard
                cardholderName="BUDI SANTOSO"
                last4="4821"
                expiry="08/29"
                isFrozen={!isApproved}
                className="w-full"
              />
            </div>

            {/* Card Specifications & Limits */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Card Network</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">
                  VISA Platinum Virtual
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Billing Currency</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5 block">
                  United States Dollar (USD)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Zero Foreign Fee</span>
                <span className="font-semibold text-teal-700 dark:text-teal-400 mt-0.5 block">
                  Included (0% markup)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Issuer Location</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">
                  Singapore (MAS Regulated)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Spending Limits & Security Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Monthly Spending Limit Controller */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 dark:border-slate-800/80 dark:bg-[#111726] shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
                  <Sliders className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Monthly Card Limit
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cap maximum online spend per billing cycle
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                ${monthlyLimit.toFixed(2)} USD
              </span>
            </div>

            {/* Limit Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Spent: ${currentSpent.toFixed(2)}</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  ${(monthlyLimit - currentSpent).toFixed(2)} remaining
                </span>
              </div>
              <div
                className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
                role="progressbar"
                aria-valuenow={currentSpent}
                aria-valuemin={0}
                aria-valuemax={monthlyLimit}
                aria-label="Monthly spending limit"
              >
                <div
                  style={{ width: `${percentageUsed}%` }}
                  className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-300"
                />
              </div>
            </div>

            {/* Slider Control */}
            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min="500"
                max="5000"
                step="250"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(parseInt(e.target.value, 10))}
                className="w-full accent-teal-600 cursor-pointer"
                aria-label="Adjust monthly card limit"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>$500 min</span>
                <span>$2,500</span>
                <span>$5,000 max</span>
              </div>
            </div>
          </div>

          {/* Toggleable Security & Feature Rules */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 dark:border-slate-800/80 dark:bg-[#111726] shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal-600" aria-hidden="true" />
              <span>Card Security Settings</span>
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              <div className="flex items-center justify-between py-3 first:pt-0">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Online E-Commerce Purchases
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Allow checkout on SaaS, developer tools, and shopping portals
                  </span>
                </div>
                <button
                  onClick={() => setOnlinePurchases(!onlinePurchases)}
                  className="text-teal-700 dark:text-teal-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
                  aria-label="Toggle online purchases"
                >
                  {onlinePurchases ? (
                    <ToggleRight className="h-6 w-6 text-teal-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-slate-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    International Multi-Currency Use
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Automatic conversion when spending in non-USD currencies
                  </span>
                </div>
                <button
                  onClick={() => setInternationalUse(!internationalUse)}
                  className="text-teal-700 dark:text-teal-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
                  aria-label="Toggle international multi-currency use"
                >
                  {internationalUse ? (
                    <ToggleRight className="h-6 w-6 text-teal-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-slate-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between py-3 last:pb-0">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Auto-Freeze Inactivity Guard
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Automatically freeze card if no purchases occur within 30 days
                  </span>
                </div>
                <button
                  onClick={() => setAutoFreeze(!autoFreeze)}
                  className="text-teal-700 dark:text-teal-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
                  aria-label="Toggle auto-freeze inactivity guard"
                >
                  {autoFreeze ? (
                    <ToggleRight className="h-6 w-6 text-teal-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Card-Specific Transactions Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
              Card Purchase History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct charges settled from your primary USD wallet ledger.
            </p>
          </div>

          <Link
            href="/transactions"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400"
          >
            View Full Activity &rarr;
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#111726] divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-2xs">
          {cardTransactions.map((tx) => {
            const Icon = tx.icon;
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {tx.merchant}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {tx.category} &bull; {tx.date}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                    {tx.amountUsd}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                    {tx.amountIdr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
