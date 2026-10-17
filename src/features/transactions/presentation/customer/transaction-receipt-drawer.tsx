'use client';

import React, { useState } from 'react';
import { Dialog } from '@/shared/presentation/ui/dialog';
import { Button } from '@/shared/presentation/ui/button';
import { TransactionItem } from '../../domain/entities/transaction';
import { Money } from '@/shared/domain/money';
import { Check, CheckCircle2, Clock, Copy, ShieldCheck, XCircle } from 'lucide-react';

interface TransactionReceiptDrawerProps {
  transaction: TransactionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionReceiptDrawer({
  transaction,
  isOpen,
  onClose,
}: TransactionReceiptDrawerProps) {
  const [copiedKey, setCopiedKey] = useState(false);

  if (!transaction) return null;

  const isCredit = transaction.type === 'topup' || transaction.type === 'receive';
  const money = Money.fromCents(transaction.amountUsdCents, 'USD');

  function handleCopyReference() {
    navigator.clipboard.writeText(transaction!.referenceId);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Settlement Proof"
      description="Cryptographic ledger record verified by double-entry accounting rules."
    >
      <div className="space-y-6 pt-2 font-sans text-xs">
        {/* Hero Amount Display */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/60 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border mb-1 bg-white dark:bg-slate-850">
            {transaction.status === 'success' ? (
              <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Settled into Ledger</span>
              </span>
            ) : transaction.status === 'pending' ? (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Awaiting Gateway Webhook</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Failed</span>
              </span>
            )}
          </div>

          <p
            className={`font-mono text-3xl font-extrabold tracking-tight tabular-nums ${
              isCredit
                ? 'text-teal-700 dark:text-teal-400'
                : 'text-slate-950 dark:text-white'
            }`}
          >
            {isCredit ? '+' : '-'}{money.format()}
          </p>

          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
            ≈ Rp {transaction.amountIdr.toLocaleString('id-ID')} IDR
          </p>
        </div>

        {/* Ledger Proof Specifications */}
        <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/80 border-y border-slate-100 dark:border-slate-800/80 py-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Transaction Title</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {transaction.title}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-slate-500">Settlement Channel</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {transaction.channel}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-slate-500">Applied FX Rate</span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
              1 USD = Rp {transaction.fxRate.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-slate-500">Gateway Fee</span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
              Rp {transaction.feeIdr.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-slate-500">Local Time (Jakarta)</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {transaction.timestampWib}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-slate-500">Ledger Timestamp (UTC)</span>
            <span className="font-mono text-slate-500">
              {transaction.timestampUtc}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-slate-500">Ledger Sequence ID</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {transaction.ledgerSequence}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-slate-500">Reference Hash</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              <span>{transaction.referenceId.slice(0, 16)}...</span>
              <button
                onClick={handleCopyReference}
                className="text-teal-600 hover:text-teal-700 p-0.5 cursor-pointer"
                aria-label="Copy reference hash"
              >
                {copiedKey ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Security & Idempotency Guarantee */}
        <div className="flex items-start gap-2.5 rounded-xl bg-teal-50/60 p-3.5 text-xs dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/60">
          <ShieldCheck className="h-4 w-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[11px] text-teal-950 dark:text-teal-200 leading-relaxed">
            Append-only record guaranteed by cryptographic checksum. Balances are derived directly from immutable ledger rows.
          </p>
        </div>

        {/* Drawer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handleCopyReference} className="gap-1.5">
            {copiedKey ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey ? 'Copied Reference' : 'Copy Reference'}</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
