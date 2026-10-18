import React from 'react';
import { WalletOverview } from '@/features/wallet';

export const metadata = {
  title: 'Ringkasan Dompet | Sakuin - Dompet Digital Dollar',
  description: 'Kelola saldo USD, pantau kurs real-time, dan akses kartu virtual Anda.',
};

export default function WalletPage() {
  return <WalletOverview />;
}
