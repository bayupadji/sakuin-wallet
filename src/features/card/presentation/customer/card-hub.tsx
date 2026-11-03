'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthUser } from '@/features/auth';
import { useKycStatus, canTransact } from '@/features/kyc';
import { VirtualDebitCard } from './virtual-debit-card';
import { useCardQuery } from '../../application/queries/use-card';
import { useUpdateCardControlsMutation } from '../../application/mutations/use-card-mutations';
import { useTransactionsQuery } from '@/features/transactions';
import { Button } from '@/shared/presentation/ui/button';
import { messages } from '@/shared/messages';
import {
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Sliders,
} from 'lucide-react';

export function CardHub() {
  const { data: authUser } = useAuthUser();
  const { data: kycSubmission } = useKycStatus();
  const kycStatus = kycSubmission?.status || 'not_verified';
  const isApproved = canTransact(kycStatus);

  const { data: cardDetails } = useCardQuery();
  const updateControlsMutation = useUpdateCardControlsMutation();
  const { data: cardTransactions = [] } = useTransactionsQuery({ type: 'card' });

  const monthlyLimit = cardDetails?.monthlyLimit ?? 2000;
  const currentSpent = cardTransactions
    .filter((tx) => tx.status === 'success')
    .reduce((sum, tx) => sum + Number(tx.amountUsdCents) / 100, 0);
  const percentageUsed =
    monthlyLimit > 0 ? Math.min(100, Math.round((currentSpent / monthlyLimit) * 100)) : 0;

  return (
    <div className="space-y-6 font-sans antialiased text-slate-100">
      {/* 1. Header */}
      <div className="border-b border-white/8/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-950/60 text-[#22D3EE] border border-sky-800/50">
              <CreditCard className="h-4 w-4" aria-hidden="true" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {messages.card.title}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {messages.card.subtitle}
          </p>
        </div>
      </div>

      {/* 2. KYC Notice Banner (if unapproved) */}
      {!isApproved && (
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-amber-200">
                {messages.card.kycNoticeTitle}
              </h2>
              <p className="text-xs text-amber-300/80 mt-1">
                {messages.card.kycNoticeDescription}
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
                  <span>{messages.card.kycNoticeCta}</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 3. Virtual Debit Card */}
      <VirtualDebitCard
        cardholderName={cardDetails?.cardholderName || authUser?.fullName || 'Nasabah Sakuin'}
        last4={cardDetails?.last4 || '4821'}
        expiry={cardDetails?.expiry || '08/29'}
        issuingCountry={cardDetails?.issuingCountry || 'Singapura (MAS)'}
        isFrozen={!isApproved || (cardDetails?.isFrozen ?? false)}
        onlineTransactions={cardDetails?.onlineTransactions ?? true}
        non3dsTransactions={cardDetails?.non3dsTransactions ?? true}
        atmWithdrawals={cardDetails?.atmWithdrawals ?? false}
      />

      {/* 4. Bottom Grid: Spending Limits + Card Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Spending Limit Controller */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-950/60 text-[#22D3EE] border border-sky-800/40">
                  <Sliders className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {messages.card.monthlyLimitTitle}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {messages.card.monthlyLimitSubtitle}
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-[#67E8F9] tabular-nums">
                ${monthlyLimit.toFixed(2)} USD
              </span>
            </div>

            {/* Limit Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">
                  {messages.card.spentLabel}: ${currentSpent.toFixed(2)}
                </span>
                <span className="font-mono font-semibold text-slate-200">
                  {messages.card.remainingLabel} ${Math.max(0, monthlyLimit - currentSpent).toFixed(2)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-[#22D3EE] rounded-full transition-all duration-300"
                  style={{ width: `${percentageUsed}%` }}
                />
              </div>
            </div>

            {/* Slider control */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <label htmlFor="monthly-card-limit-range">Atur Batas Maksimal:</label>
                <span className="font-mono font-bold text-white">${monthlyLimit} USD</span>
              </div>
              <input
                id="monthly-card-limit-range"
                type="range"
                min="50"
                max="5000"
                step="50"
                value={monthlyLimit}
                onChange={(e) =>
                  updateControlsMutation.mutate({ monthlyLimit: Number(e.target.value) })
                }
                className="w-full accent-[#1D9BF0] cursor-pointer"
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
        <div className="lg:col-span-6 rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">
                {messages.card.cardTransactionsTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {messages.card.cardTransactionsSubtitle}
              </p>
            </div>

            <Link
              href="/transactions"
              className="text-xs font-semibold text-[#1D9BF0] hover:text-[#22D3EE] transition-colors"
            >
              {messages.wallet.actions.history}
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 border-t border-white/8 pt-1">
            {cardTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                {messages.card.emptyCardTransactions}
              </div>
            ) : (
              cardTransactions.slice(0, 3).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 hover:bg-[#12141a]/80 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-slate-900 text-[#22D3EE] border border-white/8">
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
                      Rp{tx.amountIdr.toLocaleString('id-ID')}
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
