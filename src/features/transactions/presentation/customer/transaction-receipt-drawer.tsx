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
      title="Bukti Penyelesaian Transaksi"
      description="Catatan buku besar kriptografis yang diverifikasi oleh aturan akuntansi double-entry."
      className="bg-[#050507] border-white/8 text-zinc-100"
    >
      <div className="space-y-6 pt-2 font-sans text-xs">
        {/* Hero Amount Display */}
        <div className="rounded-2xl border border-white/8 bg-[#12141a] p-5 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border mb-1 bg-[#050507] border-white/8">
            {transaction.status === 'success' ? (
              <span className="flex items-center gap-1 text-[#7CE8C8]">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Tercatat di Buku Besar</span>
              </span>
            ) : transaction.status === 'pending' ? (
              <span className="flex items-center gap-1 text-amber-400">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Menunggu Webhook Gateway</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400">
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Gagal</span>
              </span>
            )}
          </div>

          <p
            className={`font-mono text-3xl font-extrabold tracking-tight tabular-nums ${
              isCredit
                ? 'text-[#7CE8C8]'
                : 'text-white'
            }`}
          >
            {isCredit ? '+' : '-'}{money.format()}
          </p>

          <p className="font-mono text-xs text-zinc-400">
            ≈ Rp {transaction.amountIdr.toLocaleString('id-ID')} IDR
          </p>
        </div>

        {/* Ledger Proof Specifications */}
        <div className="space-y-2.5 divide-y divide-white/6 border-y border-white/8 py-3">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Judul Transaksi</span>
            <span className="font-semibold text-white">
              {transaction.title}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-zinc-400">Kanal Pembayaran</span>
            <span className="font-medium text-zinc-200">
              {transaction.channel}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-zinc-400">Kurs Konversi Terkunci</span>
            <span className="font-mono font-medium text-zinc-200">
              1 USD = Rp {transaction.fxRate.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-zinc-400">Biaya Gateway / VA</span>
            <span className="font-mono font-medium text-zinc-200">
              Rp {transaction.feeIdr.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-zinc-400">Waktu Lokal (Jakarta)</span>
            <span className="font-mono text-zinc-200">
              {transaction.timestampWib}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-zinc-400">Waktu Server (UTC)</span>
            <span className="font-mono text-zinc-400">
              {transaction.timestampUtc}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-zinc-400">ID Urutan Buku Besar</span>
            <span className="font-mono font-semibold text-[#67E8F9]">
              {transaction.ledgerSequence}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5">
            <span className="text-zinc-400">Hash Referensi</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-300">
              <span>{transaction.referenceId.slice(0, 16)}...</span>
              <button
                type="button"
                onClick={handleCopyReference}
                className="text-[#1D9BF0] hover:text-[#22D3EE] p-0.5 cursor-pointer"
                aria-label="Salin hash referensi"
              >
                {copiedKey ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Security & Idempotency Guarantee */}
        <div className="flex items-start gap-2.5 rounded-xl bg-sky-950/30 p-3.5 text-xs border border-sky-900/60">
          <ShieldCheck className="h-4 w-4 text-[#22D3EE] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[11px] text-sky-200 leading-relaxed">
            Catatan append-only dijamin oleh checksum kriptografis. Perubahan saldo dihasilkan langsung dari baris buku besar yang tidak dapat dimanipulasi.
          </p>
        </div>

        {/* Drawer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
            Tutup
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyReference}
            className="gap-1.5 border-white/8 bg-[#12141a] text-zinc-200 hover:bg-white/6"
          >
            {copiedKey ? <Check className="h-3.5 w-3.5 text-[#22D3EE]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey ? 'Referensi Disalin' : 'Salin Referensi'}</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
