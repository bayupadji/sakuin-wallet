import React from 'react';
import type { Metadata } from 'next';
import { AdminLayout } from '@/shared/presentation/layouts';

export const metadata: Metadata = {
  title: {
    default: 'Konsol Admin',
    template: '%s | Konsol Admin sakuin.co.id',
  },
  description: 'Konsol administrasi internal sakuin.co.id untuk verifikasi KYC, manajemen nasabah, dan rekonsiliasi.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
