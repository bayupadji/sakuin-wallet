import { TransactionFilter } from '../../domain/repository';

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (filter?: TransactionFilter) => [...transactionKeys.all, 'list', filter] as const,
};
