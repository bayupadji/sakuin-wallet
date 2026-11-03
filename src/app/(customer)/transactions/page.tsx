import { ActivityHub } from '@/features/transactions';

export const metadata = {
  title: 'Riwayat Transaksi & Buku Besar',
  description: 'Catatan mutasi buku besar append-only dalam zona waktu WIB dan status penyelesaian transaksi.',
};

export default function TransactionsPage() {
  return <ActivityHub />;
}
