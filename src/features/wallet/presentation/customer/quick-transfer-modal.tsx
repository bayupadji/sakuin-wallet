'use client';

import React, { useRef, useState } from 'react';
import { Dialog } from '@/shared/presentation/ui/dialog';
import { Button } from '@/shared/presentation/ui/button';
import { ArrowRight, CheckCircle2, Clock, Copy, QrCode, ShieldCheck } from 'lucide-react';
import { useTopUpMutation } from '../../application/mutations/use-wallet-mutations';
import { useFxRateQuery } from '@/shared/application/queries/use-fx-rate';
import { calculateFeeIdr, DEFAULT_FEE_RULES } from '@/shared/domain';
import { messages } from '@/shared/messages';

interface QuickTransferModalProps {
  mode: 'topup' | 'receive' | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function makeOrderIdempotencyKey(): string {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `topup_${crypto.randomUUID()}`
    : `topup_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function QuickTransferModal({
  mode,
  isOpen,
  onClose,
  onSuccess,
}: QuickTransferModalProps) {
  const topUpMutation = useTopUpMutation();
  const { data: fxData } = useFxRateQuery();
  const fxRate = fxData?.rate ?? 16250;

  const [amountUsd, setAmountUsd] = useState('100');
  const [method, setMethod] = useState<'va' | 'qris'>('va');
  const idempotencyKeyRef = useRef<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'confirm' | 'payment_ready'>('input');
  const [copied, setCopied] = useState(false);

  const parsedUsd = Math.max(1, parseFloat(amountUsd) || 0);
  const totalIdr = Math.round(parsedUsd * fxRate);
  const feeIdr = calculateFeeIdr(totalIdr, DEFAULT_FEE_RULES[method]);
  const grandTotalIdr = totalIdr + feeIdr;

  function handleProceed() {
    setErrorMessage(null);
    setStep('confirm');
  }

  function handleConfirm() {
    setErrorMessage(null);
    if (mode !== 'topup') {
      setStep('payment_ready');
      onSuccess?.();
      return;
    }

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = makeOrderIdempotencyKey();
    }

    topUpMutation.mutate(
      {
        amountUsd: parsedUsd,
        method,
        channel: method === 'va' ? 'BCA Virtual Account' : 'QRIS Dinamis',
        idempotencyKey: idempotencyKeyRef.current,
        fxRate,
      },
      {
        onSuccess: () => {
          setStep('payment_ready');
          onSuccess?.();
        },
        onError: (err) => {
          setErrorMessage(
            err instanceof Error ? err.message : messages.errors.genericDescription
          );
        },
      }
    );
  }

  function handleReset() {
    setStep('input');
    setErrorMessage(null);
    idempotencyKeyRef.current = null;
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
            ? messages.topUp.invoiceIssuedTitle
            : messages.topUp.title
          : 'Terima Pembayaran Rupiah'
      }
      description={
        mode === 'topup'
          ? messages.topUp.subtitle
          : 'Buat tagihan pembayaran Rupiah. Saldo USD bertambah otomatis setelah pembayaran dikonfirmasi.'
      }
      className="bg-[#050507] border-white/8 text-zinc-100"
    >
      <div className="space-y-5 pt-2 text-xs font-sans text-zinc-100">
        {step === 'input' && (
          <>
            <div className="space-y-2">
              <label htmlFor="quick-topup-amount" className="font-semibold text-zinc-300">
                Nominal {mode === 'topup' ? 'Top Up' : 'Tagihan'} (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-zinc-400 text-sm">
                  $
                </span>
                <input
                  id="quick-topup-amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className="w-full rounded-xl border border-white/8 bg-[#12141a] pl-8 pr-16 py-2.5 font-mono text-base font-bold text-white focus:border-[#1D9BF0] focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] tabular-nums"
                  placeholder="100"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-semibold text-zinc-400">
                  USD
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Tanpa batas nominal produk. Batas teknis kanal gateway tetap berlaku.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-zinc-300 block">
                {messages.topUp.chooseMethodTitle}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('va')}
                  className={`rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                    method === 'va'
                      ? 'border-[#1D9BF0] bg-sky-950/40 text-white'
                      : 'border-white/8 bg-[#12141a] text-zinc-300 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-white block">Virtual Account</span>
                  <span className="text-[11px] text-zinc-400">BCA, Mandiri, BRI, BNI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('qris')}
                  className={`rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                    method === 'qris'
                      ? 'border-[#1D9BF0] bg-sky-950/40 text-white'
                      : 'border-white/8 bg-[#12141a] text-zinc-300 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-white block">QRIS Dinamis</span>
                  <span className="text-[11px] text-zinc-400">Seluruh bank & e-wallet</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#12141a] p-4 space-y-2.5 text-zinc-400">
              <div className="flex items-center justify-between text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#22D3EE]" aria-hidden="true" />
                  <span>{messages.topUp.rateLockedLabel}</span>
                </div>
                <span className="font-mono font-semibold text-white">
                  1 USD = Rp{fxRate.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-400">
                <span>{messages.topUp.subtotalLabel}</span>
                <span className="font-mono font-medium text-zinc-200">
                  Rp{totalIdr.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between text-zinc-400">
                <span>{messages.topUp.channelFeeLabel}</span>
                <span className="font-mono font-medium text-zinc-200">
                  Rp{feeIdr.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="border-t border-white/8 pt-2 flex items-center justify-between font-bold text-white">
                <span>{messages.topUp.totalPaymentLabel}</span>
                <span className="font-mono text-sm text-[#67E8F9] tabular-nums">
                  Rp{grandTotalIdr.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={handleReset} className="text-zinc-400 hover:text-white">
                {messages.common.cancel}
              </Button>
              <Button
                variant="primary"
                onClick={handleProceed}
                className="gap-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold border-[#1D9BF0]"
              >
                <span>{messages.common.actions.continue}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-sky-800/80 bg-sky-950/40 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[#22D3EE] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-bold text-sky-200">Tinjau Rincian Transaksi</p>
                  <p className="text-[11px] text-sky-300/80 leading-relaxed">
                    {messages.topUp.settlementPendingNote}
                  </p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-rose-800/60 bg-rose-950/40 px-3.5 py-2.5 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2 border-y border-white/8 py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Nominal USD</span>
                <span className="font-mono font-bold text-white">
                  ${parsedUsd.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Kurs Referensi Wise</span>
                <span className="font-mono text-white">Rp{fxRate.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">{messages.topUp.channelFeeLabel}</span>
                <span className="font-mono text-white">Rp{feeIdr.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">{messages.topUp.totalPaymentLabel}</span>
                <span className="font-mono font-bold text-[#67E8F9]">
                  Rp{grandTotalIdr.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setStep('input')} className="text-zinc-400 hover:text-white">
                {messages.common.back}
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={topUpMutation.isPending}
                isLoading={topUpMutation.isPending}
                className="gap-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold border-[#1D9BF0]"
              >
                <span>Top Up Sekarang</span>
              </Button>
            </div>
          </div>
        )}

        {step === 'payment_ready' && (
          <div className="space-y-4 text-center py-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-950 text-[#22D3EE] border border-sky-800/40">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-white">
                {messages.topUp.invoiceIssuedTitle}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Silakan transfer tepat{' '}
                <span className="font-mono font-bold text-[#67E8F9]">
                  Rp{grandTotalIdr.toLocaleString('id-ID')}
                </span>{' '}
                dalam batas waktu 15 menit.
              </p>
            </div>

            {method === 'va' ? (
              <div className="rounded-2xl border border-white/8 bg-[#12141a] p-4 text-left space-y-2">
                <span className="text-[11px] text-zinc-400 block uppercase tracking-wider font-semibold">
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
                    className="text-xs gap-1 border-white/8 bg-black/60 text-[#1D9BF0] hover:text-[#22D3EE]"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copied ? messages.common.copied : messages.common.copy}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 border border-white/8 rounded-2xl bg-[#12141a]">
                <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-black/60 border border-white/8">
                  <QrCode className="h-24 w-24 text-[#22D3EE]" aria-hidden="true" />
                </div>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Pindai QRIS dengan aplikasi perbankan atau dompet digital berlisensi.
                </p>
              </div>
            )}

            <p className="text-[11px] text-zinc-400">
              {messages.topUp.settlementPendingNote}
            </p>

            <Button
              variant="primary"
              onClick={handleReset}
              className="w-full bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold border-[#1D9BF0]"
            >
              {messages.common.actions.close}
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
