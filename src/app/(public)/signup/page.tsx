import React from 'react';
import Link from 'next/link';
import { SignUpForm } from '@/features/auth';
import { messages } from '@/shared/messages/en';
import { Lock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Sign Up | Dompet Digital Dollar',
  description: 'Create your USD digital wallet account in Indonesia.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-[#090D14] font-sans antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white group"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white font-mono text-base font-bold shadow-xs transition-transform group-hover:scale-105">
            $
          </span>
          <span>{messages.common.appName}</span>
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Create your account
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Get started with your USD balance and instant virtual debit card.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-xl shadow-slate-200/50 dark:border-slate-800/80 dark:bg-[#111726] dark:shadow-none">
          <SignUpForm />

          {/* Security Assurance Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
              <span>256-bit Encryption</span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
              <span>1-Doc KTP KYC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
