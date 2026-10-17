'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWalletQuery } from '../../application/queries/use-wallet';
import { useWalletStore } from '../../application/stores/use-wallet-store';
import { VirtualDebitCard } from '@/features/card';
import { useKycStatus, KycStatusBadge, canTransact } from '@/features/kyc';
import { Button } from '@/shared/presentation/ui/button';
import { Skeleton } from '@/shared/presentation/ui/skeleton';
import { FxRateWidget } from '@/shared/presentation/ui/fx-rate-widget';
import { messages } from '@/shared/messages/en';
import { Money } from '@/shared/domain/money';
import { SpendingAnalyticsCard } from './spending-analytics-card';
import { SavingsVaultsCard } from './savings-vaults-card';
import { SecuritySettingsCard } from './security-settings-card';
import { QuickTransferModal } from './quick-transfer-modal';
import {
  CreditCard,
  Eye,
  EyeOff,
  Plus,
  QrCode,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export function WalletOverview() {
  const { data: wallet, isLoading: isWalletLoading, isError, refetch } = useWalletQuery();
  const { data: kycSubmission, isLoading: isKycLoading } = useKycStatus();
  const { isBalanceHidden, toggleBalanceHidden } = useWalletStore();

  const [activeTab, setActiveTab] = useState<'all' | 'topup' | 'card' | 'receive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState<'topup' | 'receive' | null>(null);

  const kycStatus = kycSubmission?.status || 'not_verified';
  const isApproved = canTransact(kycStatus);

  // Initial demo / realistic balance: $1,250.00 (125,000 cents) if newly created
  const balanceCents = wallet ? wallet.balance.amount : 125000n;
  const currentMoney = Money.fromCents(balanceCents, 'USD');

  // Realistic transaction fixtures per PRD & AGENTS.md rules
  const transactions = [
    {
      id: 'tx-01',
      title: 'Top Up via BCA Virtual Account',
      type: 'topup',
      category: 'Deposit',
      date: 'Today, 14:20 WIB',
      amountUsd: '+$500.00',
      amountIdr: 'Rp 8.125.000',
      status: 'success',
      icon: Plus,
      iconColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
    },
    {
      id: 'tx-02',
      title: 'AWS Cloud Infrastructure',
      type: 'card',
      category: 'Card Purchase',
      date: 'Yesterday, 09:15 WIB',
      amountUsd: '-$84.50',
      amountIdr: 'Rp 1.373.125',
      status: 'success',
      icon: ShoppingBag,
      iconColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'tx-03',
      title: 'GitHub Enterprise Subscription',
      type: 'card',
      category: 'Card Purchase',
      date: '14 Oct 2026, 18:00 WIB',
      amountUsd: '-$21.00',
      amountIdr: 'Rp 341.250',
      status: 'success',
      icon: ShoppingBag,
      iconColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'tx-04',
      title: 'Received Payment via QRIS',
      type: 'receive',
      category: 'Rupiah Payment Converted',
      date: '12 Oct 2026, 11:45 WIB',
      amountUsd: '+$120.00',
      amountIdr: 'Rp 1.950.000',
      status: 'success',
      icon: QrCode,
      iconColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    const matchesTab = activeTab === 'all' || t.type === activeTab;
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  if (isWalletLoading || isKycLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-44 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-8 text-center dark:border-rose-900 dark:bg-rose-950/30">
        <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">
          Failed to load your wallet data.
        </p>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => refetch()}>
            {messages.common.tryAgain}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. KYC Notice Alert Banner (when unapproved) */}
      {!isApproved && (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 dark:border-amber-900/60 dark:bg-amber-950/30 backdrop-blur-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200 shrink-0 mt-0.5">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                  {kycStatus === 'in_review'
                    ? 'Identity Verification In Progress'
                    : 'Verify your ID to unlock deposits and virtual cards'}
                </h2>
                <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mt-1 max-w-xl">
                  {kycStatus === 'in_review'
                    ? 'Your Indonesian National ID (KTP) photo is being verified by compliance. Full wallet capabilities will unlock automatically upon approval.'
                    : 'Under Indonesian financial regulations, upload a clear photo of your KTP to activate Rupiah top-up and spend worldwide with your virtual card.'}
                </p>
              </div>
            </div>

            {kycStatus !== 'in_review' && (
              <Link href="/kyc/submit" className="shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 border-amber-800 text-white gap-2"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  <span>Verify Identity (KTP)</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 2. Hero Financial Overview Card (Revolut / Linear style) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-2xs dark:border-slate-800/80 dark:bg-[#111726] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            {/* Account identifier */}
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Primary USD Balance</span>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="font-mono text-slate-600 dark:text-slate-300">
                ACC-8924-ID
              </span>
              <button
                onClick={toggleBalanceHidden}
                className="ml-1 rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer"
                aria-label={isBalanceHidden ? 'Show wallet balance' : 'Hide wallet balance'}
              >
                {isBalanceHidden ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Huge Clean Balance Display */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white font-mono tabular-nums">
                {isBalanceHidden ? messages.wallet.balanceHidden : currentMoney.format()}
              </span>
              <span className="text-base font-semibold text-slate-400 uppercase tracking-wider">
                USD
              </span>
            </div>

            {/* Equivalent Rupiah Indicator */}
            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>≈ {isBalanceHidden ? '••••••' : 'Rp 20.312.500 IDR'}</span>
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-mono font-medium">
                (at Rp 16.250 / USD)
              </span>
            </div>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setModalMode('topup')}
              className="gap-2 shadow-xs font-semibold"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Top Up USD</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => setModalMode('receive')}
              className="gap-2 font-medium"
            >
              <QrCode className="h-4 w-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
              <span>Receive IDR</span>
            </Button>

            <Link href="/card">
              <Button variant="outline" size="md" className="gap-2 font-medium">
                <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                <span>Manage Card</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Financial Stat Sub-Cards */}
        <div className="mt-8 pt-7 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Available Funds</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block tabular-nums text-sm">
              {isBalanceHidden ? '••••' : '$1,250.00'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Spent This Month</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono font-bold text-slate-900 dark:text-white block tabular-nums text-sm">
                {isBalanceHidden ? '••••' : '$105.50'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">(-14%)</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Total Inflow</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono font-bold text-teal-700 dark:text-teal-400 block tabular-nums text-sm">
                {isBalanceHidden ? '••••' : '+$620.00'}
              </span>
              <TrendingUp className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
            </div>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block">KYC Verification</span>
            <div className="mt-1">
              <KycStatusBadge status={kycStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Virtual Debit Card + Guaranteed FX Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Virtual Debit Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-teal-600" aria-hidden="true" />
              <span>Virtual Debit Card</span>
            </h2>
            <Link
              href="/card"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400"
            >
              Card Limits & Details &rarr;
            </Link>
          </div>

          <VirtualDebitCard
            cardholderName="BUDI SANTOSO"
            last4="4821"
            expiry="08/29"
            isFrozen={false}
          />
        </div>

        {/* Right Column: Live FX Conversion Widget & Spending Analytics */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" aria-hidden="true" />
              <span>Exchange Rate Guarantee</span>
            </h2>
            <span className="text-xs text-slate-500">Live 15-Min Lock</span>
          </div>

          <FxRateWidget rateIdr={16250} guaranteedMinutes={15} />

          {/* Spending Analytics Component */}
          <SpendingAnalyticsCard />
        </div>
      </div>

      {/* 4. Second Row Grid: Savings Goals / Vaults & Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6">
          <SavingsVaultsCard />
        </div>
        <div className="lg:col-span-6">
          <SecuritySettingsCard kycStatus={kycStatus} />
        </div>
      </div>

      {/* 5. Bottom Section: Transaction Activity Ledger */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
              Recent Transactions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Append-only ledger entries in UTC displayed in local Jakarta time (WIB).
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border border-slate-200/80 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('topup')}
                className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
                  activeTab === 'topup'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Top Ups
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Card Purchases
              </button>
              <button
                onClick={() => setActiveTab('receive')}
                className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
                  activeTab === 'receive'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Received
              </button>
            </div>
          </div>
        </div>

        {/* Transaction Table / List */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#111726] divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-2xs">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No transactions found matching your criteria.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const Icon = tx.icon;
              const isPositive = tx.amountUsd.startsWith('+');
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${tx.iconColor}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {tx.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {tx.category} &bull; {tx.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-mono text-sm font-bold tabular-nums ${
                        isPositive
                          ? 'text-teal-700 dark:text-teal-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isBalanceHidden ? '••••••' : tx.amountUsd}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                      {isBalanceHidden ? '••••••' : tx.amountIdr}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Transfer & Deposit Modal */}
      <QuickTransferModal
        mode={modalMode}
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
      />
    </div>
  );
}
