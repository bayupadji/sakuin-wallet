'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTopUpMutation } from '@/features/wallet';
import { useFxRateQuery } from '@/shared/application/queries/use-fx-rate';
import { calculateFeeIdr, DEFAULT_FEE_RULES } from '@/shared/domain';
import { Button } from '@/shared/presentation/ui/button';
import { messages } from '@/shared/messages';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  Plus,
  QrCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';

function makeTopUpIdempotencyKey(): string {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `topup_${crypto.randomUUID()}`
    : `topup_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function TopUpPage() {
  const [usdAmount, setUsdAmount] = useState('100');
  const [paymentMethod, setPaymentMethod] = useState<'bca' | 'mandiri' | 'qris'>('bca');
  const idempotencyKeyRef = useRef<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'payment'>('input');
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(900);

  const { data: fxData } = useFxRateQuery();
  const fxRate = fxData?.rate ?? 16250;
  const methodCategory: 'va' | 'qris' = paymentMethod === 'qris' ? 'qris' : 'va';

  const parsedUsd = Math.max(1, parseFloat(usdAmount) || 0);
  const idrSubtotal = Math.round(parsedUsd * fxRate);
  const feeIdr = calculateFeeIdr(idrSubtotal, DEFAULT_FEE_RULES[methodCategory]);
  const totalIdr = idrSubtotal + feeIdr;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 900 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const vaNumber = paymentMethod === 'bca' ? '8210948201948201' : '8892019482019284';

  const router = useRouter();
  const topUpMutation = useTopUpMutation();

  function handleCopy() {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCreateTopUpOrder() {
    setErrorMessage(null);
    const channelName =
      paymentMethod === 'bca'
        ? 'BCA Virtual Account'
        : paymentMethod === 'mandiri'
          ? 'Mandiri Virtual Account'
          : 'QRIS Dinamis';

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = makeTopUpIdempotencyKey();
    }

    topUpMutation.mutate(
      {
        amountUsd: parsedUsd,
        method: methodCategory,
        channel: channelName,
        idempotencyKey: idempotencyKeyRef.current,
        fxRate,
      },
      {
        onSuccess: () => {
          setStep('payment');
        },
        onError: (err) => {
          setErrorMessage(
            err instanceof Error ? err.message : messages.errors.genericDescription
          );
        },
      }
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 font-sans text-slate-100">
      <div>
        <Link
          href="/wallet"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{messages.topUp.backToWallet}</span>
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-950/60 text-[#22D3EE] border border-sky-800/40">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {messages.topUp.title}
            </h1>
          </div>

          <span className="text-[11px] font-mono text-[#22D3EE] bg-sky-950/60 px-2.5 py-1 rounded-full border border-sky-800/60 tabular-nums flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>
              {messages.fx.lockedBadge} {formatCountdown(countdown)}
            </span>
          </span>
        </div>

        <p className="mt-1 text-xs text-zinc-400">
          {messages.topUp.subtitle}
        </p>
      </div>

      {step === 'input' ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl space-y-5">
            <div>
              <label htmlFor="topup-usd" className="block text-xs font-semibold text-zinc-400 mb-1.5">
                {messages.topUp.amountLabel}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-zinc-400">
                  USD $
                </span>
                <input
                  id="topup-usd"
                  type="number"
                  min="1"
                  step="0.01"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  className="w-full rounded-2xl border border-[#1D9BF0]/40 bg-sky-950/20 pl-20 pr-4 py-3 font-mono text-xl sm:text-2xl font-extrabold text-white focus:border-[#1D9BF0] focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/8 bg-[#12141a] p-4 text-xs text-zinc-400">
              <div className="flex justify-between items-center">
                <span>{messages.topUp.rateLockedLabel}</span>
                <span className="font-mono text-white font-medium">
                  1 USD = Rp{fxRate.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{messages.topUp.subtotalLabel}</span>
                <span className="font-mono text-white font-medium">
                  Rp{idrSubtotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{messages.topUp.channelFeeLabel}</span>
                <span className="font-mono text-[#22D3EE] font-semibold">
                  Rp{feeIdr.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="pt-2 border-t border-white/8 flex justify-between items-center text-sm font-bold text-white">
                <span>{messages.topUp.totalPaymentLabel}</span>
                <span className="font-mono text-[#67E8F9] tabular-nums">
                  Rp{totalIdr.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white">
              {messages.topUp.chooseMethodTitle}
            </h2>

            {errorMessage && (
              <div className="rounded-xl border border-rose-800/60 bg-rose-950/40 px-4 py-3 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('bca')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'bca'
                    ? 'border-[#1D9BF0] bg-sky-950/40 text-white shadow-md'
                    : 'border-white/8 bg-[#12141a] text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="h-5 w-5 text-[#22D3EE] mb-2" aria-hidden="true" />
                <span className="font-bold text-xs block text-white">BCA Virtual Account</span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">Otomatis 24/7</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('mandiri')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'mandiri'
                    ? 'border-[#1D9BF0] bg-sky-950/40 text-white shadow-md'
                    : 'border-white/8 bg-[#12141a] text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="h-5 w-5 text-[#22D3EE] mb-2" aria-hidden="true" />
                <span className="font-bold text-xs block text-white">Mandiri VA</span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">Livin / ATM Mandiri</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'qris'
                    ? 'border-[#1D9BF0] bg-sky-950/40 text-white shadow-md'
                    : 'border-white/8 bg-[#12141a] text-zinc-400 hover:text-white'
                }`}
              >
                <QrCode className="h-5 w-5 text-[#22D3EE] mb-2" aria-hidden="true" />
                <span className="font-bold text-xs block text-white">QRIS Dinamis</span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">Seluruh bank & e-wallet</span>
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              disabled={topUpMutation.isPending}
              isLoading={topUpMutation.isPending}
              onClick={handleCreateTopUpOrder}
              className="w-full mt-4 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold border-[#1D9BF0] gap-2"
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              <span>Top Up Rp{totalIdr.toLocaleString('id-ID')}</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl space-y-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-950/60 text-[#22D3EE] border border-sky-800/40 mx-auto">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              {messages.topUp.invoiceIssuedTitle}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {messages.topUp.invoiceIssuedSubtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#12141a] p-5 text-left space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">{messages.topUp.totalPaymentLabel}</span>
              <span className="font-mono text-base font-bold text-[#67E8F9]">
                Rp{totalIdr.toLocaleString('id-ID')}
              </span>
            </div>

            {paymentMethod !== 'qris' ? (
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">
                  Nomor {paymentMethod === 'bca' ? 'BCA Virtual Account' : 'Mandiri Virtual Account'}
                </span>
                <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#0c0e12] px-4 py-3">
                  <span className="font-mono text-base sm:text-lg font-bold text-white tracking-wider">
                    {vaNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#1D9BF0] hover:text-[#22D3EE] cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copied ? messages.common.copied : messages.common.copy}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="inline-block p-4 rounded-2xl bg-white mx-auto shadow-md">
                  <div className="h-44 w-44 border-2 border-black rounded-lg flex items-center justify-center font-mono text-slate-950 font-bold text-xs p-2 text-center">
                    [QRIS Tagihan Rp{totalIdr.toLocaleString('id-ID')}]
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 mt-3">
                  Pindai QRIS menggunakan aplikasi perbankan atau e-wallet berlisensi.
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-white/8 text-[11px] text-zinc-400 space-y-1">
              <p>&bull; {messages.topUp.settlementPendingNote}</p>
              <p>
                &bull; Nominal konversi target: <strong>${parsedUsd.toFixed(2)} USD</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              onClick={() => router.push('/wallet')}
              className="bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold border-[#1D9BF0]"
            >
              {messages.topUp.doneCheckWallet}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-2">
        <ShieldCheck className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
        <span>Buku besar append-only dalam integer sen &bull; Kurs referensi Wise tanpa markup</span>
      </div>
    </div>
  );
}
