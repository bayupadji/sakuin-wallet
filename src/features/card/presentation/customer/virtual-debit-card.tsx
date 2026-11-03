'use client';

import React, { useState, useEffect } from 'react';
import { useCardStore } from '../../application/stores/use-card-store';
import {
  useFreezeCardMutation,
  useRevealCardMutation,
  useUpdateCardControlsMutation,
} from '../../application/mutations/use-card-mutations';
import { Button } from '@/shared/presentation/ui/button';
import { Dialog } from '@/shared/presentation/ui/dialog';
import { messages } from '@/shared/messages';
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
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Snowflake,
  Wifi,
} from 'lucide-react';

export interface VirtualDebitCardProps {
  cardholderName?: string;
  last4?: string;
  expiry?: string;
  issuingCountry?: string;
  isFrozen?: boolean;
  onlineTransactions?: boolean;
  non3dsTransactions?: boolean;
  atmWithdrawals?: boolean;
  onToggleFreeze?: () => void;
  className?: string;
}

export function VirtualDebitCard({
  cardholderName = 'Nasabah Sakuin',
  last4 = '4821',
  expiry = '08/29',
  issuingCountry = 'Singapura (MAS)',
  isFrozen = false,
  onlineTransactions = true,
  non3dsTransactions = true,
  atmWithdrawals = false,
  onToggleFreeze,
  className,
}: VirtualDebitCardProps) {
  const [revealedSecrets, setRevealedSecrets] = useState<{
    cardNumberFormatted: string;
    cvv: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [reauthError, setReauthError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

  const freezeMutation = useFreezeCardMutation();
  const updateControlsMutation = useUpdateCardControlsMutation();
  const revealMutation = useRevealCardMutation();

  const {
    isFreezeModalOpen: freezeDialogOpen,
    setFreezeModalOpen: setFreezeDialogOpen,
    isMoreModalOpen: moreModalOpen,
    setMoreModalOpen,
    isPinModalOpen: reauthDialogOpen,
    setPinModalOpen: setReauthDialogOpen,
  } = useCardStore();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [largeTxNotice, setLargeTxNotice] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showDetails = revealedSecrets !== null;
  const panGroups = showDetails
    ? revealedSecrets.cardNumberFormatted.split(' ')
    : ['••••', '••••', '••••', last4];

  // Auto-hide revealed card credentials after 30 seconds (AGENTS.md Section 8)
  useEffect(() => {
    if (!showDetails) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setRevealedSecrets(null);
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
    if (!revealedSecrets) return;
    navigator.clipboard.writeText(revealedSecrets.cardNumberFormatted.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConfirmFreeze() {
    const nextFrozen = !isFrozen;
    freezeMutation.mutate(nextFrozen);
    onToggleFreeze?.();
    setFreezeDialogOpen(false);
    if (nextFrozen) {
      setRevealedSecrets(null);
    }
    showActionToast(
      nextFrozen
        ? 'Kartu debit virtual berhasil dibekukan untuk keamanan.'
        : 'Kartu debit virtual berhasil diaktifkan kembali.'
    );
  }

  async function handleVerifyPassword(e: React.FormEvent) {
    e.preventDefault();
    setReauthError(null);
    try {
      const secrets = await revealMutation.mutateAsync(passwordInput);
      setRevealedSecrets({
        cardNumberFormatted: secrets.cardNumberFormatted,
        cvv: secrets.cvv,
      });
      setCountdown(secrets.expiresInSeconds || 30);
      setReauthDialogOpen(false);
      setPasswordInput('');
    } catch (err) {
      setReauthError(
        err instanceof Error ? err.message : messages.card.reauthError
      );
    }
  }

  function handleToggleDetailsClick() {
    if (showDetails) {
      setRevealedSecrets(null);
      setCountdown(30);
    } else {
      setReauthDialogOpen(true);
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/8 bg-[#050507] p-6 sm:p-7 shadow-xl space-y-6 text-slate-100',
        className
      )}
    >
      {/* 1. Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {messages.card.cardTypeLabel}
            </h2>
            <span
              className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider',
                isFrozen
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-sky-500/20 text-[#67E8F9] border border-sky-500/40'
              )}
            >
              {isFrozen ? messages.card.statusFrozen : messages.card.statusActive}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {messages.card.cardTypeSubtitle}
          </p>
        </div>
      </div>

      {/* 2. Middle Row: Specification Box + Card Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Specification Box + Action Buttons */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="rounded-xl border border-white/8/80 bg-[#12141a]/90 p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] mb-1">Nomor Kartu</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider tabular-nums">
                  {showDetails
                    ? revealedSecrets.cardNumberFormatted
                    : `•••• •••• •••• ${last4}`}
                </span>
                {showDetails && (
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Salin nomor kartu"
                    aria-label="Salin nomor kartu"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-[#22D3EE]" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">Masa Berlaku</span>
              <span className="font-mono text-sm sm:text-base font-semibold text-white tabular-nums">
                {showDetails ? expiry : '••/••'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">CVC/CVV</span>
              <span className="font-mono text-sm sm:text-base font-bold text-white tabular-nums">
                {showDetails ? revealedSecrets.cvv : '•••'}
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-slate-400 block text-[11px] mb-1">Nama Pemegang Kartu</span>
              <span className="font-semibold text-white text-sm block truncate">
                {cardholderName}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">Negara Penerbit</span>
              <span className="font-semibold text-white text-sm block">
                {issuingCountry}
              </span>
            </div>
          </div>

          {/* 3 Action Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
            <button
              type="button"
              onClick={handleToggleDetailsClick}
              disabled={isFrozen && !showDetails}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-[#12141a] hover:bg-white/6 hover:text-white px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showDetails ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>
                    {messages.card.hideDetails} ({countdown}d)
                  </span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span>{messages.card.revealDetails}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setFreezeDialogOpen(true)}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-[#12141a] hover:bg-white/6 hover:text-white px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Snowflake
                className={cn('h-3.5 w-3.5', isFrozen ? 'text-rose-400' : 'text-cyan-400')}
                aria-hidden="true"
              />
              <span>{isFrozen ? messages.card.unfreeze : messages.card.freeze}</span>
            </button>

            <button
              type="button"
              onClick={() => setMoreModalOpen(true)}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-[#12141a] hover:bg-white/6 hover:text-white px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>{messages.card.moreActions}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Card Visual */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className={cn(
              'relative flex flex-col justify-between aspect-[1.586/1] w-full max-w-[340px] sm:max-w-sm rounded-2xl p-6 text-white shadow-2xl transition-all duration-300 overflow-hidden select-none border border-white/10',
              isFrozen
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 opacity-80 grayscale-[30%]'
                : 'bg-gradient-to-br from-black via-zinc-900 to-[#0F1115] shadow-black/40'
            )}
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
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
                <Wifi className="h-5 w-5 text-white/50 rotate-90" aria-hidden="true" />
              </div>

              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase border',
                  isFrozen
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    : 'bg-sky-500/10 text-[#67E8F9] border-sky-500/20'
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    isFrozen ? 'bg-rose-400' : 'bg-[#22D3EE]'
                  )}
                />
                <span>{isFrozen ? messages.card.statusFrozen : messages.card.statusActive}</span>
              </span>
            </div>

            <div className="my-auto py-2 relative z-10">
              <div className="font-mono text-base sm:text-lg font-bold tracking-widest text-slate-100 flex items-center justify-between tabular-nums">
                <span>{panGroups[0] || '••••'}</span>
                <span>{panGroups[1] || '••••'}</span>
                <span>{panGroups[2] || '••••'}</span>
                <span className="text-white">{panGroups[3] || last4}</span>
              </div>
            </div>

            <div className="flex items-end justify-between text-xs relative z-10">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                  Pemegang Kartu
                </span>
                <span className="font-semibold tracking-wider uppercase text-white mt-0.5 block truncate max-w-[120px] sm:max-w-[150px]">
                  {cardholderName}
                </span>
              </div>

              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">
                  Berlaku
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
                  {showDetails ? revealedSecrets.cvv : '•••'}
                </span>
              </div>

              <div className="font-mono font-extrabold italic text-sm sm:text-base tracking-tighter text-white/80">
                VISA
              </div>
            </div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="rounded-xl border border-sky-500/40 bg-sky-950/60 px-4 py-2.5 text-xs text-[#67E8F9] flex items-center gap-2 transition-all">
          <Check className="h-4 w-4 text-[#22D3EE] shrink-0" aria-hidden="true" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Modal: Card Controls */}
      <Dialog
        isOpen={moreModalOpen}
        onClose={() => setMoreModalOpen(false)}
        title={messages.card.moreActions}
        description="Kelola kontrol kartu, pembatasan transaksi online, dan preferensi keamanan."
        className="max-w-lg bg-[#050507] border-white/8 text-slate-100 max-h-[85vh] overflow-y-auto"
      >
        <div className="space-y-6 pt-2 text-sm text-slate-200">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
              Keamanan Kartu
            </span>

            <div className="divide-y divide-slate-800/80 rounded-xl border border-white/8 bg-[#12141a]/80 overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setMoreModalOpen(false);
                  setReauthDialogOpen(true);
                }}
                className="w-full flex items-center justify-between p-3.5 hover:bg-white/6 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Buka Detail Kartu (30 Detik)</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verifikasi ulang kata sandi akun untuk menampilkan nomor kartu dan CVV.
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 shrink-0 ml-2" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMoreModalOpen(false);
                  setFreezeDialogOpen(true);
                }}
                className="w-full flex items-center justify-between p-3.5 hover:bg-white/6 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Laporkan Kompromi Data</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Bekukan kartu segera untuk menolak seluruh otorisasi pembayaran baru.
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 shrink-0 ml-2" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
              Kontrol Transaksi
            </span>

            <div className="divide-y divide-slate-800/80 rounded-xl border border-white/8 bg-[#12141a]/80 overflow-hidden">
              <div className="flex items-center justify-between p-3.5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Transaksi Online Global</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Izinkan pembayaran e-commerce dan langganan SaaS internasional.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={onlineTransactions}
                  aria-label="Transaksi Online Global"
                  onClick={() => {
                    const next = !onlineTransactions;
                    updateControlsMutation.mutate({ onlineTransactions: next });
                    showActionToast(`Transaksi online ${next ? 'diaktifkan' : 'dinonaktifkan'}.`);
                  }}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]',
                    onlineTransactions ? 'bg-[#1D9BF0]' : 'bg-slate-700'
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

              <div className="flex items-center justify-between p-3.5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Transaksi Tanpa 3D Secure</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Izinkan penagihan berulang merchant yang tidak meminta OTP 3D Secure.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={non3dsTransactions}
                  aria-label="Transaksi Tanpa 3D Secure"
                  onClick={() => {
                    const next = !non3dsTransactions;
                    updateControlsMutation.mutate({ non3dsTransactions: next });
                    showActionToast(`Transaksi non-3DS ${next ? 'diizinkan' : 'dinonaktifkan'}.`);
                  }}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]',
                    non3dsTransactions ? 'bg-[#1D9BF0]' : 'bg-slate-700'
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

              <div className="flex items-center justify-between p-3.5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Otorisasi Tarik Tunai ATM</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Nonaktif secara bawaan untuk kartu debit virtual.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={atmWithdrawals}
                  aria-label="Otorisasi Tarik Tunai ATM"
                  onClick={() => {
                    const next = !atmWithdrawals;
                    updateControlsMutation.mutate({ atmWithdrawals: next });
                    showActionToast(`Otorisasi ATM ${next ? 'diaktifkan' : 'dinonaktifkan'}.`);
                  }}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]',
                    atmWithdrawals ? 'bg-[#1D9BF0]' : 'bg-slate-700'
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

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
              Keamanan & Notifikasi
            </span>

            <div className="divide-y divide-slate-800/80 rounded-xl border border-white/8 bg-[#12141a]/80 overflow-hidden">
              <div className="flex items-center justify-between p-3.5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Peringatan Transaksi Email</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Kirim email instan saat terjadi otorisasi kartu debit virtual.
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
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]',
                    emailAlerts ? 'bg-[#1D9BF0]' : 'bg-slate-700'
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

              <div className="flex items-center justify-between p-3.5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                    <Bell className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Peringatan Transaksi Besar (&gt; $500)</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Kirim peringatan keamanan untuk setiap transaksi kartu di atas $500 USD.
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
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]',
                    largeTxNotice ? 'bg-[#1D9BF0]' : 'bg-slate-700'
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

              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-950/60 text-[#22D3EE] shrink-0 mt-0.5 border border-sky-800/40">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Proteksi 3D Secure</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Otorisasi transaksi kartu dilindungi jaringan pembayaran global.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#67E8F9] bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                  Aktif
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-950/60 text-[#22D3EE] shrink-0 mt-0.5 border border-sky-800/40">
                    <FileCheck className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Penyimpanan Tanpa PAN Penuh</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sistem hanya menyimpan referensi penerbit dan 4 digit terakhir kartu.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#67E8F9] bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                  Terlindungi
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
            ? 'Kartu akan segera dapat digunakan kembali untuk pembayaran online global.'
            : 'Saat dibekukan, seluruh otorisasi transaksi online baru akan ditolak otomatis untuk keamanan Anda.'
        }
        className="max-w-md bg-[#050507] border-white/8 text-slate-100"
      >
        <div className="space-y-4 pt-2">
          <div className="rounded-xl border border-white/8 bg-[#12141a] p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Kartu:</span>
              <span className="font-mono text-slate-200">VISA Virtual Debit (*{last4})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Status Saat Ini:</span>
              <span className={cn('font-bold', isFrozen ? 'text-rose-400' : 'text-[#22D3EE]')}>
                {isFrozen ? messages.card.statusFrozen : messages.card.statusActive}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFreezeDialogOpen(false)}
              className="border-white/8 bg-[#12141a] text-slate-200 hover:bg-white/6"
            >
              {messages.common.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmFreeze}
              className={cn(
                'font-bold',
                isFrozen
                  ? 'bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white border-[#1D9BF0]'
                  : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-600'
              )}
            >
              {isFrozen ? messages.card.unfreeze : messages.card.freeze}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Modal: Password Re-authentication (AGENTS.md Section 8 Phase 2) */}
      <Dialog
        isOpen={reauthDialogOpen}
        onClose={() => {
          setReauthDialogOpen(false);
          setReauthError(null);
          setPasswordInput('');
        }}
        title={messages.card.reauthTitle}
        description={messages.card.reauthDescription}
        className="max-w-md bg-[#050507] border-white/8 text-slate-100"
      >
        <form onSubmit={handleVerifyPassword} className="space-y-4 pt-2">
          <div>
            <label
              htmlFor="card-reauth-password"
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              {messages.card.passwordLabel}
            </label>
            <input
              id="card-reauth-password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder={messages.card.passwordPlaceholder}
              autoFocus
              aria-describedby={reauthError ? 'card-reauth-error' : undefined}
              className="w-full rounded-xl border border-white/8 bg-[#12141a] px-4 py-3 text-sm text-white focus:border-[#1D9BF0] focus:outline-none focus:ring-1 focus:ring-[#1D9BF0]"
            />
            {reauthError && (
              <p id="card-reauth-error" className="mt-1.5 text-xs text-rose-400">
                {reauthError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setReauthDialogOpen(false);
                setReauthError(null);
                setPasswordInput('');
              }}
              className="border-white/8 bg-[#12141a] text-slate-200 hover:bg-white/6"
            >
              {messages.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={revealMutation.isPending}
              className="bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold border-[#1D9BF0]"
            >
              {messages.card.revealConfirmCta}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
