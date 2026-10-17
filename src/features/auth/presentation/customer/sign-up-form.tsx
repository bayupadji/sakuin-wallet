'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignUpMutation } from '../../application/mutations/use-auth-mutations';
import { Button } from '@/shared/presentation/ui/button';
import { Input } from '@/shared/presentation/ui/input';
import { messages } from '@/shared/messages/en';

export function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const signUpMutation = useSignUpMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    try {
      await signUpMutation.mutateAsync({ fullName, email, password });
      router.push('/wallet');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to create account. Please try again.');
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
        label="Full Name"
        type="text"
        id="signup-fullname"
        autoComplete="name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Budi Santoso"
        required
      />

      <Input
        label={messages.auth.emailLabel}
        type="email"
        id="signup-email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@company.com"
        required
      />

      <Input
        label={messages.auth.passwordLabel}
        type="password"
        id="signup-password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 8 characters"
        helperText="Must be at least 8 characters."
        required
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={signUpMutation.isPending}
      >
        Create Account
      </Button>

      <p className="text-center text-xs text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          href="/signin"
          className="font-medium text-teal-700 hover:text-teal-800 underline dark:text-teal-400"
        >
          {messages.auth.signIn}
        </Link>
      </p>
    </form>
  );
}
