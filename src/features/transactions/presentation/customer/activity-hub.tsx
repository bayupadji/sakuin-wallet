'use client';

import React, { useState } from 'react';
import { TransactionType } from '../../domain/entities/transaction';
import { useTransactionStore } from '../../application/stores/use-transaction-store';
import { useTransactionsQuery } from '../../application/queries/use-transactions';
import { TransactionReceiptDrawer } from './transaction-receipt-drawer';
import { ExportExcelModal } from './export-excel-modal';
import { Button } from '@/shared/presentation/ui/button';
import { Skeleton } from '@/shared/presentation/ui/skeleton';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
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

const REFERENCE_DATE = new Date('2026-10-01T00:00:00Z');

export function getPast12MonthsPeriodOptions(baseDate: Date = REFERENCE_DATE): { value: string; label: string }[] {
  const options = [{ value: 'all', label: 'Semua (1 Tahun Terakhir)' }];
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

const PERIOD_OPTIONS = getPast12MonthsPeriodOptions();

function getPeriodLabel(periodValue: string): string {
  const match = PERIOD_OPTIONS.find((opt) => opt.value === periodValue);
  return match ? match.label : periodValue;
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

export function ActivityHub() {
  const {
    activeTab,
    setActiveTab,
    selectedMonth,
    setSelectedMonth,
    searchQuery,
    setSearchQuery,
    selectedTransaction: selectedTx,
    setSelectedTransaction: setSelectedTx,
  } = useTransactionStore();

  const { data: transactionsData } = useTransactionsQuery({
    type: activeTab,
    search: searchQuery,
    month: selectedMonth,
  });
  const filteredTransactions = transactionsData || [];

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

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
    }, 220);
    return () => clearTimeout(timer);
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setIsPageLoading(true);
    setItemsPerPage(newSize);
    setCurrentPage(1);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 220);
    return () => clearTimeout(timer);
  };

  const startIndex = filteredTransactions.length === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(safeCurrentPage * itemsPerPage, filteredTransactions.length);
  const paginatedTransactions = filteredTransactions.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );
  const paginationRange = getPaginationRange(safeCurrentPage, totalPages);

  // Metriks ringkasan berdasarkan transaksi yang sedang terfilter
  const totalInflowCents = filteredTransactions
    .filter((tx) => tx.type === 'topup' || tx.type === 'receive')
    .reduce((acc, tx) => acc + Number(tx.amountUsdCents), 0);

  const totalOutflowCents = filteredTransactions
    .filter((tx) => tx.type === 'card')
    .reduce((acc, tx) => acc + Number(tx.amountUsdCents), 0);

  const netGrowthCents = totalInflowCents - totalOutflowCents;
  const currentPeriodLabel = selectedMonth === 'all' ? '1 Tahun Terakhir' : getPeriodLabel(selectedMonth);

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
          onClick={() => setIsExportModalOpen(true)}
          className="gap-1.5 text-xs font-medium self-start sm:self-auto border-slate-800 bg-[#111726] text-slate-200 hover:bg-slate-800 cursor-pointer"
          aria-label="Buka dialog ekspor mutasi ke Excel"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
          <span>Ekspor Mutasi (Excel)</span>
        </Button>
      </div>

      {/* 2. Monthly Summary Metrics (Dinamis sesuai Periode) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Total Arus Masuk ({currentPeriodLabel})</span>
          <p className="font-mono text-2xl font-bold tracking-tight text-teal-400 tabular-nums">
            +${(totalInflowCents / 100).toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Deposit VA & QRIS</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Total Pengeluaran ({currentPeriodLabel})</span>
          <p className="font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
            -${(totalOutflowCents / 100).toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Pembelian Kartu Virtual</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Pertumbuhan Saldo Bersih</span>
          <div className="flex items-center gap-1.5">
            <p
              className={`font-mono text-2xl font-bold tracking-tight tabular-nums ${
                netGrowthCents >= 0 ? 'text-teal-400' : 'text-rose-400'
              }`}
            >
              {netGrowthCents >= 0 ? '+' : '-'}${Math.abs(netGrowthCents / 100).toFixed(2)}
            </p>
            <TrendingUp className="h-4 w-4 text-teal-400" aria-hidden="true" />
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Delta saldo ({currentPeriodLabel})</span>
        </div>
      </div>

      {/* 3. Ledger Transaction Hub Card (Search + Filter + Periode + Rows) */}
      <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 sm:p-7 shadow-xl space-y-4">
        {/* Controls Container */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Input Pencarian */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Cari transaksi, merchant, ID ref..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-[#0c121e] pl-9 pr-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Filter Periode Bulan & Dropdown Jumlah Baris */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Periode per Bulan */}
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <Calendar className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
                <label htmlFor="period-month-select" className="whitespace-nowrap text-[11px] font-medium text-slate-400">
                  Periode:
                </label>
                <select
                  id="period-month-select"
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-teal-400 focus:outline-none cursor-pointer"
                  aria-label="Pilih filter periode per bulan"
                >
                  {PERIOD_OPTIONS.map((period) => (
                    <option key={period.value} value={period.value} className="bg-slate-900 text-slate-200">
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown Jumlah Baris (Kelipatan 10 s.d 100) */}
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <label htmlFor="items-per-page-top" className="whitespace-nowrap text-[11px] font-medium text-slate-400">
                  Tampilkan:
                </label>
                <select
                  id="items-per-page-top"
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="bg-transparent text-xs font-semibold text-teal-400 focus:outline-none cursor-pointer"
                  aria-label="Pilih jumlah transaksi per halaman"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size} className="bg-slate-900 text-slate-200">
                      {size} baris
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Kategori Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => handleTabChange('all')}
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
              onClick={() => handleTabChange('topup')}
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
              onClick={() => handleTabChange('card')}
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
              onClick={() => handleTabChange('receive')}
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

        {/* Ledger Transaction List with Lazy Loading */}
        <div className="divide-y divide-slate-800/80 border-t border-slate-800 pt-1">
          {isPageLoading ? (
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
          ) : filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Tidak ada transaksi yang sesuai dengan pencarian Anda.
            </div>
          ) : (
            <div className="transition-opacity duration-200 ease-in-out opacity-100">
              {paginatedTransactions.map((tx) => {
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
              })}
            </div>
          )}
        </div>

        {/* 4. Pagination Controls Footer */}
        {filteredTransactions.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
            {/* Status Rentang Data */}
            <div className="flex items-center gap-3">
              <span>
                Menampilkan <span className="font-semibold text-slate-200">{startIndex}</span> -{' '}
                <span className="font-semibold text-slate-200">{endIndex}</span> dari{' '}
                <span className="font-semibold text-slate-200">{filteredTransactions.length}</span> transaksi
              </span>
            </div>

            {/* Tombol Navigasi Halaman */}
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isPageLoading}
                className="h-8 px-2.5 text-xs font-medium border-slate-800 bg-[#0c121e] text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                <span>Sebelumnya</span>
              </Button>

              <div className="flex items-center gap-1">
                {paginationRange.map((page, idx) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2 text-slate-500 font-mono select-none">
                        ...
                      </span>
                    );
                  }

                  const pageNum = Number(page);
                  const isCurrent = pageNum === currentPage;

                  return (
                    <button
                      key={`page-${pageNum}`}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isPageLoading}
                      className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40'
                          : 'bg-[#0c121e] text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800/80'
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isPageLoading}
                className="h-8 px-2.5 text-xs font-medium border-slate-800 bg-[#0c121e] text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Halaman berikutnya"
              >
                <span>Berikutnya</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Settlement Receipt Drawer */}
      <TransactionReceiptDrawer
        transaction={selectedTx}
        isOpen={selectedTx !== null}
        onClose={() => setSelectedTx(null)}
      />

      {/* 6. Export to Excel Modal */}
      <ExportExcelModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        defaultMonth={selectedMonth}
      />
    </div>
  );
}
