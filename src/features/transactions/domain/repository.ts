import { TransactionItem, TransactionType } from './entities/transaction';

export interface TransactionFilter {
  type?: 'all' | TransactionType;
  search?: string;
  month?: string;
  userId?: string;
}

export interface TransactionRepository {
  getTransactions(filter?: TransactionFilter): Promise<TransactionItem[]>;
}
