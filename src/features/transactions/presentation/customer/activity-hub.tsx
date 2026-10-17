'use client';

import React, { useState } from 'react';
import { TransactionItem, TransactionType } from '../../domain/entities/transaction';
import { TransactionReceiptDrawer } from './transaction-receipt-drawer';
import { Button } from '@/shared/presentation/ui/button';
import {
  Download,
  History,
  Plus,
  QrCode,
  Search,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';

export function ActivityHub() {
  const [activeTab, setActiveTab] = useState<'all' | TransactionType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

  const transactions: TransactionItem[] = [
    {
      id: 'tx-01',
      title: 'Top Up via BCA Virtual Account',
      merchant: 'BCA Payment Gateway',
      type: 'topup',
      category: 'Deposit',
      status: 'success',
      amountUsdCents: 50000n, // $500.00
      amountIdr: 8125000,
      fxRate: 16250,
      feeIdr: 4500,
      channel: 'BCA Virtual Account',
      referenceId: 'REF-BCA-9201948102948',
      idempotencyKey: 'idemp_bca_topup_500_001',
      ledgerSequence: 'LDG-2026-00891',
      timestampUtc: '2026-10-17 07:20:00 UTC',
      timestampWib: '17 Okt 2026, 14:20 WIB',
    },
    {
      id: 'tx-02',
      title: 'AWS Cloud Infrastructure',
      merchant: 'Amazon Web Services',
      type: 'card',
      category: 'Cloud & Infrastructure',
      status: 'success',
      amountUsdCents: 8450n, // $84.50
      amountIdr: 1373125,
      fxRate: 16250,
      feeIdr: 0,
      channel: 'VISA Platinum Virtual (*4821)',
      referenceId: 'REF-AWS-7482910481023',
      idempotencyKey: 'idemp_aws_bill_84_50',
      ledgerSequence: 'LDG-2026-00892',
      timestampUtc: '2026-10-16 02:15:00 UTC',
      timestampWib: '16 Okt 2026, 09:15 WIB',
    },
    {
      id: 'tx-03',
      title: 'GitHub Enterprise Subscription',
      merchant: 'GitHub Inc.',
      type: 'card',
      category: 'Developer Subscriptions',
      status: 'success',
      amountUsdCents: 2100n, // $21.00
      amountIdr: 341250,
      fxRate: 16250,
      feeIdr: 0,
      channel: 'VISA Platinum Virtual (*4821)',
      referenceId: 'REF-GH-1029384756102',
      idempotencyKey: 'idemp_gh_sub_21_00',
      ledgerSequence: 'LDG-2026-00893',
      timestampUtc: '2026-10-14 11:00:00 UTC',
      timestampWib: '14 Okt 2026, 18:00 WIB',
    },
    {
      id: 'tx-04',
      title: 'Received Payment via QRIS',
      merchant: 'PT Solusi Teknologi Bersama',
      type: 'receive',
      category: 'Rupiah Payment Converted',
      status: 'success',
      amountUsdCents: 12000n, // $120.00
      amountIdr: 1950000,
      fxRate: 16250,
      feeIdr: 13650,
      channel: 'QRIS Dynamic Merchant',
      referenceId: 'REF-QRS-8492019481023',
      idempotencyKey: 'idemp_qris_rec_120_00',
      ledgerSequence: 'LDG-2026-00894',
      timestampUtc: '2026-10-12 04:45:00 UTC',
      timestampWib: '12 Okt 2026, 11:45 WIB',
    },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesTab = activeTab === 'all' || tx.type === activeTab;
    const matchesQuery =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.referenceId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  function getIcon(type: TransactionType) {
    switch (type) {
      case 'topup':
        return Plus;
      case 'receive':
        return QrCode;
      case 'card':
      default:
        return ShoppingBag;
    }
  }

  return (
    <div className="space-y-8 font-sans antialiased text-slate-900 dark:text-slate-100">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
              <History className="h-4 w-4" aria-hidden="true" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Financial Activity & Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Append-only double-entry ledger. Select any item to view cryptographic settlement proof.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Exporting monthly statement CSV...')}
          className="gap-1.5 text-xs font-medium self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Export Statement</span>
        </Button>
      </div>

      {/* 2. Monthly Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111726] shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Inflow (October)</span>
          <p className="font-mono text-2xl font-bold tracking-tight text-teal-700 dark:text-teal-400 tabular-nums">
            +$620.00
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Deposits & Received IDR</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111726] shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Outflow (October)</span>
          <p className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            -$105.50
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Virtual Debit Card Charges</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-[#111726] shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Net Flow Growth</span>
          <div className="flex items-center gap-1.5">
            <p className="font-mono text-2xl font-bold tracking-tight text-teal-700 dark:text-teal-400 tabular-nums">
              +$514.50
            </p>
            <TrendingUp className="h-4 w-4 text-teal-600" aria-hidden="true" />
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Net wallet balance delta</span>
        </div>
      </div>

      {/* 3. Search & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by merchant, title, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200/80 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 dark:border-slate-800 dark:bg-[#111726] dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            All Ledger
          </button>
          <button
            onClick={() => setActiveTab('topup')}
            className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'topup'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Top Ups
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'card'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Card Purchases
          </button>
          <button
            onClick={() => setActiveTab('receive')}
            className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'receive'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Received IDR
          </button>
        </div>
      </div>

      {/* 4. Ledger Transaction List */}
      <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#111726] divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-2xs">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            No transactions match your search or filter.
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const Icon = getIcon(tx.type);
            const isCredit = tx.type === 'topup' || tx.type === 'receive';
            const formattedUsd = `$${(Number(tx.amountUsdCents) / 100).toFixed(2)}`;

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/70 dark:hover:bg-slate-850/50 cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedTx(tx);
                }}
                aria-label={`View receipt for ${tx.title}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                      isCredit
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {tx.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {tx.channel} &bull; {tx.timestampWib}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`font-mono text-sm font-bold tabular-nums ${
                      isCredit
                        ? 'text-teal-700 dark:text-teal-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {isCredit ? '+' : '-'}{formattedUsd}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                    ≈ Rp {tx.amountIdr.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Settlement Receipt Drawer */}
      <TransactionReceiptDrawer
        transaction={selectedTx}
        isOpen={selectedTx !== null}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
