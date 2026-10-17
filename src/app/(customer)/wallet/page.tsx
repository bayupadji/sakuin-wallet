import React from 'react';
import { WalletOverview } from '@/features/wallet';

export const metadata = {
  title: 'Wallet Overview | Dompet Digital Dollar',
  description: 'View your USD balance and manage your virtual card.',
};

export default function WalletPage() {
  return <WalletOverview />;
}
