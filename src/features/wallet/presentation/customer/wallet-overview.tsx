'use client';

import React from 'react';
import Link from 'next/link';
import { useWalletQuery } from '../../application/queries/use-wallet';
import { useWalletStore } from '../../application/stores/use-wallet-store';
import { useKycStatus, KycStatusBadge, canTransact } from '@/features/kyc';
import { useCardQuery } from '@/features/card';
import { useTransactionsQuery } from '@/features/transactions';
import { Button } from '@/shared/presentation/ui/button';
import { Skeleton } from '@/shared/presentation/ui/skeleton';
import { FxRateWidget } from '@/shared/presentation/ui/fx-rate-widget';
import { useFxRateQuery } from '@/shared/application/queries/use-fx-rate';
import { Money } from '@/shared/domain/money';
import { messages } from '@/shared/messages';
import { SpendingAnalyticsCard } from './spending-analytics-card';
import { SecuritySettingsCard } from './security-settings-card';
import { QuickTransferModal } from './quick-transfer-modal';
import { PromoBannerCarousel } from './promo-banner-carousel';
import {
  CreditCard,
  Eye,
  EyeOff,
  History,
  Plus,
  QrCode,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

export function WalletOverview() {
  const { data: wallet, isLoading: isWalletLoading, isError, refetch } = useWalletQuery();
  const { data: kycSubmission, isLoading: isKycLoading } = useKycStatus();
  const { data: cardDetails } = useCardQuery();
  const { isBalanceHidden, toggleBalanceHidden, modalMode, setModalMode } = useWalletStore();

  const { data: transactionsData = [] } = useTransactionsQuery();

  const kycStatus = kycSubmission?.status || 'not_verified';
  const isApproved = canTransact(kycStatus);

  const { data: fxData } = useFxRateQuery();
  const effectiveFxRate = fxData?.rate ?? 16250;

  // Honest zero fallback balance when wallet row has no settled ledger entries (AGENTS.md Section 6)
  const balanceCents = wallet ? wallet.balance.amount : 0n;
  const currentMoney = Money.fromCents(balanceCents, 'USD');
  const balanceIdr = Math.round((Number(balanceCents) / 100) * effectiveFxRate);

  const settledInflowCents = transactionsData
    .filter((tx) => tx.status === 'success' && (tx.type === 'topup' || tx.type === 'receive'))
    .reduce((sum, tx) => sum + tx.amountUsdCents, 0n);

  const settledOutflowCents = transactionsData
    .filter((tx) => tx.status === 'success' && tx.type === 'card')
    .reduce((sum, tx) => sum + tx.amountUsdCents, 0n);

  const inflowMoney = Money.fromCents(settledInflowCents, 'USD');
  const outflowMoney = Money.fromCents(settledOutflowCents, 'USD');

  if (isWalletLoading || isKycLoading) {
    return (
      <div className="space-y-6 font-sans antialiased text-slate-100">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          {messages.wallet.title}
        </h1>
        <Skeleton className="h-44 w-full bg-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full bg-slate-800" />
          <Skeleton className="h-64 w-full bg-slate-800" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 font-sans antialiased text-slate-100">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          {messages.wallet.title}
        </h1>
        <div className="rounded-2xl border border-rose-900 bg-rose-950/30 p-8 text-center">
          <p className="text-sm font-semibold text-rose-300">
            {messages.wallet.errorLoading}
          </p>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => refetch()}>
              {messages.common.tryAgain}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans antialiased text-slate-100">
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
        {messages.wallet.title}
      </h1>

      {/* 1. KYC Notice Alert Banner (when unapproved) */}
      {!isApproved && (
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/30 p-5 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-900 text-amber-200 shrink-0 mt-0.5">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-200">
                  {kycStatus === 'in_review'
                    ? 'Verifikasi Identitas Sedang Ditinjau'
                    : messages.kyc.banner.title}
                </h2>
                <p className="text-xs text-amber-300/80 mt-1 max-w-xl leading-relaxed">
                  {kycStatus === 'in_review'
                    ? 'Foto KTP Anda sedang diperiksa manual oleh tim kepatuhan. Fitur transaksi terbuka otomatis setelah disetujui.'
                    : messages.kyc.banner.description}
                </p>
              </div>
            </div>

            {kycStatus !== 'in_review' && (
              <Link href="/kyc/submit" className="shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 border-amber-600 text-slate-950 font-bold gap-2"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  <span>{messages.kyc.banner.cta}</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 2. Wise Zero-Markup FX Rate Lock Banner */}
      <FxRateWidget rateIdr={effectiveFxRate} guaranteedMinutes={15} />

      {/* 3. Hero Unified Balance Card */}
      <div className="rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-400">
              <span>{messages.wallet.currentBalance}</span>
              <button
                type="button"
                onClick={toggleBalanceHidden}
                className="ml-1 rounded p-1 text-zinc-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0] cursor-pointer"
                aria-label={isBalanceHidden ? 'Tampilkan saldo' : 'Sembunyikan saldo'}
              >
                {isBalanceHidden ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white tabular-nums">
                {isBalanceHidden ? messages.wallet.balanceHidden : currentMoney.format()}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
                USD
              </span>
            </div>

            <p className="mt-1 font-mono text-xs text-zinc-400">
              {isBalanceHidden
                ? '••••••••••••'
                : `≈ Rp${balanceIdr.toLocaleString('id-ID')}`}
              <span className="ml-2 inline-flex items-center rounded-sm bg-sky-950 px-1.5 py-0.5 text-[10px] font-medium text-[#67E8F9] border border-sky-800/40">
                Kurs Wise Rp{effectiveFxRate.toLocaleString('id-ID')}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              disabled={!isApproved}
              onClick={() => setModalMode('topup')}
              className="gap-2 shadow-md font-bold bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white border-[#1D9BF0]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>{messages.wallet.actions.topUp}</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              disabled={!isApproved}
              onClick={() => setModalMode('receive')}
              className="gap-2 font-medium border-white/8 bg-[#12141a] text-zinc-200 hover:bg-white/6"
            >
              <QrCode className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
              <span>{messages.wallet.actions.receive}</span>
            </Button>

            <Link href="/card">
              <Button
                variant="outline"
                size="md"
                className="gap-2 font-medium border-white/8 bg-[#12141a] text-zinc-200 hover:bg-white/6"
              >
                <CreditCard className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
                <span>{messages.wallet.actions.manageCard}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Real Ledger-Derived Sub-Cards */}
        <div className="mt-7 pt-6 border-t border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-zinc-400 block">{messages.wallet.availableFunds}</span>
            <span className="font-mono font-bold text-white mt-0.5 block tabular-nums text-sm">
              {isBalanceHidden ? '••••' : currentMoney.format()}
            </span>
          </div>

          <div>
            <span className="text-zinc-400 block">{messages.wallet.monthlySpending}</span>
            <span className="font-mono font-bold text-white mt-0.5 block tabular-nums text-sm">
              {isBalanceHidden ? '••••' : outflowMoney.format()}
            </span>
          </div>

          <div>
            <span className="text-zinc-400 block">{messages.wallet.totalInflow}</span>
            <span className="font-mono font-bold text-[#67E8F9] mt-0.5 block tabular-nums text-sm">
              {isBalanceHidden ? '••••' : `+${inflowMoney.format()}`}
            </span>
          </div>

          <div>
            <span className="text-zinc-400 block">{messages.wallet.identityVerification}</span>
            <div className="mt-1">
              <KycStatusBadge status={kycStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Promo Banner Carousel */}
      <PromoBannerCarousel
        onTopUpClick={() => {
          if (isApproved) setModalMode('topup');
        }}
        onReceiveClick={() => {
          if (isApproved) setModalMode('receive');
        }}
      />

      {/* 5. Security & Spending Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <SecuritySettingsCard kycStatus={kycStatus} />
        </div>
        <div className="lg:col-span-6">
          <SpendingAnalyticsCard
            transactions={transactionsData}
            monthlyLimitUsd={cardDetails?.monthlyLimit ?? 2000}
          />
        </div>
      </div>

      {/* 6. Shortcut to Dedicated Transaction History (DU-04 excluded per AGENTS.md Section 5) */}
      <div className="rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-950/60 text-[#22D3EE] border border-sky-800/40 shrink-0">
            <History className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-white">
              {messages.wallet.ledgerShortcutTitle}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
              {messages.wallet.ledgerShortcutDescription}
            </p>
          </div>
        </div>

        <Link href="/transactions" className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="border-white/8 bg-[#12141a] text-zinc-200 hover:bg-white/6 font-semibold"
          >
            {messages.wallet.ledgerShortcutCta}
          </Button>
        </Link>
      </div>

      {/* Quick Top-Up & Receive Modal */}
      <QuickTransferModal
        mode={modalMode}
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
      />
    </div>
  );
}
