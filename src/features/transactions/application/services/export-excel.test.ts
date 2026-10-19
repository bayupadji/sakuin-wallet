import { describe, it, expect } from 'vitest';
import { generateTransactionsExcelHtml } from './export-excel';
import { getSingleMonthExportOptions } from '../../presentation/customer/export-excel-modal';
import { TransactionItem } from '../../domain/entities/transaction';

const mockTransactions: TransactionItem[] = [
  {
    id: 'tx-test-01',
    title: 'Top Up Virtual Account',
    merchant: 'PT Bank Central Asia Tbk',
    type: 'topup',
    category: 'Deposit Saldo',
    status: 'success',
    amountUsdCents: 50000n, // $500.00
    amountIdr: 8125000,
    fxRate: 16250,
    feeIdr: 0,
    channel: 'BCA VA',
    referenceId: 'REF-BCA-001',
    idempotencyKey: 'idemp-01',
    ledgerSequence: 'LDG-001',
    timestampUtc: '2026-10-17 07:20:00 UTC',
    timestampWib: '17 Okt 2026, 14:20 WIB',
  },
  {
    id: 'tx-test-02',
    title: 'Pembelian Layanan AWS',
    merchant: 'Amazon Web Services',
    type: 'card',
    category: 'Cloud & Hosting',
    status: 'success',
    amountUsdCents: 5000n, // $50.00
    amountIdr: 812500,
    fxRate: 16250,
    feeIdr: 0,
    channel: 'VISA Platinum Virtual',
    referenceId: 'REF-AWS-002',
    idempotencyKey: 'idemp-02',
    ledgerSequence: 'LDG-002',
    timestampUtc: '2026-10-16 02:15:00 UTC',
    timestampWib: '16 Okt 2026, 09:15 WIB',
  },
];

describe('Export Excel Service & Options', () => {
  it('generates valid Excel spreadsheet HTML markup with headers and totals', () => {
    const html = generateTransactionsExcelHtml(mockTransactions, 'Oktober 2026');

    // Memverifikasi dokumen Excel header
    expect(html).toContain('urn:schemas-microsoft-com:office:excel');
    expect(html).toContain('SAKUIN WALLET - BUKU BESAR MUTASI REKENING RESMI');
    expect(html).toContain('Periode Laporan: <b>Oktober 2026</b>');

    // Memverifikasi baris transaksi
    expect(html).toContain('Top Up Virtual Account');
    expect(html).toContain('+$500.00');
    expect(html).toContain('Pembelian Layanan AWS');
    expect(html).toContain('-$50.00');

    // Memverifikasi rekapitulasi ringkasan
    expect(html).toContain('TOTAL ARUS MASUK (TOP UP & TERIMA DANA):');
    expect(html).toContain('+$500.00');
    expect(html).toContain('TOTAL PENGELUARAN (KARTU DEBIT):');
    expect(html).toContain('-$50.00');
    expect(html).toContain('DELTA SALDO BERSIH PERIODE:');
    expect(html).toContain('+$450.00');
  });

  it('restricts export options to single-month only, without "all" period option', () => {
    const fixedBaseDate = new Date(2026, 9, 19); // 19 Oktober 2026
    const options = getSingleMonthExportOptions(fixedBaseDate);

    // Persis 12 bulan ke belakang
    expect(options.length).toBe(12);

    // Tidak ada opsi 'all'
    expect(options.some((opt) => opt.value === 'all')).toBe(false);

    // Bulan pertama adalah Oktober 2026
    expect(options[0].value).toBe('2026-10');
    expect(options[0].label).toBe('Oktober 2026');

    // Bulan ke-12 adalah November 2025 (maks 1 tahun ke belakang)
    expect(options[11].value).toBe('2025-11');
    expect(options[11].label).toBe('November 2025');
  });
});
