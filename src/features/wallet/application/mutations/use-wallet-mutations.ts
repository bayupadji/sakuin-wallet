import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletKeys } from '../queries/keys';
import { transactionKeys } from '@/features/transactions';
import { Money } from '@/shared/domain/money';

export interface TopUpParams {
  amountUsd: number | string;
  method: 'va' | 'qris';
  channel: string;
  idempotencyKey: string;
  fxRate?: number;
}

export interface PendingTopUpOrder {
  id: string;
  status: 'pending' | 'success' | 'failed' | 'expired' | 'refunded';
  amountUsdCents: bigint;
  amountIdr: number;
  feeIdr: number;
  fxRate: number;
  channel: string;
  referenceId: string;
  idempotencyKey: string;
  expiresAt?: string;
}

/**
 * Issues a server-side PENDING top-up order with a required idempotency key.
 * Wallet balance is NEVER credited by the browser; balance updates occur only
 * after a verified payment gateway webhook settles the order server-side (AGENTS.md Rule 2 & 5).
 */
export function useTopUpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: TopUpParams): Promise<PendingTopUpOrder> => {
      const money = Money.fromDecimal(params.amountUsd, 'USD');
      if (!money.isPositive()) {
        throw new Error('Nominal isi saldo harus lebih besar dari $0.00.');
      }
      if (!params.idempotencyKey || !params.idempotencyKey.trim()) {
        throw new Error('Idempotency key wajib disertakan.');
      }

      const res = await fetch('/api/top-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountUsdCents: money.amount.toString(),
          method: params.method,
          channel: params.channel,
          idempotencyKey: params.idempotencyKey,
          fxRate: params.fxRate,
        }),
      });

      const payload = await res.json();
      if (!res.ok || !payload?.order) {
        throw new Error(payload?.error || 'Gagal menerbitkan tagihan isi saldo.');
      }

      const order = payload.order;
      return {
        id: order.id,
        status: order.status,
        amountUsdCents: BigInt(order.amountUsdCents),
        amountIdr: Number(order.amountIdr),
        feeIdr: Number(order.feeIdr),
        fxRate: Number(order.fxRate),
        channel: order.channel,
        referenceId: order.referenceId,
        idempotencyKey: order.idempotencyKey,
        expiresAt: order.expiresAt,
      };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
