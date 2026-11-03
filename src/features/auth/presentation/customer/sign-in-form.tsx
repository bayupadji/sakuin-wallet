'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSignInMutation } from '../../application/mutations/use-auth-mutations';
import { Button } from '@/shared/presentation/ui/button';
import { Input } from '@/shared/presentation/ui/input';
import { messages } from '@/shared/messages';
import { Clock, ShieldAlert } from 'lucide-react';

interface SignInFormFieldsProps {
  reason?: string | null;
  redirectTarget?: string | null;
}

function SignInFormFields({ reason = null, redirectTarget = null }: SignInFormFieldsProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signInMutation = useSignInMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage(messages.auth.signInMissingFields);
      return;
    }

    try {
      const user = await signInMutation.mutateAsync({ email, password });
      const safeRedirect =
        redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('//')
          ? redirectTarget
          : null;
      const target = safeRedirect || (user.role === 'super_admin' ? '/admin' : '/wallet');
      // Full navigation guarantees Safari iOS commits the HTTP cookie before loading the target page
      window.location.href = target;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(messages.auth.signInGenericError);
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
            <p className="font-semibold">{messages.auth.idleTimeoutTitle}</p>
            <p className="text-[11px] text-amber-300/80 mt-0.5">
              {messages.auth.idleTimeoutDescription}
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
            <p className="font-semibold">{messages.auth.expiredSessionTitle}</p>
            <p className="text-[11px] text-rose-300/80 mt-0.5">
              {messages.auth.expiredSessionDescription}
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
        placeholder={messages.auth.emailPlaceholder}
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
        {messages.auth.noAccountPrompt}{' '}
        <Link
          href="/signup"
          className="font-medium text-[#1D9BF0] hover:text-[#1A8CD8] underline dark:text-[#1D9BF0]"
        >
          {messages.auth.signUp}
        </Link>
      </p>
    </form>
  );
}

function SignInFormWithSearchParams() {
  const searchParams = useSearchParams();
  return (
    <SignInFormFields
      reason={searchParams.get('reason')}
      redirectTarget={searchParams.get('redirect')}
    />
  );
}

export function SignInForm() {
  return (
    <React.Suspense fallback={<SignInFormFields />}>
      <SignInFormWithSearchParams />
    </React.Suspense>
  );
}
