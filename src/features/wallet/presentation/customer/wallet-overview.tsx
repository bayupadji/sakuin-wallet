'use client';

import React from 'react';
import Link from 'next/link';
import { useWalletQuery } from '../../application/queries/use-wallet';
import { useWalletStore } from '../../application/stores/use-wallet-store';
import { useKycStatus, KycStatusBadge, canTransact } from '@/features/kyc';
import {
  TransactionReceiptDrawer,
  TransactionItem,
  useTransactionStore,
  useTransactionsQuery,
} from '@/features/transactions';
import { Button } from '@/shared/presentation/ui/button';
import { Skeleton } from '@/shared/presentation/ui/skeleton';
import { FxRateWidget } from '@/shared/presentation/ui/fx-rate-widget';
import { useFxRateQuery } from '@/shared/application/queries/use-fx-rate';
import { Money } from '@/shared/domain/money';
import { SpendingAnalyticsCard } from './spending-analytics-card';
import { SavingsVaultsCard } from './savings-vaults-card';
import { QuickTransferModal } from './quick-transfer-modal';
import { PromoBannerCarousel } from './promo-banner-carousel';
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
  TrendingUp,
} from 'lucide-react';

export function WalletOverview() {
  const { data: wallet, isLoading: isWalletLoading, isError, refetch } = useWalletQuery();
  const { data: kycSubmission, isLoading: isKycLoading } = useKycStatus();
  const { isBalanceHidden, toggleBalanceHidden, modalMode, setModalMode } = useWalletStore();
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
  // Halaman Ringkasan hanya menampilkan 5 transaksi terbaru
  const recentTransactions = filteredTransactions.slice(0, 5);

  const kycStatus = kycSubmission?.status || 'not_verified';
  const isApproved = canTransact(kycStatus);

  const { data: fxData } = useFxRateQuery();
  const effectiveFxRate = fxData?.rate ?? 16250;

  // Initial demo / realistic balance: $1,250.00 (125,000 cents) if newly created
  const balanceCents = wallet ? wallet.balance.amount : 125000n;
  const currentMoney = Money.fromCents(balanceCents, 'USD');
  const balanceIdr = Math.round((Number(balanceCents) / 100) * effectiveFxRate);

  function getTransactionIcon(type: TransactionItem['type']) {
    switch (type) {
      case 'topup':
        return Plus;
      case 'card':
        return ShoppingBag;
      case 'receive':
        return QrCode;
    }
  }

  if (isWalletLoading || isKycLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 bg-slate-800" />
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
      <div className="rounded-2xl border border-rose-900 bg-rose-950/30 p-8 text-center">
        <p className="text-sm font-semibold text-rose-300">
          Gagal memuat data dompet digital Anda.
        </p>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans antialiased text-slate-100">
      {/* 1. KYC Notice Alert Banner (when unapproved) */}
      {!isApproved && (
        <div className="rounded-2xl border border-amber-900/60 bg-amber-950/30 p-5 backdrop-blur-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-900 text-amber-200 shrink-0 mt-0.5">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-200">
                  {kycStatus === 'in_review'
                    ? 'Verifikasi Identitas Sedang Diproses'
                    : 'Verifikasi KTP Anda untuk membuka deposit dan kartu virtual'}
                </h2>
                <p className="text-xs text-amber-300/80 mt-1 max-w-xl leading-relaxed">
                  {kycStatus === 'in_review'
                    ? 'Foto KTP Anda sedang diverifikasi oleh tim kepatuhan. Semua fitur dompet akan terbuka otomatis setelah disetujui.'
                    : 'Sesuai regulasi moneter Bank Indonesia, unggah foto KTP resmi untuk mengaktifkan isi saldo Rupiah dan belanja global.'}
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
                  <span>Verifikasi KTP</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 2. Garansi Kurs Valas (Full-Width di Atas Saldo Utama) */}
      <FxRateWidget rateIdr={effectiveFxRate} guaranteedMinutes={15} />

      {/* 3. Hero Saldo Utama (Full-Width Header) */}
      <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            {/* Account identifier */}
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400">
              <span>Saldo Utama USD</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="font-mono text-slate-300">
                ACC-8924-ID
              </span>
              <button
                type="button"
                onClick={toggleBalanceHidden}
                className="ml-1 rounded p-1 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
                aria-label={isBalanceHidden ? 'Tampilkan saldo' : 'Sembunyikan saldo'}
              >
                {isBalanceHidden ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* High-contrast monetary display */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white tabular-nums">
                {isBalanceHidden ? '••••••' : currentMoney.format()}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                USD
              </span>
            </div>

            {/* Approximate IDR value */}
            <p className="mt-1 font-mono text-xs text-slate-400">
              {isBalanceHidden
                ? '••••••••••••'
                : `≈ Rp ${balanceIdr.toLocaleString('id-ID')} IDR`}
              <span className="ml-2 inline-flex items-center rounded-sm bg-teal-950 px-1.5 py-0.5 text-[10px] font-medium text-teal-300 border border-teal-800/40">
                Kurs {effectiveFxRate.toLocaleString('id-ID')}
              </span>
            </p>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setModalMode('topup')}
              className="gap-2 shadow-md font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 border-teal-500"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Isi Saldo USD</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => setModalMode('receive')}
              className="gap-2 font-medium border-slate-800 bg-[#0c121e] text-slate-200 hover:bg-slate-800"
            >
              <QrCode className="h-4 w-4 text-teal-400" aria-hidden="true" />
              <span>Terima IDR</span>
            </Button>

            <Link href="/card">
              <Button
                variant="outline"
                size="md"
                className="gap-2 font-medium border-slate-800 bg-[#0c121e] text-slate-200 hover:bg-slate-800"
              >
                <CreditCard className="h-4 w-4 text-teal-400" aria-hidden="true" />
                <span>Kelola Kartu</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Financial Stat Sub-Cards */}
        <div className="mt-7 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Dana Tersedia</span>
            <span className="font-mono font-bold text-white mt-0.5 block tabular-nums text-sm">
              {isBalanceHidden ? '••••' : '$1,250.00'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block">Pengeluaran Bulan Ini</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono font-bold text-white block tabular-nums text-sm">
                {isBalanceHidden ? '••••' : '$105.50'}
              </span>
              <span className="text-[11px] text-teal-400 font-mono">(-14%)</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block">Total Arus Masuk</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono font-bold text-teal-300 block tabular-nums text-sm">
                {isBalanceHidden ? '••••' : '+$620.00'}
              </span>
              <TrendingUp className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
            </div>
          </div>

          <div>
            <span className="text-slate-400 block">Verifikasi Identitas</span>
            <div className="mt-1">
              <KycStatusBadge status={kycStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Banner Promo & Fitur Unggulan (Full-Width Carousel) */}
      <PromoBannerCarousel
        onTopUpClick={() => setModalMode('topup')}
        onReceiveClick={() => setModalMode('receive')}
      />

      {/* 5. Baris Ketiga: Brankas Tabungan & Analisis Pengeluaran (Grid 6 / 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <SavingsVaultsCard />
        </div>
        <div className="lg:col-span-6">
          <SpendingAnalyticsCard />
        </div>
      </div>

      {/* 4. Baris Keempat: Riwayat Transaksi & Buku Besar (Full Width 12-cols) */}
      <div className="rounded-2xl border border-slate-800 bg-[#111726] p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-white">
              Aktivitas Transaksi Terakhir
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Buku besar append-only tercatat dalam format waktu lokal Jakarta (WIB). Klik baris untuk melihat tanda terima kriptografis.
            </p>
          </div>

          <Link
            href="/transactions"
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Semua Transaksi</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#0c121e] pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('topup')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
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
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
                activeTab === 'card'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kartu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('receive')}
              className={`rounded-md px-3 py-1 font-medium transition-colors cursor-pointer ${
                activeTab === 'receive'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Terima Dana
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y divide-slate-800/80 border-t border-slate-800 pt-1">
          {recentTransactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Tidak ada transaksi yang cocok dengan kriteria pencarian Anda.
            </div>
          ) : (
            recentTransactions.map((tx) => {
              const Icon = getTransactionIcon(tx.type);
              const isCredit = tx.type === 'topup' || tx.type === 'receive';
              const formattedUsd = `$${(Number(tx.amountUsdCents) / 100).toFixed(2)}`;
              const displayUsd = isCredit ? `+${formattedUsd}` : `-${formattedUsd}`;
              const displayIdr = `Rp ${tx.amountIdr.toLocaleString('id-ID')}`;

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
                  aria-label={`Lihat tanda terima transaksi untuk ${tx.title}`}
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
                        {tx.category} &bull; {tx.timestampWib}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-mono text-sm font-bold tabular-nums ${
                        isCredit ? 'text-teal-400' : 'text-white'
                      }`}
                    >
                      {isBalanceHidden ? '••••••' : displayUsd}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                      {isBalanceHidden ? '••••••' : displayIdr}
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

      {/* Transaction Receipt Drawer */}
      <TransactionReceiptDrawer
        transaction={selectedTx}
        isOpen={selectedTx !== null}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
