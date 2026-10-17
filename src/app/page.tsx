import Link from 'next/link';
import { messages } from '@/shared/messages/en';
import { Button } from '@/shared/presentation/ui/button';
import { LandingConverter } from '@/features/wallet/presentation/customer/landing-converter';
import {
  ArrowRight,
  CreditCard,
  FileCheck,
  Lock,
  ShieldCheck,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090D14] dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500/20 selection:text-teal-700">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#090D14]/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white font-mono text-sm font-bold shadow-xs">
              $
            </span>
            <span className="text-base font-bold tracking-tight text-slate-950 dark:text-white">
              {messages.common.appName}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              USD Digital Wallet
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-xs font-semibold">
                Admin Console
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/wallet">
              <Button variant="primary" size="sm" className="text-xs font-semibold gap-1.5 shadow-xs">
                <span>Open Wallet</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Live Converter */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 bg-linear-to-b from-white via-slate-50 to-slate-100/50 dark:from-[#090D14] dark:via-[#0c121e] dark:to-[#090D14]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Hero Copy */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900/80 dark:bg-teal-950/40 dark:text-teal-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                  <span>Licensed ID Card Verification &bull; Append-Only Ledger</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.08] text-balance">
                  Hold pure USD. <br />
                  <span className="text-teal-700 dark:text-teal-400">Spend globally</span> with a virtual card.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl text-pretty leading-relaxed">
                  The digital dollar wallet tailored for Indonesian tech professionals, remote workers, and businesses. Top up seamlessly via BCA/Mandiri VA or QRIS, with zero float calculations and guaranteed 15-minute FX rates.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/wallet">
                    <Button variant="primary" size="lg" className="gap-2 font-semibold shadow-md">
                      <span>Open Your USD Wallet</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" size="lg" className="font-semibold">
                      Create Account
                    </Button>
                  </Link>
                </div>

                {/* Key Assurance Badges */}
                <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm">
                      15 Min
                    </span>
                    <span>Guaranteed FX Lock</span>
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm">
                      1-Doc KTP
                    </span>
                    <span>No Selfie or Biometrics</span>
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm">
                      Append-Only
                    </span>
                    <span>Immutable Ledger</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live FX Converter Widget */}
              <div className="lg:col-span-5">
                <LandingConverter />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Pillars Feature Grid */}
        <section className="py-20 bg-white dark:bg-[#0c121e] border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                Financial Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white mt-2">
                Built for security, transparency, and precision
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Engineered from the database layer up to ensure zero balance drift and complete regulatory compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-7 dark:border-slate-800/80 dark:bg-[#111726]/60 space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 shadow-2xs">
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  Instant Virtual Debit Card
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Spend your USD balance online for cloud hosting (AWS, GCP), subscriptions (GitHub, OpenAI, Figma), and global e-commerce. Instant freeze/unfreeze and PIN authentication.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-7 dark:border-slate-800/80 dark:bg-[#111726]/60 space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 shadow-2xs">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  Append-Only Server Ledger
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  All money is stored as integer cents (`bigint`). Balance changes occur exclusively through atomic Postgres functions locked in single transactions. Zero floating-point rounding errors.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-7 dark:border-slate-800/80 dark:bg-[#111726]/60 space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 shadow-2xs">
                  <FileCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  Single-Document KTP KYC
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upload an Indonesian National ID (KTP) photo. No invasive liveness checks or selfies. ID numbers are encrypted at column level and private storage is protected by strict RLS.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Comparison Table (Traditional Bank vs Sakuin) */}
        <section className="py-20 bg-slate-50 dark:bg-[#090D14]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                How we compare to traditional Indonesian banks
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Zero administrative drag, transparent foreign exchange, and pure digital USD balance.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#111726] overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500">
                    <th className="p-4 sm:px-6 font-semibold">Feature</th>
                    <th className="p-4 sm:px-6 font-semibold">Traditional Bank USD Account</th>
                    <th className="p-4 sm:px-6 font-bold text-teal-700 dark:text-teal-400">
                      Dompet Digital Dollar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-slate-900 dark:text-white">
                      FX Rate Guarantee
                    </td>
                    <td className="p-4 sm:px-6 text-slate-500">Volatile, hidden markup</td>
                    <td className="p-4 sm:px-6 font-semibold text-teal-700 dark:text-teal-400">
                      Locked 15 minutes before payment
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-slate-900 dark:text-white">
                      Debit Card Availability
                    </td>
                    <td className="p-4 sm:px-6 text-slate-500">Physical card only, takes 2 weeks</td>
                    <td className="p-4 sm:px-6 font-semibold text-teal-700 dark:text-teal-400">
                      Instant Virtual Debit Card
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-slate-900 dark:text-white">
                      Top Up Methods
                    </td>
                    <td className="p-4 sm:px-6 text-slate-500">Bank counter or wire transfer</td>
                    <td className="p-4 sm:px-6 font-semibold text-teal-700 dark:text-teal-400">
                      Instant VA (BCA, Mandiri) & QRIS
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-slate-900 dark:text-white">
                      Identity Verification
                    </td>
                    <td className="p-4 sm:px-6 text-slate-500">Branch visit, physical signatures</td>
                    <td className="p-4 sm:px-6 font-semibold text-teal-700 dark:text-teal-400">
                      100% online KTP photo review
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Minimalist Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 dark:border-slate-800/80 dark:bg-[#090D14]">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              {messages.common.appName}
            </span>
            <span>&bull;</span>
            <span>USD Digital Wallet for Indonesia</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/wallet" className="hover:text-slate-900 dark:hover:text-white">
              Wallet App
            </Link>
            <Link href="/admin" className="hover:text-slate-900 dark:hover:text-white">
              Compliance Console
            </Link>
            <Link href="/signin" className="hover:text-slate-900 dark:hover:text-white">
              Customer Sign In
            </Link>
            <span>&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
