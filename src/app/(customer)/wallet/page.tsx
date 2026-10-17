import React from 'react';
import Link from 'next/link';
import { messages } from '@/shared/messages/en';
import { Button } from '@/shared/presentation/ui/button';
import { EmptyState } from '@/shared/presentation/ui/empty-state';
import { ArrowDownLeft, CreditCard, ShieldCheck } from 'lucide-react';

export default function WalletPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {messages.wallet.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your digital dollar balance and virtual debit cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/top-up">
            <Button variant="primary" className="gap-2">
              <ArrowDownLeft className="h-4 w-4" aria-hidden="true" />
              <span>{messages.wallet.actions.topUp}</span>
            </Button>
          </Link>
          <Link href="/card">
            <Button variant="secondary" className="gap-2">
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              <span>{messages.wallet.actions.requestCard}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KYC Alert Banner (When Unverified) */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-950/40">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              {messages.kyc.banner.title}
            </h2>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              {messages.kyc.banner.description}
            </p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 border-amber-300 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-200">
            {messages.kyc.banner.cta}
          </Button>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>{messages.wallet.currentBalance}</span>
          <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-900">
            USD Wallet
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white font-mono tabular-nums">
            $0.00
          </span>
          <span className="text-sm font-medium text-slate-500">USD</span>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h2>
          <Link href="/transactions" className="text-xs font-medium text-teal-700 hover:text-teal-800 dark:text-teal-400">
            {messages.common.viewDetails}
          </Link>
        </div>

        {/* Empty state per AGENTS.md & Antislop */}
        <EmptyState
          title={messages.emptyStates.noTransactionsTitle}
          description={messages.emptyStates.noTransactionsDescription}
          actionLabel={messages.wallet.actions.topUp}
          actionHref="/top-up"
        />
      </div>
    </div>
  );
}
