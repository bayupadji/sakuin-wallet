import { ActivityHub } from '@/features/transactions';

export const metadata = {
  title: 'Riwayat Transaksi & Buku Besar | Sakuin - Dompet Digital Dollar',
  description: 'Catatan mutasi buku besar append-only double-entry dan bukti settlement kriptografis.',
};

export default function TransactionsPage() {
  return <ActivityHub />;
}
