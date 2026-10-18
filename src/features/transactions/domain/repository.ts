import { TransactionItem, TransactionType } from './entities/transaction';

export interface TransactionFilter {
  type?: 'all' | TransactionType;
  search?: string;
}

export interface CreateTransactionParams {
  title: string;
  merchant: string;
  type: TransactionType;
  category: string;
  status: 'pending' | 'success' | 'failed';
  amountUsdCents: bigint;
  amountIdr: number;
  fxRate: number;
  feeIdr: number;
  channel: string;
  referenceId: string;
  idempotencyKey: string;
}

export interface TransactionRepository {
  getTransactions(filter?: TransactionFilter): Promise<TransactionItem[]>;
  createTransaction(params: CreateTransactionParams): Promise<TransactionItem>;
}
