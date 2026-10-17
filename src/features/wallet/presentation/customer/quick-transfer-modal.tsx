'use client';

import React, { useState } from 'react';
import { Dialog } from '@/shared/presentation/ui/dialog';
import { Button } from '@/shared/presentation/ui/button';
import { ArrowRight, CheckCircle2, Clock, Copy, QrCode, ShieldCheck } from 'lucide-react';

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
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('payment_ready');
      onSuccess?.();
    }, 900);
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
            ? 'Top Up Details Generated'
            : 'Top Up USD Balance'
          : 'Receive Rupiah Payment'
      }
      description={
        mode === 'topup'
          ? 'Deposit Rupiah via BCA/Mandiri Virtual Account or QRIS with a 15-minute guaranteed FX rate.'
          : 'Generate an instant payment link or QRIS code. Converted directly into your USD balance upon payment.'
      }
    >
      <div className="space-y-5 pt-2 text-xs">
        {step === 'input' && (
          <>
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Amount to {mode === 'topup' ? 'Deposit' : 'Receive'} (USD)
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
                  className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-16 py-2.5 font-mono text-base font-bold text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white tabular-nums"
                  placeholder="100"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-semibold text-slate-400">
                  USD
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Limits: Min $5.00 &bull; Max $1,000.00 per top up
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Payment Channel
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('va')}
                  className={`rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                    method === 'va'
                      ? 'border-teal-600 bg-teal-50/50 dark:border-teal-500 dark:bg-teal-950/30'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Virtual Account
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    BCA, Mandiri, BRI &bull; Flat fee
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('qris')}
                  className={`rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                    method === 'qris'
                      ? 'border-teal-600 bg-teal-50/50 dark:border-teal-500 dark:bg-teal-950/30'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <span className="font-bold text-slate-900 dark:text-white block">
                    QRIS Instant
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    GoPay, OVO, ShopeePay &bull; 0.7%
                  </span>
                </button>
              </div>
            </div>

            {/* Guaranteed Conversion Quote Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 space-y-2.5">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                  <span>Guaranteed FX Rate</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  1 USD = Rp {fxRate.toLocaleString('id-ID')} IDR
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal Conversion</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  Rp {totalIdr.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Gateway Handling Fee</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  Rp {feeIdr.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>Total Payable (IDR)</span>
                <span className="font-mono text-sm text-teal-700 dark:text-teal-400 tabular-nums">
                  Rp {grandTotalIdr.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={handleReset}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleProceed} className="gap-2">
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-900 dark:bg-teal-950/40">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-bold text-teal-950 dark:text-teal-200">
                    Review and lock transaction
                  </p>
                  <p className="text-[11px] text-teal-900/80 dark:text-teal-300/80">
                    Your exchange rate is locked for exactly 15 minutes. Ledger entries will append upon verified webhook.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-y border-slate-100 dark:border-slate-800 py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Credited Balance</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${parsedUsd.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Channel</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {method === 'va' ? 'Virtual Account (BCA/Mandiri)' : 'QRIS Instant'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payable Amount</span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                  Rp {grandTotalIdr.toLocaleString('id-ID')} IDR
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setStep('input')}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                isLoading={isSubmitting}
                className="gap-2"
              >
                <span>Confirm & Generate Invoice</span>
              </Button>
            </div>
          </div>
        )}

        {step === 'payment_ready' && (
          <div className="space-y-4 text-center py-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Payment Invoice Active
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Please transfer exactly <span className="font-mono font-bold text-slate-900 dark:text-white">Rp {grandTotalIdr.toLocaleString('id-ID')}</span> within 15 minutes.
              </p>
            </div>

            {method === 'va' ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 text-left space-y-2">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">
                  BCA Virtual Account Number
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white tracking-wider">
                    8274 0812 8829 4821
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy('8274081288294821')}
                    className="text-xs gap-1"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-2xl dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <QrCode className="h-24 w-24 text-slate-900 dark:text-white" aria-hidden="true" />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Scan using any Indonesian banking or e-wallet app</p>
              </div>
            )}

            <Button variant="primary" onClick={handleReset} className="w-full">
              Done
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
