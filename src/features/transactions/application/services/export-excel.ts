import { TransactionItem } from '../../domain/entities/transaction';
import { Money } from '@/shared/domain/money';

/**
 * Menghasilkan markup HTML spreadsheet yang kompatibel dengan Microsoft Excel dan spreadsheet modern.
 */
export function generateTransactionsExcelHtml(
  transactions: TransactionItem[],
  periodLabel: string
): string {
  const generatedAt = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const totalInflowCents = transactions
    .filter((tx) => tx.type === 'topup' || tx.type === 'receive')
    .reduce((acc, tx) => acc + tx.amountUsdCents, 0n);

  const totalOutflowCents = transactions
    .filter((tx) => tx.type === 'card')
    .reduce((acc, tx) => acc + tx.amountUsdCents, 0n);

  const netGrowthCents = totalInflowCents - totalOutflowCents;

  const rows = transactions.map((tx, idx) => {
    const isCredit = tx.type === 'topup' || tx.type === 'receive';
    const sign = isCredit ? '+' : '-';
    const usdVal = `${sign}${Money.fromCents(tx.amountUsdCents, 'USD').format()}`;
    const idrVal = `Rp ${tx.amountIdr.toLocaleString('id-ID')}`;
    const rateVal = `Rp ${tx.fxRate.toLocaleString('id-ID')}`;
    const feeVal = `Rp ${tx.feeIdr.toLocaleString('id-ID')}`;

    const typeLabel =
      tx.type === 'topup'
        ? 'Isi Saldo (Top Up)'
        : tx.type === 'receive'
        ? 'Terima Pembayaran'
        : 'Pembelian Kartu (Debit)';

    return `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td>${escapeXml(tx.timestampWib)}</td>
        <td>${escapeXml(tx.id)}</td>
        <td>${escapeXml(tx.ledgerSequence)}</td>
        <td>${escapeXml(tx.title)}</td>
        <td>${escapeXml(tx.merchant)}</td>
        <td>${escapeXml(tx.category)}</td>
        <td>${escapeXml(typeLabel)}</td>
        <td>${escapeXml(tx.channel)}</td>
        <td>${escapeXml(tx.referenceId)}</td>
        <td style="text-align: right; font-weight: bold; color: ${isCredit ? '#0d9488' : '#e11d48'};">${usdVal}</td>
        <td style="text-align: right;">${idrVal}</td>
        <td style="text-align: right;">${rateVal}</td>
        <td style="text-align: right;">${feeVal}</td>
        <td style="text-align: center; text-transform: uppercase;">${escapeXml(tx.status)}</td>
      </tr>
    `;
  }).join('');

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; }
        table { border-collapse: collapse; width: 100%; margin-top: 12px; }
        th { background-color: #0f766e; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px 10px; font-size: 10pt; }
        td { border: 1px solid #e2e8f0; padding: 6px 10px; font-size: 10pt; }
        .header-title { font-size: 16pt; font-weight: bold; color: #0f172a; padding: 4px 0; }
        .header-subtitle { font-size: 10pt; color: #64748b; padding: 2px 0; }
        .summary-box { background-color: #f8fafc; border: 1px solid #cbd5e1; font-weight: bold; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="15" class="header-title">SAKUIN WALLET - BUKU BESAR MUTASI REKENING RESMI</td>
        </tr>
        <tr>
          <td colspan="15" class="header-subtitle">Periode Laporan: <b>${escapeXml(periodLabel)}</b> (Wajib per 1 bulan)</td>
        </tr>
        <tr>
          <td colspan="15" class="header-subtitle">Waktu Unduh Dokumen: ${escapeXml(generatedAt)} WIB</td>
        </tr>
        <tr>
          <td colspan="15" class="header-subtitle">Total Transaksi: <b>${transactions.length} transaksi</b></td>
        </tr>
        <tr><td colspan="15"></td></tr>
        <thead>
          <tr>
            <th>No</th>
            <th>Waktu (WIB)</th>
            <th>ID Transaksi</th>
            <th>Sequence Ledger</th>
            <th>Judul Transaksi</th>
            <th>Merchant / Pihak Terkait</th>
            <th>Kategori</th>
            <th>Tipe Transaksi</th>
            <th>Saluran / Metode</th>
            <th>ID Referensi</th>
            <th>Nominal (USD)</th>
            <th>Nominal (IDR)</th>
            <th>Kurs FX</th>
            <th>Biaya (IDR)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
        <tfoot>
          <tr><td colspan="15"></td></tr>
          <tr class="summary-box">
            <td colspan="10" style="text-align: right;">TOTAL ARUS MASUK (TOP UP & TERIMA DANA):</td>
            <td style="text-align: right; color: #0d9488;">+${Money.fromCents(totalInflowCents, 'USD').format()}</td>
            <td colspan="4"></td>
          </tr>
          <tr class="summary-box">
            <td colspan="10" style="text-align: right;">TOTAL PENGELUARAN (KARTU DEBIT):</td>
            <td style="text-align: right; color: #e11d48;">-${Money.fromCents(totalOutflowCents, 'USD').format()}</td>
            <td colspan="4"></td>
          </tr>
          <tr class="summary-box">
            <td colspan="10" style="text-align: right;">DELTA SALDO BERSIH PERIODE:</td>
            <td style="text-align: right; color: ${netGrowthCents >= 0n ? '#0d9488' : '#e11d48'};">
              ${netGrowthCents >= 0n ? '+' : '-'}${Money.fromCents(netGrowthCents >= 0n ? netGrowthCents : -netGrowthCents, 'USD').format()}
            </td>
            <td colspan="4"></td>
          </tr>
        </tfoot>
      </table>
    </body>
    </html>
  `.trim();
}

/**
 * Memicu pengunduhan file Excel langsung di browser.
 */
export function downloadTransactionsExcel(
  transactions: TransactionItem[],
  periodLabel: string,
  filename?: string
): void {
  const htmlContent = generateTransactionsExcelHtml(transactions, periodLabel);
  const blob = new Blob([htmlContent], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });

  const defaultFilename = `Mutasi_Sakuin_${periodLabel.replace(/\s+/g, '_')}.xls`;
  const exportFilename = filename || defaultFilename;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', exportFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
