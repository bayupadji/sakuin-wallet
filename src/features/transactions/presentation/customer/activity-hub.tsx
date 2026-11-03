'use client';

import React, { useEffect, useState } from 'react';
import { TransactionStatus, TransactionType } from '../../domain/entities/transaction';
import { useTransactionStore } from '../../application/stores/use-transaction-store';
import { useTransactionsQuery } from '../../application/queries/use-transactions';
import { Button } from '@/shared/presentation/ui/button';
import { Skeleton } from '@/shared/presentation/ui/skeleton';
import { messages } from '@/shared/messages';
import { cn } from '@/shared/utils/cn';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  History,
  Plus,
  QrCode,
  Search,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export function getPast12MonthsPeriodOptions(
  baseDate: Date = new Date()
): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [
    { value: 'all', label: messages.transactions.allPeriodLabel },
  ];
  for (let i = 0; i < 12; i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const monthName = MONTH_NAMES_ID[d.getMonth()];
    options.push({
      value: `${year}-${month}`,
      label: `${monthName} ${year}`,
    });
  }
  return options;
}

function getPaginationRange(current: number, total: number): (number | string)[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, '...', total];
  }
  if (current >= total - 2) {
    return [1, '...', total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

function getStatusBadgeClasses(status: TransactionStatus): string {
  switch (status) {
    case 'success':
      return 'bg-sky-950/80 text-[#7CE8C8] border-sky-800/50';
    case 'pending':
      return 'bg-amber-950/60 text-amber-300 border-amber-800/50';
    case 'refunded':
      return 'bg-slate-800 text-slate-200 border-slate-700';
    case 'failed':
    case 'expired':
    default:
      return 'bg-rose-950/60 text-rose-300 border-rose-800/50';
  }
}

export function ActivityHub() {
  const {
    activeTab,
    setActiveTab,
    selectedMonth,
    setSelectedMonth,
    searchQuery,
    setSearchQuery,
  } = useTransactionStore();

  const [periodOptions, setPeriodOptions] = useState<{ value: string; label: string }[]>([
    { value: 'all', label: messages.transactions.allPeriodLabel },
  ]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setPeriodOptions(getPast12MonthsPeriodOptions(new Date()));
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const {
    data: transactionsData,
    isLoading,
    isError,
    refetch,
  } = useTransactionsQuery({
    type: activeTab,
    search: searchQuery,
    month: selectedMonth,
  });
  const filteredTransactions = transactionsData || [];

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const handleTabChange = (tab: 'all' | TransactionType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === safeCurrentPage || newPage < 1 || newPage > totalPages || isPageLoading) return;
    setIsPageLoading(true);
    setCurrentPage(newPage);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setIsPageLoading(true);
    setItemsPerPage(newSize);
    setCurrentPage(1);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  };

  const startIndex = filteredTransactions.length === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(safeCurrentPage * itemsPerPage, filteredTransactions.length);
  const paginatedTransactions = filteredTransactions.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );
  const paginationRange = getPaginationRange(safeCurrentPage, totalPages);

  // Only settled ('success') transactions affect wallet balance (AGENTS.md Section 6 Rule 11)
  const totalInflowCents = filteredTransactions
    .filter((tx) => tx.status === 'success' && (tx.type === 'topup' || tx.type === 'receive'))
    .reduce((acc, tx) => acc + Number(tx.amountUsdCents), 0);

  const totalOutflowCents = filteredTransactions
    .filter((tx) => tx.status === 'success' && tx.type === 'card')
    .reduce((acc, tx) => acc + Number(tx.amountUsdCents), 0);

  const netGrowthCents = totalInflowCents - totalOutflowCents;
  const matchedPeriod = periodOptions.find((opt) => opt.value === selectedMonth);
  const currentPeriodLabel =
    selectedMonth === 'all' ? '1 Tahun Terakhir' : matchedPeriod?.label || selectedMonth;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-950/60 text-[#22D3EE] border border-sky-800/40">
              <History className="h-4 w-4" aria-hidden="true" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {messages.transactions.title}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1.5">
            {messages.transactions.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Monthly Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/8 bg-[#050507] p-6 shadow-xl space-y-1">
          <span className="text-xs text-zinc-400">
            {messages.transactions.inflowLabel} ({currentPeriodLabel})
          </span>
          <p className="font-mono text-2xl font-bold tracking-tight text-[#7CE8C8] tabular-nums">
            +${(totalInflowCents / 100).toFixed(2)}
          </p>
          <span className="text-[11px] text-zinc-400 font-mono">Transaksi Berhasil</span>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#050507] p-6 shadow-xl space-y-1">
          <span className="text-xs text-zinc-400">
            {messages.transactions.outflowLabel} ({currentPeriodLabel})
          </span>
          <p className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
            -${(totalOutflowCents / 100).toFixed(2)}
          </p>
          <span className="text-[11px] text-zinc-400 font-mono">Pembelian Kartu Virtual</span>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#050507] p-6 shadow-xl space-y-1">
          <span className="text-xs text-zinc-400">{messages.transactions.netGrowthLabel}</span>
          <div className="flex items-center gap-1.5">
            <p
              className={`font-mono text-2xl font-bold tracking-tight tabular-nums ${
                netGrowthCents >= 0 ? 'text-[#7CE8C8]' : 'text-rose-400'
              }`}
            >
              {netGrowthCents >= 0 ? '+' : '-'}${Math.abs(netGrowthCents / 100).toFixed(2)}
            </p>
            <TrendingUp className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            Delta buku besar ({currentPeriodLabel})
          </span>
        </div>
      </div>

      {/* 3. Ledger Transaction Hub Card */}
      <div className="rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
              <input
                type="text"
                placeholder={messages.transactions.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                aria-label={messages.transactions.searchPlaceholder}
                className="w-full rounded-xl border border-white/8 bg-[#12141a] pl-9 pr-3 py-2 text-xs text-white focus:border-[#1D9BF0] focus:outline-none focus:ring-1 focus:ring-[#1D9BF0]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-[#12141a] px-2.5 py-1.5 rounded-lg border border-white/8">
                <Calendar className="h-3.5 w-3.5 text-[#22D3EE]" aria-hidden="true" />
                <label htmlFor="period-month-select" className="whitespace-nowrap text-[11px] font-medium text-zinc-400">
                  {messages.transactions.periodLabel}
                </label>
                <select
                  id="period-month-select"
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#22D3EE] focus:outline-none cursor-pointer"
                  aria-label="Pilih filter periode per bulan"
                >
                  {periodOptions.map((period) => (
                    <option key={period.value} value={period.value} className="bg-[#050507] text-zinc-200">
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-[#12141a] px-2.5 py-1.5 rounded-lg border border-white/8">
                <label htmlFor="items-per-page-top" className="whitespace-nowrap text-[11px] font-medium text-zinc-400">
                  {messages.transactions.rowsLabel}
                </label>
                <select
                  id="items-per-page-top"
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="bg-transparent text-xs font-semibold text-[#22D3EE] focus:outline-none cursor-pointer"
                  aria-label="Pilih jumlah transaksi per halaman"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size} className="bg-[#050507] text-zinc-200">
                      {size} baris
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-[#050507] p-1 border border-white/8 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => handleTabChange('all')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {messages.transactions.tabs.all}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('topup')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'topup'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {messages.transactions.tabs.topup}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('card')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'card'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {messages.transactions.tabs.card}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('receive')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'receive'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {messages.transactions.tabs.receive}
            </button>
          </div>
        </div>

        {/* 4 Screen States: Loading, Error, Empty, Success */}
        <div className="divide-y divide-slate-800/80 border-t border-slate-800 pt-1">
          {isLoading || isPageLoading ? (
            <div className="space-y-1.5 py-2">
              {Array.from({ length: Math.min(itemsPerPage, 5) }).map((_, idx) => (
                <div
                  key={`tx-skeleton-${idx}`}
                  className="flex items-center justify-between p-3.5 sm:px-4 rounded-xl"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0 bg-slate-800/80" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40 sm:w-56 bg-slate-800/80" />
                      <Skeleton className="h-3 w-28 sm:w-36 bg-slate-800/50" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-20 ml-auto bg-slate-800/80" />
                    <Skeleton className="h-3 w-24 ml-auto bg-slate-800/50" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-xs font-semibold text-rose-300">
                Gagal memuat riwayat transaksi. Filter pencarian Anda tetap tersimpan.
              </p>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                {messages.common.tryAgain}
              </Button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              {messages.transactions.emptyFiltered}
            </div>
          ) : (
            <div className="transition-opacity duration-200 ease-in-out opacity-100">
              {paginatedTransactions.map((tx) => {
                const Icon = getIcon(tx.type);
                const isCredit = tx.type === 'topup' || tx.type === 'receive';
                const formattedUsd = `$${(Number(tx.amountUsdCents) / 100).toFixed(2)}`;
                const statusLabel = messages.transactions.status[tx.status] ?? tx.status;

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3.5 sm:px-4 hover:bg-[#12141a] rounded-xl transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                          isCredit
                            ? 'bg-sky-950 text-[#22D3EE] border border-sky-800/40'
                            : 'bg-[#12141a] text-zinc-300 border border-white/8'
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-white truncate">
                            {tx.title}
                          </p>
                          <span
                            className={cn(
                              'inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold',
                              getStatusBadgeClasses(tx.status)
                            )}
                          >
                            {statusLabel}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {tx.channel} &bull; {tx.timestampWib} &bull;{' '}
                          <span className="font-mono text-[11px]">{tx.ledgerSequence}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={cn(
                          'font-mono text-sm font-bold tabular-nums',
                          tx.status !== 'success'
                            ? 'text-zinc-400'
                            : isCredit
                              ? 'text-[#7CE8C8]'
                              : 'text-white'
                        )}
                      >
                        {isCredit ? '+' : '-'}{formattedUsd}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-mono tabular-nums mt-0.5">
                        ≈ Rp{tx.amountIdr.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Pagination Controls Footer */}
        {filteredTransactions.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/8 pt-4 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <span>
                Menampilkan <span className="font-semibold text-zinc-200">{startIndex}</span> s/d{' '}
                <span className="font-semibold text-zinc-200">{endIndex}</span> dari{' '}
                <span className="font-semibold text-zinc-200">{filteredTransactions.length}</span> transaksi
              </span>
            </div>

            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage <= 1 || isPageLoading}
                className="h-8 px-2.5 text-xs font-medium border-white/8 bg-[#12141a] text-zinc-300 hover:bg-white/6 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                <span>Sebelumnya</span>
              </Button>

              <div className="flex items-center gap-1">
                {paginationRange.map((page, idx) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2 text-zinc-500 font-mono select-none">
                        ...
                      </span>
                    );
                  }

                  const pageNum = Number(page);
                  const isCurrent = pageNum === safeCurrentPage;

                  return (
                    <button
                      key={`page-${pageNum}`}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isPageLoading}
                      className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#1D9BF0]/20 text-[#1D9BF0] border border-[#1D9BF0]/40'
                          : 'bg-[#12141a] text-zinc-400 hover:text-white border border-white/8 hover:bg-white/6'
                      }`}
                      aria-label={`Ke halaman ${pageNum}`}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage >= totalPages || isPageLoading}
                className="h-8 px-2.5 text-xs font-medium border-white/8 bg-[#12141a] text-zinc-300 hover:bg-white/6 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Halaman berikutnya"
              >
                <span>Berikutnya</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
