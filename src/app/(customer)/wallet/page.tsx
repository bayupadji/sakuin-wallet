import React from 'react';
import { WalletOverview } from '@/features/wallet';

export const metadata = {
  title: 'Ringkasan Dompet',
  description: 'Kelola saldo terpadu, pantau kurs referensi Wise real-time, dan akses Virtual Debit Card Anda.',
};

export default function WalletPage() {
  return <WalletOverview />;
}
