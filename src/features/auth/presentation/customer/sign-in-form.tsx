'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSignInMutation } from '../../application/mutations/use-auth-mutations';
import { Button } from '@/shared/presentation/ui/button';
import { Input } from '@/shared/presentation/ui/input';
import { messages } from '@/shared/messages/en';
import { Clock, ShieldAlert } from 'lucide-react';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const redirectTarget = searchParams.get('redirect');
  const signInMutation = useSignInMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      const user = await signInMutation.mutateAsync({ email, password });
      const target = redirectTarget || (user.role === 'super_admin' ? '/admin' : '/wallet');
      // Full navigation guarantees Safari iOS commits the HTTP cookie before loading the target page
      window.location.href = target;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to sign in. Please verify your credentials.');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {reason === 'idle' && (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/30 bg-amber-950/40 p-3.5 text-xs text-amber-200 flex items-start gap-2.5"
        >
          <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Sesi Berakhir (Idle Timeout)</p>
            <p className="text-[11px] text-amber-300/80 mt-0.5">
              Tidak ada aktivitas selama 30 menit. Silakan masuk kembali untuk melanjutkan akses dompet.
            </p>
          </div>
        </div>
      )}

      {reason === 'expired' && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs text-rose-200 flex items-start gap-2.5"
        >
          <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Batas Sesi 2 Jam Habis</p>
            <p className="text-[11px] text-rose-300/80 mt-0.5">
              Maksimum durasi sesi perbankan (2 jam) telah tercapai demi alasan keamanan. Silakan otorisasi ulang akun Anda.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
        >
          {errorMessage}
        </div>
      )}

      <Input
        label={messages.auth.emailLabel}
        type="email"
        id="signin-email"
        name="email"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@company.com"
        required
      />

      <Input
        label={messages.auth.passwordLabel}
        type="password"
        id="signin-password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={signInMutation.isPending}
      >
        {messages.auth.signIn}
      </Button>

      <p className="text-center text-xs text-slate-600 dark:text-slate-400">
        Don&apos;t have an account yet?{' '}
        <Link
          href="/signup"
          className="font-medium text-teal-700 hover:text-teal-800 underline dark:text-teal-400"
        >
          {messages.auth.signUp}
        </Link>
      </p>
    </form>
  );
}
