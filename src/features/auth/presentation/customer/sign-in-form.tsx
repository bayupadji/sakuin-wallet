'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignInMutation } from '../../application/mutations/use-auth-mutations';
import { Button } from '@/shared/presentation/ui/button';
import { Input } from '@/shared/presentation/ui/input';
import { messages } from '@/shared/messages/en';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const signInMutation = useSignInMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      await signInMutation.mutateAsync({ email, password });
      router.push('/wallet');
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
