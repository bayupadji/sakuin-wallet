import { AppendOnlyLedger, LedgerTransactionRecord } from '@/shared/domain/ledger';

export function getWebhookSecret(): string {
  const secret = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('PAYMENT_GATEWAY_WEBHOOK_SECRET environment variable is required in production.');
    }
    return 'sakuin-dev-gateway-webhook-hmac-secret';
  }
  return secret;
}

const globalForLedger = globalThis as unknown as {
  __sakuinServerLedger?: AppendOnlyLedger;
};

export const serverLedger: AppendOnlyLedger =
  globalForLedger.__sakuinServerLedger ?? (globalForLedger.__sakuinServerLedger = new AppendOnlyLedger());

export function formatWibTimestamp(utcIso: string): string {
  const normalized = utcIso.replace(' UTC', 'Z').replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return utcIso;

  return (
    date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' WIB'
  );
}

export interface SerializedTransaction {
  id: string;
  title: string;
  merchant: string;
  type: 'topup' | 'card' | 'receive';
  category: string;
  status: 'pending' | 'success' | 'failed' | 'expired' | 'refunded';
  amountUsdCents: string;
  amountIdr: number;
  fxRate: number;
  feeIdr: number;
  channel: string;
  referenceId: string;
  idempotencyKey: string;
  ledgerSequence: string;
  timestampUtc: string;
  timestampWib: string;
  expiresAt?: string;
}

export function serializeLedgerTransaction(tx: LedgerTransactionRecord): SerializedTransaction {
  return {
    id: tx.id,
    title: tx.title,
    merchant: tx.merchant,
    type: tx.type,
    category: tx.category,
    status: tx.status,
    amountUsdCents: tx.amountUsdCents.toString(),
    amountIdr: tx.amountIdr,
    fxRate: tx.fxRate,
    feeIdr: tx.feeIdr,
    channel: tx.channel,
    referenceId: tx.referenceId,
    idempotencyKey: tx.idempotencyKey,
    ledgerSequence: tx.ledgerSequence,
    timestampUtc: tx.timestampUtc,
    timestampWib: formatWibTimestamp(tx.timestampUtc),
    expiresAt: tx.expiresAt,
  };
}

