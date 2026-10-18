'use client';

import React, { useState } from 'react';
import { Dialog } from '@/shared/presentation/ui/dialog';
import { Button } from '@/shared/presentation/ui/button';
import { ArrowRight, CheckCircle2, Clock, Copy, QrCode, ShieldCheck } from 'lucide-react';
import { useTopUpMutation } from '../../application/mutations/use-wallet-mutations';

interface QuickTransferModalProps {
  mode: 'topup' | 'receive' | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuickTransferModal({
  mode,
  isOpen,
  onClose,
  onSuccess,
}: QuickTransferModalProps) {
  const topUpMutation = useTopUpMutation();
  const [amountUsd, setAmountUsd] = useState('100');
  const [method, setMethod] = useState<'va' | 'qris'>('va');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'input' | 'confirm' | 'payment_ready'>('input');
  const [copied, setCopied] = useState(false);

  // Locked exchange rate (15-min guarantee)
  const fxRate = 16250;
  const parsedUsd = Math.max(1, parseFloat(amountUsd) || 0);
  const totalIdr = Math.round(parsedUsd * fxRate);
  const feeIdr = method === 'va' ? 4500 : Math.round(totalIdr * 0.007); // VA flat or QRIS 0.7%
  const grandTotalIdr = totalIdr + feeIdr;

  function handleProceed() {
    setStep('confirm');
  }

  function handleConfirm() {
    setIsSubmitting(true);
    topUpMutation.mutate(
      {
        amountUsd: parsedUsd,
        channel: method === 'va' ? 'BCA Virtual Account (*8924)' : 'QRIS Dynamic Merchant',
      },
      {
        onSettled: () => {
          setIsSubmitting(false);
          setStep('payment_ready');
          onSuccess?.();
        },
      }
    );
  }

  function handleReset() {
    setStep('input');
    onClose();
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleReset}
      title={
        mode === 'topup'
          ? step === 'payment_ready'
            ? 'Tagihan Pembayaran Diterbitkan'
            : 'Isi Saldo USD (Top Up)'
          : 'Terima Pembayaran Rupiah'
      }
      description={
        mode === 'topup'
          ? 'Setor Rupiah via Virtual Account BCA/Mandiri atau QRIS dengan jaminan kurs terkunci 15 menit.'
          : 'Buat tagihan instan atau kode QRIS. Dikonversi langsung ke saldo USD Anda saat pembayaran diterima.'
      }
      className="bg-[#111726] border-slate-800 text-slate-100"
    >
      <div className="space-y-5 pt-2 text-xs font-sans text-slate-100">
        {step === 'input' && (
          <>
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-300">
                Nominal {mode === 'topup' ? 'Isi Saldo' : 'Penerimaan'} (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  step="1"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#0c121e] pl-8 pr-16 py-2.5 font-mono text-base font-bold text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 tabular-nums"
                  placeholder="100"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-semibold text-slate-400">
                  USD
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Batas transaksi: Min $5,00 &bull; Maks $1.000,00 per transfer
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-300">
                Kanal Pembayaran Rupiah
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('va')}
                  className={`rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                    method === 'va'
                      ? 'border-teal-500 bg-teal-950/40 text-white'
                      : 'border-slate-800 bg-[#0c121e] text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-white block">
                    Virtual Account
                  </span>
                  <span className="text-[11px] text-slate-400">
                    BCA, Mandiri, BRI &bull; Biaya flat
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('qris')}
                  className={`rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                    method === 'qris'
                      ? 'border-teal-500 bg-teal-950/40 text-white'
                      : 'border-slate-800 bg-[#0c121e] text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-white block">
                    QRIS Dinamis
                  </span>
                  <span className="text-[11px] text-slate-400">
                    GoPay, OVO, ShopeePay &bull; 0,7%
                  </span>
                </button>
              </div>
            </div>

            {/* Guaranteed Conversion Quote Box */}
            <div className="rounded-2xl border border-slate-800 bg-[#0c121e] p-4 space-y-2.5 text-slate-400">
              <div className="flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
                  <span>Garansi Kurs Valas</span>
                </div>
                <span className="font-mono font-semibold text-white">
                  1 USD = Rp {fxRate.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal Konversi</span>
                <span className="font-mono font-medium text-slate-200">
                  Rp {totalIdr.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Biaya Transaksi Kanal</span>
                <span className="font-mono font-medium text-slate-200">
                  Rp {feeIdr.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="border-t border-slate-800 pt-2 flex items-center justify-between font-bold text-white">
                <span>Total Pembayaran (IDR)</span>
                <span className="font-mono text-sm text-teal-300 tabular-nums">
                  Rp {grandTotalIdr.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={handleReset} className="text-slate-400 hover:text-white">
                Batal
              </Button>
              <Button
                variant="primary"
                onClick={handleProceed}
                className="gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold border-teal-500"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-teal-800/80 bg-teal-950/40 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-bold text-teal-200">
                    Tinjau dan Kunci Transaksi
                  </p>
                  <p className="text-[11px] text-teal-300/80 leading-relaxed">
                    Kurs tukar Anda dikunci selama tepat 15 menit. Saldo buku besar USD akan ditambahkan seketika setelah pembayaran terverifikasi.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-y border-slate-800 py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Saldo USD Masuk</span>
                <span className="font-mono font-bold text-white">
                  ${parsedUsd.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Metode Pembayaran</span>
                <span className="font-semibold text-white">
                  {method === 'va' ? 'Virtual Account (BCA/Mandiri)' : 'QRIS Dinamis'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Nominal Tagihan</span>
                <span className="font-mono font-bold text-teal-300">
                  Rp {grandTotalIdr.toLocaleString('id-ID')} IDR
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setStep('input')} className="text-slate-400 hover:text-white">
                Kembali
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                isLoading={isSubmitting}
                className="gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold border-teal-500"
              >
                <span>Konfirmasi & Terbitkan Tagihan</span>
              </Button>
            </div>
          </div>
        )}

        {step === 'payment_ready' && (
          <div className="space-y-4 text-center py-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-950 text-teal-400 border border-teal-800/40">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-white">
                Tagihan Pembayaran Aktif
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Silakan transfer tepat <span className="font-mono font-bold text-teal-300">Rp {grandTotalIdr.toLocaleString('id-ID')}</span> dalam batas waktu 15 menit.
              </p>
            </div>

            {method === 'va' ? (
              <div className="rounded-2xl border border-slate-800 bg-[#0c121e] p-4 text-left space-y-2">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">
                  Nomor BCA Virtual Account
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-white tracking-wider">
                    8274 0812 8829 4821
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy('8274081288294821')}
                    className="text-xs gap-1 border-slate-800 bg-slate-900 text-teal-400 hover:text-teal-300"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 border border-slate-800 rounded-2xl bg-[#0c121e]">
                <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                  <QrCode className="h-24 w-24 text-teal-400" aria-hidden="true" />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Pindai QRIS dengan BCA Mobile, Livin, GoPay, OVO, atau e-wallet lainnya</p>
              </div>
            )}

            <Button
              variant="primary"
              onClick={handleReset}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold border-teal-500"
            >
              Selesai
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
