'use client';

import React, { useState, useEffect } from 'react';
import { useCardStore } from '../../application/stores/use-card-store';
import {
  useFreezeCardMutation,
  useUpdateCardControlsMutation,
} from '../../application/mutations/use-card-mutations';
import { Button } from '@/shared/presentation/ui/button';
import { Dialog } from '@/shared/presentation/ui/dialog';
import { cn } from '@/shared/utils/cn';
import {
  Bell,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  FileCheck,
  Globe,
  KeyRound,
  Mail,
  Palette,
  Power,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Snowflake,
  Unlock,
  Wifi,
} from 'lucide-react';

export interface VirtualDebitCardProps {
  cardholderName?: string;
  last4?: string;
  expiry?: string;
  issuingCountry?: string;
  isFrozen?: boolean;
  onToggleFreeze?: () => void;
  className?: string;
}

export function VirtualDebitCard({
  cardholderName = 'Bayu Prasetya Adji Sugiyarto',
  last4 = '9109',
  expiry = '05/29',
  issuingCountry = 'Singapura (MAS)',
  isFrozen: initialFrozen = false,
  onToggleFreeze,
  className,
}: VirtualDebitCardProps) {
  const [isFrozen, setIsFrozen] = useState(initialFrozen);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

  const freezeMutation = useFreezeCardMutation();
  const updateControlsMutation = useUpdateCardControlsMutation();

  const {
    onlineTransactions,
    non3dsTransactions,
    atmWithdrawals,
    setOnlineTransactions,
    setNon3dsTransactions,
    setAtmWithdrawals,
    isFreezeModalOpen: freezeDialogOpen,
    setFreezeModalOpen: setFreezeDialogOpen,
    isMoreModalOpen: moreModalOpen,
    setMoreModalOpen,
    isPinModalOpen: pinDialogOpen,
    setPinModalOpen: setPinDialogOpen,
  } = useCardStore();

  // Keamanan & Notifikasi Toggles per user request
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [largeTxNotice, setLargeTxNotice] = useState(true);

  // Feedback toast for actions inside the modal
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // 30-second security auto-hide countdown for revealed card details per AGENTS.md rule 8
  useEffect(() => {
    if (!showDetails) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowDetails(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showDetails]);

  function showActionToast(message: string) {
    setActionNotice(message);
    setTimeout(() => setActionNotice(null), 3000);
  }

  function handleCopyNumber() {
    navigator.clipboard.writeText(`411122223333${last4}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConfirmFreeze() {
    const nextFrozen = !isFrozen;
    setIsFrozen(nextFrozen);
    freezeMutation.mutate(nextFrozen);
    onToggleFreeze?.();
    setFreezeDialogOpen(false);
    showActionToast(
      nextFrozen
        ? 'Kartu virtual berhasil dibekukan untuk keamanan.'
        : 'Kartu virtual berhasil diaktifkan kembali.'
    );
  }

  function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault();
    setPinError(null);
    if (pinInput === '123456') {
      setShowDetails(true);
      setCountdown(30);
      setPinDialogOpen(false);
      setPinInput('');
    } else {
      setPinError('PIN transaksi salah. Masukkan 6-digit PIN keamanan (demo: 123456).');
    }
  }

  function handleToggleDetailsClick() {
    if (showDetails) {
      setShowDetails(false);
      setCountdown(30);
    } else {
      setPinDialogOpen(true);
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-800 bg-[#111726] p-6 sm:p-7 shadow-xl space-y-6 text-slate-100',
        className
      )}
    >
      {/* 1. Card Header per reference image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              VISA Platinum Virtual
            </h2>
            <span
              className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider',
                isFrozen
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              )}
            >
              {isFrozen ? 'Frozen' : 'Active'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            You can pay directly on e-Commerce platforms &amp; global subscriptions
          </p>
        </div>
      </div>

      {/* 2. Middle Row: Left Column (Spec Box + Action Buttons) & Right Column (Virtual Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Specification Box + 3 Action Buttons */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Specification Box */}
          <div className="rounded-xl border border-slate-800/80 bg-[#0c121e]/90 p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] mb-1">Card Number</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider tabular-nums">
                  {showDetails ? `4111 2222 3333 ${last4}` : `•••• •••• •••• ${last4}`}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Salin nomor kartu"
                  aria-label="Salin nomor kartu"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">Expiry Date</span>
              <span className="font-mono text-sm sm:text-base font-semibold text-white tabular-nums">
                {expiry}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">CVC/CVV</span>
              <span className="font-mono text-sm sm:text-base font-bold text-white tabular-nums">
                {showDetails ? '849' : '***'}
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-slate-400 block text-[11px] mb-1">Cardholder name</span>
              <span className="font-semibold text-white text-sm block truncate">
                {cardholderName}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">Issuing Country</span>
              <span className="font-semibold text-white text-sm block">
                {issuingCountry}
              </span>
            </div>
          </div>

          {/* 3 Action Buttons Row (Full width within the left column) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
            {/* 1. Card Details Pill */}
            <button
              type="button"
              onClick={handleToggleDetailsClick}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-slate-800 bg-[#0c121e] hover:bg-slate-800/80 hover:text-white px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              {showDetails ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>Hide ({countdown}s)</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>Card Details</span>
                </>
              )}
            </button>

            {/* 2. Freeze / Unfreeze Pill */}
            <button
              type="button"
              onClick={() => setFreezeDialogOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-slate-800 bg-[#0c121e] hover:bg-slate-800/80 hover:text-white px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Snowflake
                className={cn('h-3.5 w-3.5', isFrozen ? 'text-rose-400' : 'text-cyan-400')}
                aria-hidden="true"
              />
              <span>{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
            </button>

            {/* 3. More Pill (Opens Card Actions & Keamanan Modal) */}
            <button
              type="button"
              onClick={() => setMoreModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-slate-800 bg-[#0c121e] hover:bg-slate-800/80 hover:text-white px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>More</span>
            </button>
          </div>
        </div>

        {/* Right Column: Physical Simulated Card Visual */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className={cn(
              'relative flex flex-col justify-between aspect-[1.586/1] w-full max-w-[340px] sm:max-w-sm rounded-2xl p-6 text-white shadow-2xl transition-all duration-300 overflow-hidden select-none border border-white/10',
              isFrozen
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 opacity-80 grayscale-[30%]'
                : 'bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 shadow-teal-950/20'
            )}
          >
            {/* Subtle geometric card watermark */}
            <div
              className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/[0.03] pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-teal-500/[0.04] pointer-events-none"
              aria-hidden="true"
            />

            {/* Top Header: Chip, Contactless, Status */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                {/* EMV Chip Visual */}
                <div
                  className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 shadow-inner flex items-center justify-center p-1 border border-amber-400/40"
                  aria-hidden="true"
                >
                  <div className="h-full w-full border border-amber-800/20 rounded-xs grid grid-cols-2 gap-0.5 opacity-60">
                    <div className="border-b border-amber-800/20" />
                    <div className="border-b border-amber-800/20" />
                    <div />
                    <div />
                  </div>
                </div>

                {/* Contactless Wave */}
                <Wifi className="h-5 w-5 text-white/50 rotate-90" aria-hidden="true" />
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase border',
                    isFrozen
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                      : 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      isFrozen ? 'bg-rose-400' : 'bg-teal-400'
                    )}
                  />
                  <span>{isFrozen ? 'Frozen' : 'Active'}</span>
                </span>
              </div>
            </div>

            {/* Middle: Card Number */}
            <div className="my-auto py-2 relative z-10">
              <div className="font-mono text-base sm:text-lg font-bold tracking-widest text-slate-100 flex items-center justify-between tabular-nums">
                <span>{showDetails ? '4111' : '••••'}</span>
                <span>{showDetails ? '2222' : '••••'}</span>
                <span>{showDetails ? '3333' : '••••'}</span>
                <span className="text-white">{last4}</span>
              </div>
            </div>

            {/* Bottom: Cardholder & Expiry & Network */}
            <div className="flex items-end justify-between text-xs relative z-10">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                  Cardholder
                </span>
                <span className="font-semibold tracking-wider uppercase text-white mt-0.5 block truncate max-w-[120px] sm:max-w-[150px]">
                  {cardholderName}
                </span>
              </div>

              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                  Expires
                </span>
                <span className="font-mono font-medium text-slate-200 mt-0.5 block tabular-nums">
                  {showDetails ? expiry : '••/••'}
                </span>
              </div>

              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                  CVV
                </span>
                <span className="font-mono font-medium text-slate-200 mt-0.5 block tabular-nums">
                  {showDetails ? '849' : '•••'}
                </span>
              </div>

              {/* Minimalist Card Network Monogram */}
              <div className="font-mono font-extrabold italic text-sm sm:text-base tracking-tighter text-white/80">
                VISA
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionNotice && (
        <div className="rounded-xl border border-teal-500/40 bg-teal-950/60 px-4 py-2.5 text-xs text-teal-300 flex items-center gap-2 transition-all">
          <Check className="h-4 w-4 text-teal-400 shrink-0" aria-hidden="true" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Modal: Card Actions */}
      <Dialog
        isOpen={moreModalOpen}
        onClose={() => setMoreModalOpen(false)}
        title="Card Actions"
        description="Kelola kontrol kartu, pembatasan transaksi, dan preferensi keamanan."
        className="max-w-lg bg-[#111726] border-slate-800 text-slate-100 max-h-[85vh] overflow-y-auto"
      >
        <div className="space-y-6 pt-2 text-sm text-slate-200">
          {/* SECTION 1: Card control */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
              Card control
            </span>

            <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-[#0c121e]/80 overflow-hidden">
              {/* CVC unlock */}
              <div
                onClick={() => {
                  showActionToast('Akses CVC berhasil dibuka kembali. Anda memiliki 3 kesempatan baru.');
                }}
                className="flex items-center justify-between p-3.5 hover:bg-slate-800/40 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <Unlock className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">CVC unlock</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Regain access after three failed PIN or CVC attempts.
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 shrink-0 ml-2" aria-hidden="true" />
              </div>

              {/* Reset PIN */}
              <div
                onClick={() => {
                  setMoreModalOpen(false);
                  setPinDialogOpen(true);
                }}
                className="flex items-center justify-between p-3.5 hover:bg-slate-800/40 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Reset PIN</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ubah atau perbarui 6-digit PIN keamanan otorisasi transaksi.
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 shrink-0 ml-2" aria-hidden="true" />
              </div>

              {/* Card design */}
              <div
                onClick={() => {
                  showActionToast('Desain kartu saat ini: Obsidian Emerald (Sponsor Edition).');
                }}
                className="flex items-center justify-between p-3.5 hover:bg-slate-800/40 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <Palette className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Card design</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Personalisasi tampilan dan warna kartu virtual Anda.
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 shrink-0 ml-2" aria-hidden="true" />
              </div>

              {/* Lost/Stolen */}
              <div
                onClick={() => {
                  setMoreModalOpen(false);
                  setFreezeDialogOpen(true);
                }}
                className="flex items-center justify-between p-3.5 hover:bg-slate-800/40 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Lost/Stolen</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Laporkan kartu hilang atau kompromi data untuk pencegahan penipuan.
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 shrink-0 ml-2" aria-hidden="true" />
              </div>

              {/* Terminate */}
              <div
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin menonaktifkan kartu virtual ini secara permanen?')) {
                    setIsFrozen(true);
                    setMoreModalOpen(false);
                    showActionToast('Kartu virtual berhasil dinonaktifkan.');
                  }
                }}
                className="flex items-center justify-between p-3.5 hover:bg-rose-950/30 transition-colors cursor-pointer text-rose-400"
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400 shrink-0 mt-0.5 border border-rose-900/60">
                    <Power className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-rose-400">Terminate</p>
                    <p className="text-xs text-rose-300/70 mt-0.5">
                      Tutup kartu secara permanen. Tindakan ini tidak dapat dibatalkan.
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-rose-500 shrink-0 ml-2" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* SECTION 2: Transaction control */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
              Transaction control
            </span>

            <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-[#0c121e]/80 overflow-hidden">
              {/* Online Transactions */}
              <div className="flex items-center justify-between p-3.5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Online Transactions</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Use your card for online purchases. Mobile wallets like Google Pay or Apple Pay will remain unaffected.
                    </p>
                  </div>
                </div>

                {/* Orange/Amber toggle per reference screenshot */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={onlineTransactions}
                  aria-label="Online Transactions"
                  onClick={() => {
                    const next = !onlineTransactions;
                    setOnlineTransactions(next);
                    updateControlsMutation.mutate({ onlineTransactions: next });
                    showActionToast(`Transaksi online ${next ? 'diaktifkan' : 'dinonaktifkan'}.`);
                  }}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                    onlineTransactions ? 'bg-amber-500' : 'bg-slate-700'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                      onlineTransactions ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* Non-3DS online transactions */}
              <div className="flex items-center justify-between p-3.5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Non-3DS online transactions</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Allow online payments without 3D Secure (3DS). This may increase fraud risk.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={non3dsTransactions}
                  aria-label="Non-3DS online transactions"
                  onClick={() => {
                    const next = !non3dsTransactions;
                    setNon3dsTransactions(next);
                    updateControlsMutation.mutate({ non3dsTransactions: next });
                    showActionToast(`Transaksi Non-3DS ${next ? 'diizinkan' : 'dinonaktifkan'}.`);
                  }}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                    non3dsTransactions ? 'bg-amber-500' : 'bg-slate-700'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                      non3dsTransactions ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* ATM Withdrawals */}
              <div className="flex items-center justify-between p-3.5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">ATM Withdrawals</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Izinkan otorisasi penarikan tunai internasional di ATM jaringan Cirrus / Mastercard.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={atmWithdrawals}
                  aria-label="ATM Withdrawals"
                  onClick={() => {
                    const next = !atmWithdrawals;
                    setAtmWithdrawals(next);
                    updateControlsMutation.mutate({ atmWithdrawals: next });
                    showActionToast(`Tarik tunai ATM ${next ? 'diaktifkan' : 'dinonaktifkan'}.`);
                  }}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                    atmWithdrawals ? 'bg-amber-500' : 'bg-slate-700'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                      atmWithdrawals ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: Keamanan & Notifikasi (per user requirement) */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
              Keamanan & Notifikasi
            </span>

            <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-[#0c121e]/80 overflow-hidden">
              {/* Email Alerts */}
              <div className="flex items-center justify-between p-3.5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Peringatan Transaksi Email</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Kirim email instan saat terjadi transaksi pembayaran atau otorisasi kartu.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={emailAlerts}
                  aria-label="Peringatan Transaksi Email"
                  onClick={() => {
                    const next = !emailAlerts;
                    setEmailAlerts(next);
                    showActionToast(`Notifikasi email ${next ? 'diaktifkan' : 'dinonaktifkan'}.`);
                  }}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                    emailAlerts ? 'bg-amber-500' : 'bg-slate-700'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                      emailAlerts ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* Large Transaction Notice */}
              <div className="flex items-center justify-between p-3.5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <Bell className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Peringatan Transaksi Besar (&gt; $500)</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Wajibkan konfirmasi otorisasi untuk setiap transaksi di atas $500 USD.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={largeTxNotice}
                  aria-label="Peringatan Transaksi Besar"
                  onClick={() => {
                    const next = !largeTxNotice;
                    setLargeTxNotice(next);
                    showActionToast(`Peringatan transaksi besar ${next ? 'diaktifkan' : 'dinonaktifkan'}.`);
                  }}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                    largeTxNotice ? 'bg-amber-500' : 'bg-slate-700'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                      largeTxNotice ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* 2FA Status */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-teal-950 text-teal-400 shrink-0 mt-0.5 border border-teal-800/40">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Otentikasi Dua Faktor (2FA)</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Perlindungan biometrik &amp; passkey aktif di perangkat ini.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                  Aktif
                </span>
              </div>

              {/* RLS Data Encryption Status */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-teal-950 text-teal-400 shrink-0 mt-0.5 border border-teal-800/40">
                    <FileCheck className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Enkripsi KTP &amp; Otorisasi RLS</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Data identitas tersimpan privat dengan enkripsi AES-256.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                  Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Modal: Freeze / Unfreeze confirmation */}
      <Dialog
        isOpen={freezeDialogOpen}
        onClose={() => setFreezeDialogOpen(false)}
        title={isFrozen ? 'Aktifkan Kembali Kartu Virtual' : 'Bekukan Kartu Virtual Sementara'}
        description={
          isFrozen
            ? 'Kartu akan segera dapat digunakan kembali untuk pembayaran global.'
            : 'Saat dibekukan, semua otorisasi transaksi online baru akan otomatis ditolak untuk keamanan Anda.'
        }
        className="max-w-md bg-[#111726] border-slate-800 text-slate-100"
      >
        <div className="space-y-4 pt-2">
          <div className="rounded-xl border border-slate-800 bg-[#0c121e] p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Kartu:</span>
              <span className="font-mono text-slate-200">Mastercard Virtual (*{last4})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Status Sekarang:</span>
              <span className={cn('font-bold', isFrozen ? 'text-rose-400' : 'text-amber-400')}>
                {isFrozen ? 'Dibekukan (Frozen)' : 'Aktif (Active)'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFreezeDialogOpen(false)}
              className="border-slate-800 bg-[#0c121e] text-slate-200 hover:bg-slate-800"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmFreeze}
              className={cn(
                'font-bold',
                isFrozen
                  ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 border-teal-500'
                  : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-600'
              )}
            >
              {isFrozen ? 'Buka Bekukan' : 'Bekukan Kartu'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Modal: PIN verification */}
      <Dialog
        isOpen={pinDialogOpen}
        onClose={() => {
          setPinDialogOpen(false);
          setPinError(null);
          setPinInput('');
        }}
        title="Verifikasi PIN Keamanan"
        description="Masukkan 6-digit PIN keamanan transaksi Anda untuk membuka nomor kartu dan kode CVV."
        className="max-w-md bg-[#111726] border-slate-800 text-slate-100"
      >
        <form onSubmit={handleVerifyPin} className="space-y-4 pt-2">
          <div>
            <label htmlFor="card-security-pin" className="block text-xs font-semibold text-slate-300 mb-1.5">
              PIN Keamanan 6 Digit (Demo: 123456)
            </label>
            <input
              id="card-security-pin"
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              autoFocus
              className="w-full text-center font-mono text-2xl tracking-[0.5em] rounded-xl border border-slate-800 bg-[#0c121e] py-3 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {pinError && <p className="mt-1.5 text-xs text-rose-400">{pinError}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setPinDialogOpen(false);
                setPinError(null);
                setPinInput('');
              }}
              className="border-slate-800 bg-[#0c121e] text-slate-200 hover:bg-slate-800"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-amber-500"
            >
              Buka Detail Kartu
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
