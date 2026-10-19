'use client';

import React, { useState, useId } from 'react';
import { Dialog } from '@/shared/presentation/ui/dialog';
import { Button } from '@/shared/presentation/ui/button';
import { useTransactionsQuery } from '../../application/queries/use-transactions';
import { downloadTransactionsExcel } from '../../application/services/export-excel';
import {
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  Loader2,
} from 'lucide-react';

interface ExportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMonth?: string;
}

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

/**
 * Daftar 12 bulan terakhir (wajib per 1 bulan saja, tanpa opsi 'all')
 */
export function getSingleMonthExportOptions(baseDate: Date = REFERENCE_DATE): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
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

export function ExportExcelModal({
  isOpen,
  onClose,
  defaultMonth,
}: ExportExcelModalProps) {
  const monthOptions = getSingleMonthExportOptions();
  const selectId = useId();

  // Pastikan defaultMonth merupakan bulan spesifik (bukan 'all')
  const initialMonth =
    defaultMonth && defaultMonth !== 'all' && monthOptions.some((m) => m.value === defaultMonth)
      ? defaultMonth
      : monthOptions[0]?.value || '2026-10';

  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Ambil transaksi hanya untuk 1 bulan yang dipilih
  const { data: monthTransactions, isLoading } = useTransactionsQuery({
    month: selectedMonth,
  });

  const txList = monthTransactions || [];
  const selectedMonthObj = monthOptions.find((m) => m.value === selectedMonth);
  const selectedLabel = selectedMonthObj?.label || selectedMonth;

  const totalInflow = txList
    .filter((tx) => tx.type === 'topup' || tx.type === 'receive')
    .reduce((acc, tx) => acc + Number(tx.amountUsdCents), 0);

  const totalOutflow = txList
    .filter((tx) => tx.type === 'card')
    .reduce((acc, tx) => acc + Number(tx.amountUsdCents), 0);

  const handleDownload = () => {
    if (!selectedMonth || txList.length === 0) return;
    setIsExporting(true);

    try {
      downloadTransactionsExcel(txList, selectedLabel);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Gagal mengekspor berkas Excel:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Ekspor Laporan Mutasi ke Excel"
      description="Pilih 1 periode bulan transaksi untuk diunduh dalam format spreadsheet Excel resmi."
      className="max-w-md bg-[#111726] border-slate-800 text-slate-100"
    >
      <div className="space-y-4">
        {/* Aturan Wajib 1 Bulan */}
        <div className="flex items-start gap-2.5 rounded-xl border border-teal-900/60 bg-teal-950/40 p-3 text-xs text-teal-300">
          <Info className="h-4 w-4 shrink-0 text-teal-400 mt-0.5" aria-hidden="true" />
          <p>
            Sesuai regulasi buku besar, ekspor rekening wajib dipilih <b>per 1 periode bulan spesifik</b> (maksimal 1 tahun ke belakang).
          </p>
        </div>

        {/* Form Pemilihan Periode Bulan */}
        <div className="space-y-2">
          <label htmlFor={selectId} className="block text-xs font-semibold text-slate-300">
            Pilih Periode Bulan (Wajib)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400" aria-hidden="true" />
            <select
              id={selectId}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#0c121e] pl-9.5 pr-4 py-2.5 text-xs font-semibold text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ringkasan Data Bulan Terpilih */}
        <div className="rounded-xl border border-slate-800 bg-[#0c121e]/80 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Periode Terpilih</span>
            <span className="font-semibold text-slate-200">{selectedLabel}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Total Transaksi</span>
            {isLoading ? (
              <span className="text-slate-500 animate-pulse">Memuat...</span>
            ) : (
              <span className="font-mono font-semibold text-teal-400">
                {txList.length} transaksi
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Total Arus Masuk</span>
            <span className="font-mono text-teal-400 tabular-nums">
              +${(totalInflow / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Total Pengeluaran</span>
            <span className="font-mono text-slate-200 tabular-nums">
              -${(totalOutflow / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Feedback Sukses */}
        {exportSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-800/60 bg-emerald-950/40 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Berkas Excel berhasil dibuat dan mulai diunduh.</span>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isExporting}
            className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs"
          >
            Batal
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDownload}
            disabled={isExporting || isLoading || txList.length === 0}
            className="gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Menyiapkan...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Unduh Excel (.xls)</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
