import { createClient } from '@/shared/infrastructure/supabase/client';
import { config } from '@/shared/config';
import { TransactionItem } from '../domain/entities/transaction';
import {
  TransactionRepository,
  TransactionFilter,
  CreateTransactionParams,
} from '../domain/repository';

const SEED_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-01',
    title: 'Top Up via BCA Virtual Account',
    merchant: 'PT Bank Central Asia Tbk',
    type: 'topup',
    category: 'Deposit Saldo',
    status: 'success',
    amountUsdCents: 50000n,
    amountIdr: 8125000,
    fxRate: 16250,
    feeIdr: 0,
    channel: 'BCA VA (*8924)',
    referenceId: 'REF-BCA-9812739182390',
    idempotencyKey: 'idemp_topup_500_00',
    ledgerSequence: 'LDG-2026-00891',
    timestampUtc: '2026-10-17 07:20:00 UTC',
    timestampWib: 'Hari ini, 14:20 WIB',
  },
  {
    id: 'tx-02',
    title: 'AWS Cloud Infrastructure',
    merchant: 'Amazon Web Services, Inc.',
    type: 'card',
    category: 'Cloud & Hosting',
    status: 'success',
    amountUsdCents: 8450n,
    amountIdr: 1373125,
    fxRate: 16250,
    feeIdr: 0,
    channel: 'VISA Platinum Virtual (*4821)',
    referenceId: 'REF-AWS-4829103948192',
    idempotencyKey: 'idemp_aws_bill_84_50',
    ledgerSequence: 'LDG-2026-00892',
    timestampUtc: '2026-10-16 02:15:00 UTC',
    timestampWib: 'Kemarin, 09:15 WIB',
  },
  {
    id: 'tx-03',
    title: 'GitHub Enterprise Subscription',
    merchant: 'GitHub Inc.',
    type: 'card',
    category: 'Software & Tools',
    status: 'success',
    amountUsdCents: 2100n,
    amountIdr: 341250,
    fxRate: 16250,
    feeIdr: 0,
    channel: 'VISA Platinum Virtual (*4821)',
    referenceId: 'REF-GH-1029384756102',
    idempotencyKey: 'idemp_gh_sub_21_00',
    ledgerSequence: 'LDG-2026-00893',
    timestampUtc: '2026-10-14 11:00:00 UTC',
    timestampWib: '14 Okt 2026, 18:00 WIB',
  },
  {
    id: 'tx-05',
    title: 'Figma Professional Team',
    merchant: 'Figma, Inc.',
    type: 'card',
    category: 'Design & Productivity',
    status: 'success',
    amountUsdCents: 1500n,
    amountIdr: 243750,
    fxRate: 16250,
    feeIdr: 0,
    channel: 'VISA Platinum Virtual (*4821)',
    referenceId: 'REF-FIG-9928172635412',
    idempotencyKey: 'idemp_fig_pro_15_00',
    ledgerSequence: 'LDG-2026-00895',
    timestampUtc: '2026-10-12 08:45:00 UTC',
    timestampWib: '12 Okt 2026, 15:45 WIB',
  },
  {
    id: 'tx-04',
    title: 'Pembayaran Diterima via QRIS',
    merchant: 'PT Solusi Teknologi Bersama',
    type: 'receive',
    category: 'Konversi Rupiah Masuk',
    status: 'success',
    amountUsdCents: 12000n,
    amountIdr: 1950000,
    fxRate: 16250,
    feeIdr: 13650,
    channel: 'QRIS Dynamic Merchant',
    referenceId: 'REF-QRS-8492019481023',
    idempotencyKey: 'idemp_qris_rec_120_00',
    ledgerSequence: 'LDG-2026-00894',
    timestampUtc: '2026-10-13 04:30:00 UTC',
    timestampWib: '13 Okt 2026, 11:30 WIB',
  },
];

let inMemoryTransactions = [...SEED_TRANSACTIONS];

export class TransactionSupabaseRepository implements TransactionRepository {
  private client = createClient();

  async getTransactions(filter?: TransactionFilter): Promise<TransactionItem[]> {
    if (!config.supabase.url) {
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

    if (config.supabase.url) {
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
    return result;
  }
}
