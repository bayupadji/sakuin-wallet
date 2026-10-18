'use client';

import React from 'react';
import { TransactionType } from '../../domain/entities/transaction';
import { useTransactionStore } from '../../application/stores/use-transaction-store';
import { useTransactionsQuery } from '../../application/queries/use-transactions';
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
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedTransaction: selectedTx,
    setSelectedTransaction: setSelectedTx,
  } = useTransactionStore();

  const { data: transactionsData } = useTransactionsQuery({
    type: activeTab,
    search: searchQuery,
  });
  const filteredTransactions = transactionsData || [];

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
    <div className="space-y-6 font-sans antialiased text-slate-100">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-950 text-teal-400 border border-teal-800/40">
              <History className="h-4 w-4" aria-hidden="true" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Riwayat Transaksi & Buku Besar
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Buku besar append-only double-entry. Pilih transaksi untuk melihat bukti settlement kriptografis.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Mengekspor laporan mutasi rekening CSV...')}
          className="gap-1.5 text-xs font-medium self-start sm:self-auto border-slate-800 bg-[#111726] text-slate-200 hover:bg-slate-800"
        >
          <Download className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
          <span>Ekspor Mutasi (CSV)</span>
        </Button>
      </div>

      {/* 2. Monthly Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Total Arus Masuk (Oktober)</span>
          <p className="font-mono text-2xl font-bold tracking-tight text-teal-400 tabular-nums">
            +$620.00
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Deposit VA & QRIS</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Total Pengeluaran (Oktober)</span>
          <p className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
            -$105.50
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Pembelian Kartu Virtual</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Pertumbuhan Saldo Bersih</span>
          <div className="flex items-center gap-1.5">
            <p className="font-mono text-2xl font-bold tracking-tight text-teal-400 tabular-nums">
              +$514.50
            </p>
            <TrendingUp className="h-4 w-4 text-teal-400" aria-hidden="true" />
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Delta saldo dompet</span>
        </div>
      </div>

      {/* 3. Ledger Transaction Hub Card (Search + Filter + Rows) */}
      <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 sm:p-7 shadow-xl space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Cari transaksi, merchant, ID ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#0c121e] pl-9 pr-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Buku Besar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('topup')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'topup'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Isi Saldo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'card'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pembelian Kartu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('receive')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'receive'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Terima Dana
            </button>
          </div>
        </div>

        {/* Ledger Transaction List */}
        <div className="divide-y divide-slate-800/80 border-t border-slate-800 pt-1">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Tidak ada transaksi yang sesuai dengan pencarian Anda.
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
                  className="flex items-center justify-between p-3.5 sm:px-4 hover:bg-[#0c121e]/80 rounded-xl cursor-pointer transition-colors"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedTx(tx);
                  }}
                  aria-label={`Lihat tanda terima untuk ${tx.title}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                        isCredit
                          ? 'bg-teal-950 text-teal-400 border border-teal-800/40'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-white truncate">
                        {tx.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tx.channel} &bull; {tx.timestampWib}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-mono text-sm font-bold tabular-nums ${
                        isCredit
                          ? 'text-teal-400'
                          : 'text-white'
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
