'use client';

import React from 'react';
import { Wallet } from '../../domain/entities/wallet';
import { useWalletStore } from '../../application/stores/use-wallet-store';
import { messages } from '@/shared/messages/en';
import { Eye, EyeOff, Lock } from 'lucide-react';

export interface BalanceCardProps {
  wallet: Wallet;
}

export function BalanceCard({ wallet }: BalanceCardProps) {
  const { isBalanceHidden, toggleBalanceHidden } = useWalletStore();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>{messages.wallet.currentBalance}</span>
          <button
            onClick={toggleBalanceHidden}
            className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer"
            aria-label={isBalanceHidden ? 'Show wallet balance' : 'Hide wallet balance'}
          >
            {isBalanceHidden ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {wallet.isFrozen && (
            <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-300">
              <Lock className="h-3 w-3" aria-hidden="true" />
              <span>Frozen</span>
            </span>
          )}
          <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-900">
            USD Wallet
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white font-mono tabular-nums">
          {isBalanceHidden ? messages.wallet.balanceHidden : wallet.balance.format()}
        </span>
        <span className="text-sm font-medium text-slate-500">USD</span>
      </div>
    </div>
  );
}
