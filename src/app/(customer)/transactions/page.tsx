import { ActivityHub } from '@/features/transactions';

export const metadata = {
  title: 'Activity & Ledger | Dompet Digital Dollar',
  description: 'View full double-entry ledger history, settlement receipts, and foreign exchange rates.',
};

export default function TransactionsPage() {
  return <ActivityHub />;
}
