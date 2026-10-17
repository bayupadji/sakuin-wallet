export type TransactionType = 'topup' | 'card' | 'receive';
export type TransactionStatus = 'success' | 'pending' | 'failed' | 'refunded';

export interface TransactionItem {
  id: string;
  title: string;
  merchant: string;
  type: TransactionType;
  category: string;
  status: TransactionStatus;
  amountUsdCents: bigint;
  amountIdr: number;
  fxRate: number;
  feeIdr: number;
  channel: string;
  referenceId: string;
  idempotencyKey: string;
  ledgerSequence: string;
  timestampUtc: string;
  timestampWib: string;
}
