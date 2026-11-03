'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSignUpMutation } from '../../application/mutations/use-auth-mutations';
import { Button } from '@/shared/presentation/ui/button';
import { Input } from '@/shared/presentation/ui/input';
import { messages } from '@/shared/messages';

function SignUpFormFields({ initialEmail = '' }: { initialEmail?: string }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const signUpMutation = useSignUpMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage(messages.auth.signUpMissingFields);
      return;
    }

    if (password.length < 8) {
      setErrorMessage(messages.auth.signUpShortPassword);
      return;
    }

    try {
      await signUpMutation.mutateAsync({ fullName, email, password });
      router.push('/wallet');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(messages.auth.signUpGenericError);
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
        label={messages.auth.fullNameLabel}
        type="text"
        id="signup-fullname"
        name="fullName"
        autoComplete="name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder={messages.auth.fullNamePlaceholder}
        required
      />

      <Input
        label={messages.auth.emailLabel}
        type="email"
        id="signup-email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={messages.auth.emailPlaceholder}
        required
      />

      <Input
        label={messages.auth.passwordLabel}
        type="password"
        id="signup-password"
        name="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={messages.auth.newPasswordPlaceholder}
        helperText={messages.auth.newPasswordHelper}
        required
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={signUpMutation.isPending}
      >
        {messages.auth.createAccountCta}
      </Button>

      <p className="text-center text-xs text-slate-600 dark:text-slate-400">
        {messages.auth.hasAccountPrompt}{' '}
        <Link
          href="/signin"
          className="font-medium text-[#1D9BF0] hover:text-[#1A8CD8] underline dark:text-[#1D9BF0]"
        >
          {messages.auth.signIn}
        </Link>
      </p>
    </form>
  );
}

function SignUpFormWithSearchParams() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email')?.trim() ?? '';
  return <SignUpFormFields key={initialEmail} initialEmail={initialEmail} />;
}

export function SignUpForm() {
  return (
    <React.Suspense fallback={<SignUpFormFields />}>
      <SignUpFormWithSearchParams />
    </React.Suspense>
  );
}
