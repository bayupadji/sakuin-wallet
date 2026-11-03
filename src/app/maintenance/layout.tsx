import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pemeliharaan Terjadwal',
  description:
    'Sistem sakuin.co.id sedang menjalani pemeliharaan terjadwal. Seluruh data akun dan saldo Anda tetap aman.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}

