'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/presentation/ui/button';

export function NotFoundBackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => router.back()}
      className="flex-1 gap-2"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span>Kembali</span>
    </Button>
  );
}

