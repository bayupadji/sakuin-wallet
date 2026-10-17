import React from 'react';
import Link from 'next/link';
import { KycSubmissionForm } from '@/features/kyc';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Identity Verification (KYC) | Dompet Digital Dollar',
  description: 'Upload your Indonesian National ID (KTP) photo to verify your account.',
};

export default function KycSubmitPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href="/wallet"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Wallet</span>
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-400">
            <Shield className="h-4 w-4" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Identity Verification (KYC)
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload a clear photo of your Indonesian National ID card (KTP) to unlock deposits and virtual debit cards.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <KycSubmissionForm />
      </div>
    </div>
  );
}
