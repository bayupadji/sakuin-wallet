import Link from "next/link";
import { messages } from "@/shared/messages/en";
import { Button } from "@/shared/presentation/ui/button";
import { Shield, CreditCard, ArrowRight, Wallet, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/80 sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white font-mono text-sm font-semibold">
              $
            </span>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              {messages.common.appName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                Admin Console
              </Button>
            </Link>
            <Link href="/wallet">
              <Button variant="primary" size="sm">
                Open Wallet
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300 mb-6">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>USD Balance & Virtual Debit Card</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-950 dark:text-white text-balance">
            Digital dollar wallet built for Indonesian professionals
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300 text-pretty">
            Hold USD balances securely, top up via Virtual Account or QRIS, and spend worldwide with an instant virtual debit card.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/wallet" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                <span>Go to Wallet Overview</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/admin" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-400 mb-4">
                  <Wallet className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  USD Balance & Ledger
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Integer cents balance derived strictly from an append-only ledger with real-time tracking.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-400 mb-4">
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Virtual Debit Card
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Spend your balance anywhere online. Manage freeze, unfreeze, and card limits instantly.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-400 mb-4">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  KYC & Bank-Grade RLS
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  KTP photo verification with encrypted NIK storage and Row Level Security on every table.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>&copy; 2026 {messages.common.appName}. Built with Next.js, TypeScript & Supabase.</p>
      </footer>
    </div>
  );
}
