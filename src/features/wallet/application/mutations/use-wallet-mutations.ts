import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletKeys } from '../queries/keys';
import { transactionKeys } from '@/features/transactions/application/queries/keys';
import { transactionRepository } from '@/features/transactions';
import { Wallet } from '../../domain/entities/wallet';
import { Money } from '@/shared/domain/money';

export interface TopUpParams {
  amountUsd: number;
  channel: string;
  fxRate?: number;
}

export function useTopUpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: TopUpParams) => {
      const amountUsdCents = BigInt(Math.round(params.amountUsd * 100));
      const fxRate = params.fxRate && params.fxRate > 0 ? params.fxRate : 16250;
      const amountIdr = Math.round(params.amountUsd * fxRate);

      const createdTx = await transactionRepository.createTransaction({
        title: `Top Up via ${params.channel}`,
        merchant: 'PT Bank Central Asia Tbk',
        type: 'topup',
        category: 'Deposit Saldo',
        status: 'success',
        amountUsdCents,
        amountIdr,
        fxRate,
        feeIdr: 0,
        channel: params.channel,
        referenceId: `REF-TOPUP-${Date.now()}`,
        idempotencyKey: `idemp_topup_${Date.now()}`,
      });

      return {
        amountUsd: params.amountUsd,
        channel: params.channel,
        transaction: createdTx,
      };
    },
    onMutate: async (newTopUp) => {
      await queryClient.cancelQueries({ queryKey: walletKeys.all });

      const previousWallet = queryClient.getQueryData<Wallet | null>(walletKeys.current());
      const addedCents = BigInt(Math.round(newTopUp.amountUsd * 100));

      if (previousWallet) {
        const updatedBalance = Money.fromCents(
          previousWallet.balance.amount + addedCents,
          'USD'
        );
        queryClient.setQueryData<Wallet>(walletKeys.current(), {
          ...previousWallet,
          balance: updatedBalance,
        });
      } else {
        const initialCents = 125000n; // Default base balance ($1,250.00)
        queryClient.setQueryData<Wallet>(walletKeys.current(), {
          id: 'wallet_user_01',
          userId: 'user_01',
          balance: Money.fromCents(initialCents + addedCents, 'USD'),
          isFrozen: false,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousWallet };
    },
    onError: (_err, _newTopUp, context) => {
      if (context?.previousWallet) {
        queryClient.setQueryData(walletKeys.current(), context.previousWallet);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
