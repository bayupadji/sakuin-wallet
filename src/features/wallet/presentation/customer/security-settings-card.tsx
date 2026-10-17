'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { Bell, KeyRound, Lock, Shield, Smartphone, ToggleLeft, ToggleRight } from 'lucide-react';
import { KycStatusBadge, KycStatus } from '@/features/kyc';

interface SecuritySettingsCardProps {
  kycStatus: KycStatus;
  className?: string;
}

export function SecuritySettingsCard({
  kycStatus,
  className,
}: SecuritySettingsCardProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [largeTxNotice, setLargeTxNotice] = useState(true);

  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-[#111726] shadow-2xs space-y-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
            <Shield className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Security & Notifications
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Bank-grade protections and real-time transaction notifications
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          High Protection
        </span>
      </div>

      {/* Security Items List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
        {/* KYC Compliance Status */}
        <div className="flex items-center justify-between py-3 first:pt-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                Indonesian ID (KTP) Verification
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                16-digit encrypted NIK with private storage vault
              </span>
            </div>
          </div>
          <KycStatusBadge status={kycStatus} />
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Smartphone className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                Two-Factor Authentication (2FA)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Hardware security key or TOTP authenticator
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] font-semibold text-teal-700 dark:text-teal-400">
            Active
          </span>
        </div>

        {/* Transaction PIN */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <KeyRound className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                6-Digit Security PIN
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Required for card unfreeze & CVV reveal
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] font-semibold text-teal-700 dark:text-teal-400">
            Configured
          </span>
        </div>

        {/* Email Alerts Toggle */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Bell className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                Instant Transaction Receipts
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Real-time email confirmations on card charges
              </span>
            </div>
          </div>
          <button
            onClick={() => setEmailAlerts(!emailAlerts)}
            className="text-teal-700 dark:text-teal-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
            aria-label="Toggle instant transaction receipts"
          >
            {emailAlerts ? (
              <ToggleRight className="h-6 w-6 text-teal-600" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-slate-400" />
            )}
          </button>
        </div>

        {/* Large Transaction SMS/Push Alert */}
        <div className="flex items-center justify-between py-3 last:pb-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Lock className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                Threshold Alert (&gt;$100)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Secondary verification for high-value purchases
              </span>
            </div>
          </div>
          <button
            onClick={() => setLargeTxNotice(!largeTxNotice)}
            className="text-teal-700 dark:text-teal-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded p-1"
            aria-label="Toggle threshold alert"
          >
            {largeTxNotice ? (
              <ToggleRight className="h-6 w-6 text-teal-600" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
