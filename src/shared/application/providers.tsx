'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { makeQueryClient } from './query-client';

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Use useState to ensure QueryClient is not recreated on re-renders
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
