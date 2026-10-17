import React from 'react';
import { CustomerLayout } from '@/shared/presentation/layouts';

export default function CustomerRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerLayout>{children}</CustomerLayout>;
}
