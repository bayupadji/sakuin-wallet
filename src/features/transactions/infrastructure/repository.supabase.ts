import { createClient } from '@/shared/infrastructure/supabase/client';
import { config } from '@/shared/config';
import { formatWibTimestamp } from '@/shared/infrastructure/ledger/server-ledger';
import { TransactionItem, TransactionStatus, TransactionType } from '../domain/entities/transaction';
import { TransactionRepository, TransactionFilter } from '../domain/repository';

interface TransactionRow {
  id: string;
  user_id: string;
  title: string;
  merchant: string;
  type: TransactionType;
  category: string;
  status: TransactionStatus;
  amount_usd_cents: number | string | bigint;
  amount_idr: number | string;
  fx_rate: number | string;
  fee_idr: number | string;
  channel: string;
  reference_id: string;
  idempotency_key: string;
  ledger_sequence: string;
  created_at: string;
}

function applyClientFilter(items: TransactionItem[], filter?: TransactionFilter): TransactionItem[] {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

  let result = items.filter((tx) => {
    const normalizedIso = tx.timestampUtc.replace(' UTC', 'Z').replace(' ', 'T');
    const txDate = new Date(normalizedIso);
    return !Number.isNaN(txDate.getTime()) ? txDate >= oneYearAgo : true;
  });

  if (filter?.type && filter.type !== 'all') {
    result = result.filter((tx) => tx.type === filter.type);
  }

  if (filter?.month && filter.month !== 'all') {
    result = result.filter((tx) => tx.timestampUtc.startsWith(filter.month!));
  }

  if (filter?.search && filter.search.trim() !== '') {
    const q = filter.search.toLowerCase();
    result = result.filter(
      (tx) =>
        tx.title.toLowerCase().includes(q) ||
        tx.merchant.toLowerCase().includes(q) ||
        tx.referenceId.toLowerCase().includes(q) ||
        tx.channel.toLowerCase().includes(q)
    );
  }

  return result;
}

export class TransactionSupabaseRepository implements TransactionRepository {
  private _client?: ReturnType<typeof createClient>;
  private readonly scopedFallback?: TransactionItem[];

  constructor(scopedFallback?: TransactionItem[]) {
    this.scopedFallback = scopedFallback ? [...scopedFallback] : undefined;
  }

  private get client() {
    if (!this._client) {
      this._client = createClient();
    }
    return this._client;
  }

  async getTransactions(filter?: TransactionFilter): Promise<TransactionItem[]> {
    // 1. In unit tests injected with an isolated per-user fixture, filter that isolated list only
    if (this.scopedFallback) {
      return applyClientFilter(this.scopedFallback, filter);
    }

    // 2. In browser runtime, fetch strictly authenticated user-scoped transactions via server API
    if (typeof window !== 'undefined') {
      const res = await fetch('/api/transactions');
      if (!res.ok) {
        if (res.status === 401) return [];
        throw new Error('Gagal memuat riwayat transaksi.');
      }
      const payload = await res.json();
      const mapped: TransactionItem[] = (payload?.transactions || []).map(
        (raw: Record<string, unknown>) => ({
          id: String(raw.id),
          title: String(raw.title),
          merchant: String(raw.merchant ?? ''),
          type: raw.type as TransactionType,
          category: String(raw.category ?? ''),
          status: raw.status as TransactionStatus,
          amountUsdCents: BigInt(String(raw.amountUsdCents ?? '0')),
          amountIdr: Number(raw.amountIdr ?? 0),
          fxRate: Number(raw.fxRate ?? 0),
          feeIdr: Number(raw.feeIdr ?? 0),
          channel: String(raw.channel ?? ''),
          referenceId: String(raw.referenceId ?? ''),
          idempotencyKey: String(raw.idempotencyKey ?? ''),
          ledgerSequence: String(raw.ledgerSequence ?? 'LDG-PENDING'),
          timestampUtc: String(raw.timestampUtc ?? ''),
          timestampWib: String(raw.timestampWib ?? ''),
        })
      );
      return applyClientFilter(mapped, filter);
    }

    // 3. Direct Supabase query when running server-side with explicit userId
    if (!config.supabase.isConfigured || !filter?.userId) {
      return [];
    }

    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString();

    const { data, error } = await this.client
      .from('transactions')
      .select('*')
      .eq('user_id', filter.userId)
      .gte('created_at', oneYearAgo)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !data) {
      return [];
    }

    const mapped: TransactionItem[] = (data as TransactionRow[]).map((row) => ({
      id: row.id,
      title: row.title,
      merchant: row.merchant,
      type: row.type,
      category: row.category,
      status: row.status,
      amountUsdCents: BigInt(row.amount_usd_cents),
      amountIdr: Number(row.amount_idr),
      fxRate: Number(row.fx_rate),
      feeIdr: Number(row.fee_idr),
      channel: row.channel,
      referenceId: row.reference_id,
      idempotencyKey: row.idempotency_key,
      ledgerSequence: row.ledger_sequence,
      timestampUtc: row.created_at,
      timestampWib: formatWibTimestamp(row.created_at),
    }));

    return applyClientFilter(mapped, filter);
  }
}
