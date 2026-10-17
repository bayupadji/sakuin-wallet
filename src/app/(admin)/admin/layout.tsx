import React from 'react';
import { AdminLayout } from '@/shared/presentation/layouts';

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
