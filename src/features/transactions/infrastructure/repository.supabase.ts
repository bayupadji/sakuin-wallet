import { createClient } from '@/shared/infrastructure/supabase/client';
import { config } from '@/shared/config';
import { TransactionItem } from '../domain/entities/transaction';
import {
  TransactionRepository,
  TransactionFilter,
  CreateTransactionParams,
} from '../domain/repository';
import { SEED_TRANSACTIONS } from './seed';

let inMemoryTransactions = [...SEED_TRANSACTIONS];

export class TransactionSupabaseRepository implements TransactionRepository {
  private _client?: ReturnType<typeof createClient>;

  private get client() {
    if (!this._client) {
      this._client = createClient();
    }
    return this._client;
  }

  async getTransactions(filter?: TransactionFilter): Promise<TransactionItem[]> {
    if (!config.supabase.isConfigured) {
      return this.filterInMemory(filter);
    }
    try {
      const { data, error } = await this.client
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error || !data || data.length === 0) {
        return this.filterInMemory(filter);
      }
      return this.filterInMemory(filter);
    } catch {
      return this.filterInMemory(filter);
    }
  }

  async createTransaction(params: CreateTransactionParams): Promise<TransactionItem> {
    const newTx: TransactionItem = {
      id: `tx-${Date.now()}`,
      title: params.title,
      merchant: params.merchant,
      type: params.type,
      category: params.category,
      status: params.status,
      amountUsdCents: params.amountUsdCents,
      amountIdr: params.amountIdr,
      fxRate: params.fxRate,
      feeIdr: params.feeIdr,
      channel: params.channel,
      referenceId: params.referenceId,
      idempotencyKey: params.idempotencyKey,
      ledgerSequence: `LDG-2026-${String(inMemoryTransactions.length + 1).padStart(5, '0')}`,
      timestampUtc: new Date().toISOString(),
      timestampWib: 'Baru saja',
    };

    inMemoryTransactions = [newTx, ...inMemoryTransactions];

    if (config.supabase.isConfigured) {
      try {
        await this.client.from('audit_logs').insert({
          action: `TRANSACTION_${params.type.toUpperCase()}`,
          entity: 'transaction',
          entity_id: newTx.id,
          after_state: { amountUsdCents: Number(params.amountUsdCents), channel: params.channel },
        });
      } catch {
        // Offline fallback continues
      }
    }

    return newTx;
  }

  private filterInMemory(filter?: TransactionFilter): TransactionItem[] {
    let result = inMemoryTransactions;

    // Batasi transaksi maksimal 1 tahun ke belakang (12 bulan dari awal bulan tahun lalu)
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    result = result.filter((tx) => {
      const normalizedIso = tx.timestampUtc.replace(' UTC', 'Z').replace(' ', 'T');
      const txDate = new Date(normalizedIso);
      return !isNaN(txDate.getTime()) ? txDate >= oneYearAgo : true;
    });

    if (filter?.type && filter.type !== 'all') {
      result = result.filter((tx) => tx.type === filter.type);
    }
    if (filter?.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.title.toLowerCase().includes(q) ||
          tx.merchant.toLowerCase().includes(q) ||
          tx.referenceId.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q)
      );
    }
    if (filter?.month && filter.month !== 'all') {
      result = result.filter((tx) => tx.timestampUtc.startsWith(filter.month!));
    }
    return result;
  }
}
