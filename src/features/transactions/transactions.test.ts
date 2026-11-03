import { describe, it, expect } from 'vitest';
import { TransactionItem } from './domain/entities/transaction';
import { TransactionSupabaseRepository } from './infrastructure/repository.supabase';
import { CardSupabaseRepository } from '../card/infrastructure/repository.supabase';

function makeIsoForOffsetMonths(offsetMonths: number): { iso: string; yearMonth: string } {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offsetMonths, 15, 10, 0, 0));
  const yearMonth = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  return { iso: d.toISOString(), yearMonth };
}

function buildUserFixture(): {
  items: TransactionItem[];
  currentMonth: string;
  previousMonth: string;
} {
  const curr = makeIsoForOffsetMonths(0);
  const prev = makeIsoForOffsetMonths(1);
  const archived = makeIsoForOffsetMonths(18);

  const items: TransactionItem[] = [
    {
      id: 'tx-1',
      title: 'AWS Cloud Services',
      merchant: 'Amazon Web Services',
      type: 'card',
      category: 'Cloud & SaaS',
      status: 'success',
      amountUsdCents: 2500n,
      amountIdr: 406250,
      fxRate: 16250,
      feeIdr: 0,
      channel: 'VISA Virtual (*4821)',
      referenceId: 'REF-AWS-01',
      idempotencyKey: 'idemp_aws_01',
      ledgerSequence: 'LDG-2026-000001',
      timestampUtc: curr.iso,
      timestampWib: '15 Okt, 17.00 WIB',
    },
    {
      id: 'tx-2',
      title: 'Top Up Saldo USD',
      merchant: 'BCA Virtual Account',
      type: 'topup',
      category: 'Deposit Saldo',
      status: 'success',
      amountUsdCents: 10000n,
      amountIdr: 1629500,
      fxRate: 16250,
      feeIdr: 4500,
      channel: 'BCA Virtual Account',
      referenceId: 'REF-TOPUP-01',
      idempotencyKey: 'idemp_topup_01',
      ledgerSequence: 'LDG-2026-000002',
      timestampUtc: prev.iso,
      timestampWib: '15 Sep, 17.00 WIB',
    },
    {
      id: 'tx-archive-old',
      title: 'Transaksi Arsip Lama',
      merchant: 'Old Merchant',
      type: 'card',
      category: 'Arsip',
      status: 'success',
      amountUsdCents: 500n,
      amountIdr: 80000,
      fxRate: 16000,
      feeIdr: 0,
      channel: 'VISA Virtual (*4821)',
      referenceId: 'REF-OLD-01',
      idempotencyKey: 'idemp_old_01',
      ledgerSequence: 'LDG-2024-000001',
      timestampUtc: archived.iso,
      timestampWib: 'Arsip WIB',
    },
  ];

  return { items, currentMonth: curr.yearMonth, previousMonth: prev.yearMonth };
}

describe('TransactionSupabaseRepository', () => {
  it('returns empty list by default when unauthenticated (no shared global seed leak)', async () => {
    const repo = new TransactionSupabaseRepository();
    const transactions = await repo.getTransactions();
    expect(transactions).toEqual([]);
  });

  it('filters isolated user transactions by type and search query', async () => {
    const { items } = buildUserFixture();
    const repo = new TransactionSupabaseRepository(items);

    const cardOnly = await repo.getTransactions({ type: 'card' });
    expect(cardOnly.every((t) => t.type === 'card')).toBe(true);
    expect(cardOnly.length).toBe(1);

    const searchAws = await repo.getTransactions({ search: 'AWS' });
    expect(searchAws.length).toBe(1);
    expect(searchAws[0].title).toContain('AWS');
  });

  it('filters transactions by month period and excludes items older than 12 months', async () => {
    const { items, currentMonth, previousMonth } = buildUserFixture();
    const repo = new TransactionSupabaseRepository(items);

    const currList = await repo.getTransactions({ month: currentMonth });
    expect(currList.length).toBe(1);
    expect(currList[0].timestampUtc.startsWith(currentMonth)).toBe(true);

    const prevList = await repo.getTransactions({ month: previousMonth });
    expect(prevList.length).toBe(1);
    expect(prevList[0].timestampUtc.startsWith(previousMonth)).toBe(true);

    const allRecent = await repo.getTransactions({ month: 'all' });
    expect(allRecent.some((tx) => tx.id === 'tx-archive-old')).toBe(false);
    expect(allRecent.length).toBe(2);
  });
});

describe('CardSupabaseRepository', () => {
  it('maintains per-instance card state without leaking across repository instances', async () => {
    const repoA = new CardSupabaseRepository();
    const repoB = new CardSupabaseRepository();

    const initial = await repoA.getCardDetails();
    expect(initial.last4).toBe('4821');
    expect(initial.cardholderName).toBe('Nasabah Sakuin');

    await repoA.toggleFreezeCard(true);
    expect((await repoA.getCardDetails()).isFrozen).toBe(true);
    expect((await repoB.getCardDetails()).isFrozen).toBe(false);

    const updated = await repoA.updateCardControls({
      onlineTransactions: false,
      monthlyLimit: 3200,
    });
    expect(updated.onlineTransactions).toBe(false);
    expect(updated.monthlyLimit).toBe(3200);
  });
});
