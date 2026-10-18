import { useQuery } from '@tanstack/react-query';
import { transactionRepository } from '../container';
import { transactionKeys } from './keys';
import { TransactionFilter } from '../../domain/repository';

export function useTransactionsQuery(filter?: TransactionFilter) {
  return useQuery({
    queryKey: transactionKeys.list(filter),
    queryFn: () => transactionRepository.getTransactions(filter),
  });
}
