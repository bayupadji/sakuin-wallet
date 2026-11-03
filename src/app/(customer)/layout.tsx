import React from 'react';
import type { Metadata } from 'next';
import { CustomerLayout } from '@/shared/presentation/layouts';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CustomerRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerLayout>{children}</CustomerLayout>;
}
