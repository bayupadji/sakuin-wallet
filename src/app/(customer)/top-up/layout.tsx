import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top Up Saldo',
  description:
    'Isi saldo terpadu dalam Rupiah melalui QRIS atau Virtual Account dengan kurs referensi Wise terkunci 15 menit.',
};

export default function TopUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}

