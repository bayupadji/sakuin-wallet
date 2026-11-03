import { InvalidMoneyAmountError } from './errors';

export type LedgerTransactionType = 'topup' | 'card' | 'receive';
export type LedgerTransactionStatus = 'pending' | 'success' | 'failed' | 'expired' | 'refunded';

export interface FeeConfigRule {
  code: string;
  feeType: 'flat_idr' | 'bps';
  feeValue: number;
}

// TODO(decision): Final top-up & transaction fee amounts pending product sign-off (AGENTS.md Section 13).
export const DEFAULT_FEE_RULES: Record<'va' | 'qris', FeeConfigRule> = {
  va: { code: 'topup_va', feeType: 'flat_idr', feeValue: 4500 },
  qris: { code: 'topup_qris', feeType: 'bps', feeValue: 70 },
};

export function calculateFeeIdr(subtotalIdr: number, rule: FeeConfigRule): number {
  if (!Number.isFinite(subtotalIdr) || subtotalIdr <= 0) return 0;
  if (rule.feeType === 'flat_idr') {
    return Math.max(0, Math.round(rule.feeValue));
  }
  return Math.max(0, Math.round((subtotalIdr * rule.feeValue) / 10_000));
}

export interface LedgerEntryRecord {
  readonly id: string;
  readonly sequenceNo: number;
  readonly userId: string;
  readonly transactionId: string;
  readonly entryType: 'credit' | 'debit';
  readonly amountCents: bigint;
  readonly balanceAfterCents: bigint;
  readonly idempotencyKey: string;
  readonly createdAt: string;
}

export interface LedgerTransactionRecord {
  id: string;
  userId: string;
  title: string;
  merchant: string;
  type: LedgerTransactionType;
  category: string;
  status: LedgerTransactionStatus;
  amountUsdCents: bigint;
  amountIdr: number;
  fxRate: number;
  feeIdr: number;
  channel: string;
  referenceId: string;
  idempotencyKey: string;
  ledgerSequence: string;
  payerName?: string;
  paymentSource?: string;
  expiresAt?: string;
  timestampUtc: string;
}

export interface CreatePendingOrderInput {
  userId: string;
  title: string;
  merchant: string;
  type: LedgerTransactionType;
  category: string;
  amountUsdCents: bigint;
  amountIdr: number;
  fxRate: number;
  feeIdr: number;
  channel: string;
  referenceId: string;
  idempotencyKey: string;
  expiresAt?: string;
  now?: Date;
}

export interface SettleWebhookInput {
  transactionId: string;
  webhookIdempotencyKey: string;
  payerName?: string;
  paymentSource?: string;
  now?: Date;
}

/**
 * Append-only double-entry ledger engine enforcing AGENTS.md Section 6 money invariants:
 * - Integer cents (bigint) only
 * - Pending orders never change balance
 * - Only verified settlements append ledger entries and derive balance
 * - Idempotency keys deduplicate orders and webhook deliveries
 * - Per-user strict isolation
 */
export class AppendOnlyLedger {
  private readonly entries: LedgerEntryRecord[] = [];
  private readonly entryByIdempKey = new Map<string, LedgerEntryRecord>();
  private readonly txById = new Map<string, LedgerTransactionRecord>();
  private readonly txByIdempKey = new Map<string, LedgerTransactionRecord>();
  private seqCounter = 0;

  createPendingOrder(input: CreatePendingOrderInput): LedgerTransactionRecord {
    if (!input.userId || !input.userId.trim()) {
      throw new Error('userId is required');
    }
    if (!input.idempotencyKey || !input.idempotencyKey.trim()) {
      throw new Error('idempotencyKey is required');
    }
    if (input.amountUsdCents <= 0n) {
      throw new InvalidMoneyAmountError('Order amount must be greater than zero cents');
    }

    const existing = this.txByIdempKey.get(input.idempotencyKey);
    if (existing) {
      if (existing.userId !== input.userId) {
        throw new Error('Idempotency key collision across different users');
      }
      return { ...existing };
    }

    const now = input.now ?? new Date();
    const record: LedgerTransactionRecord = {
      id: `tx-${now.getTime()}-${this.txById.size + 1}`,
      userId: input.userId,
      title: input.title,
      merchant: input.merchant,
      type: input.type,
      category: input.category,
      status: 'pending',
      amountUsdCents: input.amountUsdCents,
      amountIdr: Math.round(input.amountIdr),
      fxRate: input.fxRate,
      feeIdr: Math.round(input.feeIdr),
      channel: input.channel,
      referenceId: input.referenceId,
      idempotencyKey: input.idempotencyKey,
      ledgerSequence: 'LDG-PENDING',
      expiresAt: input.expiresAt,
      timestampUtc: now.toISOString(),
    };

    this.txById.set(record.id, record);
    this.txByIdempKey.set(record.idempotencyKey, record);
    return { ...record };
  }

  settlePendingOrder(input: SettleWebhookInput): {
    alreadySettled: boolean;
    transaction: LedgerTransactionRecord;
    entry: LedgerEntryRecord;
    balanceCents: bigint;
  } {
    if (!input.webhookIdempotencyKey || !input.webhookIdempotencyKey.trim()) {
      throw new Error('webhookIdempotencyKey is required');
    }

    const tx = this.txById.get(input.transactionId);
    if (!tx) {
      throw new Error(`Transaction ${input.transactionId} not found`);
    }

    const existingEntry = this.entryByIdempKey.get(input.webhookIdempotencyKey);
    if (existingEntry) {
      return {
        alreadySettled: true,
        transaction: { ...tx },
        entry: existingEntry,
        balanceCents: this.getWalletBalanceCents(tx.userId),
      };
    }

    if (tx.status === 'success') {
      const prior = this.entries.find((e) => e.transactionId === tx.id);
      if (!prior) {
        throw new Error('Corrupt state: settled transaction missing ledger entry');
      }
      return {
        alreadySettled: true,
        transaction: { ...tx },
        entry: prior,
        balanceCents: this.getWalletBalanceCents(tx.userId),
      };
    }

    if (tx.status !== 'pending') {
      throw new Error(`Cannot settle transaction in status ${tx.status}`);
    }

    const now = input.now ?? new Date();
    if (tx.expiresAt && new Date(tx.expiresAt).getTime() < now.getTime()) {
      tx.status = 'expired';
      throw new Error(`Transaction ${tx.id} has expired`);
    }

    const currentBalance = this.getWalletBalanceCents(tx.userId);
    const entryType: 'credit' | 'debit' = tx.type === 'card' ? 'debit' : 'credit';

    if (entryType === 'debit' && currentBalance < tx.amountUsdCents) {
      tx.status = 'failed';
      throw new InvalidMoneyAmountError('Insufficient balance for debit settlement');
    }

    const nextBalance =
      entryType === 'credit'
        ? currentBalance + tx.amountUsdCents
        : currentBalance - tx.amountUsdCents;

    this.seqCounter += 1;
    const ledgerCode = `LDG-${now.getUTCFullYear()}-${String(this.seqCounter).padStart(6, '0')}`;

    const entry: LedgerEntryRecord = Object.freeze({
      id: `ldg-${this.seqCounter}`,
      sequenceNo: this.seqCounter,
      userId: tx.userId,
      transactionId: tx.id,
      entryType,
      amountCents: tx.amountUsdCents,
      balanceAfterCents: nextBalance,
      idempotencyKey: input.webhookIdempotencyKey,
      createdAt: now.toISOString(),
    });

    this.entries.push(entry);
    this.entryByIdempKey.set(entry.idempotencyKey, entry);

    tx.status = 'success';
    tx.ledgerSequence = ledgerCode;
    if (input.payerName) tx.payerName = input.payerName;
    if (input.paymentSource) tx.paymentSource = input.paymentSource;

    return {
      alreadySettled: false,
      transaction: { ...tx },
      entry,
      balanceCents: nextBalance,
    };
  }

  getWalletBalanceCents(userId: string): bigint {
    let total = 0n;
    for (const entry of this.entries) {
      if (entry.userId !== userId) continue;
      if (entry.entryType === 'credit') {
        total += entry.amountCents;
      } else {
        total -= entry.amountCents;
      }
    }
    return total;
  }

  reconcileUserBalance(userId: string): { balanced: boolean; derivedCents: bigint; lastSnapshotCents: bigint } {
    const derivedCents = this.getWalletBalanceCents(userId);
    let lastSnapshotCents = 0n;
    for (let i = this.entries.length - 1; i >= 0; i--) {
      if (this.entries[i].userId === userId) {
        lastSnapshotCents = this.entries[i].balanceAfterCents;
        break;
      }
    }
    return {
      balanced: derivedCents === lastSnapshotCents,
      derivedCents,
      lastSnapshotCents,
    };
  }

  getUserTransactions(userId: string): LedgerTransactionRecord[] {
    if (!userId) return [];
    const list: LedgerTransactionRecord[] = [];
    for (const tx of this.txById.values()) {
      if (tx.userId === userId) {
        list.push({ ...tx });
      }
    }
    return list.sort(
      (a, b) => new Date(b.timestampUtc).getTime() - new Date(a.timestampUtc).getTime()
    );
  }

  getLedgerEntries(userId: string): readonly LedgerEntryRecord[] {
    return this.entries.filter((e) => e.userId === userId);
  }
}

function timingSafeHexCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function signGatewayWebhookPayload(rawBody: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyGatewayWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  secret: string
): Promise<boolean> {
  if (!signatureHeader || !secret) return false;
  const normalizedSig = signatureHeader.trim().replace(/^sha256=/i, '').toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(normalizedSig)) return false;

  const expected = await signGatewayWebhookPayload(rawBody, secret);
  return timingSafeHexCompare(normalizedSig, expected.toLowerCase());
}

