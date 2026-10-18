import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionRepository } from '../container';
import { transactionKeys } from '../queries/keys';
import { walletKeys } from '@/features/wallet/application/queries/keys';
import { CreateTransactionParams } from '../../domain/repository';
import { TransactionItem } from '../../domain/entities/transaction';

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateTransactionParams) => transactionRepository.createTransaction(params),
    onMutate: async (newParams) => {
      await queryClient.cancelQueries({ queryKey: transactionKeys.all });

      const previousTransactions = queryClient.getQueryData<TransactionItem[]>(transactionKeys.list());

      if (previousTransactions) {
        const optimisticTx: TransactionItem = {
          id: `temp-${Date.now()}`,
          title: newParams.title,
          merchant: newParams.merchant,
          type: newParams.type,
          category: newParams.category,
          status: 'success',
          amountUsdCents: newParams.amountUsdCents,
          amountIdr: newParams.amountIdr,
          fxRate: newParams.fxRate,
          feeIdr: newParams.feeIdr,
          channel: newParams.channel,
          referenceId: newParams.referenceId,
          idempotencyKey: newParams.idempotencyKey,
          ledgerSequence: 'LDG-PENDING',
          timestampUtc: new Date().toISOString(),
          timestampWib: 'Baru saja',
        };

        queryClient.setQueryData<TransactionItem[]>(
          transactionKeys.list(),
          [optimisticTx, ...previousTransactions]
        );
      }

      return { previousTransactions };
    },
    onError: (_err, _newParams, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(transactionKeys.list(), context.previousTransactions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}
