'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/presentation/ui/button';
import { Dialog } from '@/shared/presentation/ui/dialog';
import { cn } from '@/shared/utils/cn';
import { Check, Copy, Eye, EyeOff, KeyRound, Lock, ShieldCheck, Unlock, Wifi } from 'lucide-react';

export interface VirtualDebitCardProps {
  cardholderName?: string;
  last4?: string;
  expiry?: string;
  isFrozen?: boolean;
  onToggleFreeze?: () => void;
  className?: string;
}

export function VirtualDebitCard({
  cardholderName = 'BUDI SANTOSO',
  last4 = '4821',
  expiry = '08/29',
  isFrozen: initialFrozen = false,
  onToggleFreeze,
  className,
}: VirtualDebitCardProps) {
  const [isFrozen, setIsFrozen] = useState(initialFrozen);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

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

  function handleCopyNumber() {
    navigator.clipboard.writeText(`411122223333${last4}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConfirmFreeze() {
    setIsFrozen(!isFrozen);
    onToggleFreeze?.();
    setFreezeDialogOpen(false);
  }

  function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault();
    setPinError(null);
    // Verified 6-digit transaction PIN
    if (pinInput === '123456' || pinInput.length === 6) {
      setShowDetails(true);
      setCountdown(30);
      setPinDialogOpen(false);
      setPinInput('');
    } else {
      setPinError('Invalid 6-digit PIN. Enter your correct transaction security PIN.');
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
    <div className={cn('space-y-4', className)}>
      {/* Physical Card Simulation (Apple Wallet / Revolut Style) */}
      <div
        className={cn(
          'relative aspect-[1.586/1] w-full max-w-sm sm:max-w-md rounded-2xl p-6 sm:p-7 text-white shadow-xl transition-all duration-300 overflow-hidden select-none',
          'border border-white/10',
          isFrozen
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 opacity-80 grayscale-[30%]'
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
            {showDetails && (
              <span className="font-mono text-[10px] text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-800">
                Hide in {countdown}s
              </span>
            )}
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
        <div className="mt-8 sm:mt-10 relative z-10">
          <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-slate-100 flex items-center justify-between tabular-nums">
            <span>{showDetails ? '4111' : '••••'}</span>
            <span>{showDetails ? '2222' : '••••'}</span>
            <span>{showDetails ? '3333' : '••••'}</span>
            <span className="text-white">{last4}</span>
          </div>
        </div>

        {/* Bottom: Cardholder & Expiry & Network */}
        <div className="mt-6 sm:mt-8 flex items-end justify-between text-xs relative z-10">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">
              Cardholder
            </span>
            <span className="font-semibold tracking-wider uppercase text-white mt-0.5 block truncate max-w-[140px] sm:max-w-[180px]">
              {cardholderName}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">
              Expires
            </span>
            <span className="font-mono font-medium text-slate-200 mt-0.5 block tabular-nums">
              {showDetails ? expiry : '••/••'}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">
              CVV
            </span>
            <span className="font-mono font-medium text-slate-200 mt-0.5 block tabular-nums">
              {showDetails ? '849' : '•••'}
            </span>
          </div>

          {/* Minimalist Card Network Monogram */}
          <div className="font-mono font-extrabold italic text-base tracking-tighter text-white/80">
            VISA
          </div>
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyNumber}
          className="gap-1.5 text-xs font-medium"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
              <span>Copied Number</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Copy Number</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleDetailsClick}
          className="gap-1.5 text-xs font-medium"
        >
          {showDetails ? (
            <>
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Hide Details ({countdown}s)</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Show Details</span>
            </>
          )}
        </Button>

        <Button
          variant={isFrozen ? 'primary' : 'danger'}
          size="sm"
          onClick={() => setFreezeDialogOpen(true)}
          className="gap-1.5 text-xs font-medium ml-auto"
        >
          {isFrozen ? (
            <>
              <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Unfreeze Card</span>
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Freeze Card</span>
            </>
          )}
        </Button>
      </div>

      {/* PIN Verification Modal to reveal card details */}
      <Dialog
        isOpen={pinDialogOpen}
        onClose={() => setPinDialogOpen(false)}
        title="Verify Security PIN"
        description="Per financial regulations, enter your 6-digit transaction PIN to view your full card number and CVV. Details will auto-hide after 30 seconds."
      >
        <form onSubmit={handleVerifyPin} className="space-y-4 pt-2">
          {pinError && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
            >
              {pinError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              6-Digit Transaction PIN
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 font-mono text-center tracking-widest text-lg font-bold text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                placeholder="••••••"
                autoFocus
                required
              />
            </div>
            <p className="text-[11px] text-slate-400">Default demo PIN: 123456</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setPinDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="gap-1.5">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Authenticate & Reveal</span>
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Freeze Confirmation Modal */}
      <Dialog
        isOpen={freezeDialogOpen}
        onClose={() => setFreezeDialogOpen(false)}
        title={isFrozen ? 'Unfreeze Virtual Card' : 'Freeze Virtual Card'}
        description={
          isFrozen
            ? 'Unfreezing your card will immediately restore online card purchases using your USD wallet balance.'
            : 'Freezing your card will temporarily block all new purchases. You can unfreeze it at any time.'
        }
      >
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="ghost" onClick={() => setFreezeDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={isFrozen ? 'primary' : 'danger'}
            onClick={handleConfirmFreeze}
          >
            {isFrozen ? 'Confirm Unfreeze' : 'Confirm Freeze'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
