import { describe, it, expect } from 'vitest';
import { TransactionSupabaseRepository } from './infrastructure/repository.supabase';
import { CardSupabaseRepository } from '../card/infrastructure/repository.supabase';

describe('TransactionSupabaseRepository', () => {
  it('returns seeded transactions by default', async () => {
    const repo = new TransactionSupabaseRepository();
    const transactions = await repo.getTransactions();
    expect(transactions.length).toBeGreaterThanOrEqual(4);
  });

  it('filters transactions by type', async () => {
    const repo = new TransactionSupabaseRepository();
    const cardOnly = await repo.getTransactions({ type: 'card' });
    expect(cardOnly.every((t) => t.type === 'card')).toBe(true);
    expect(cardOnly.length).toBeGreaterThanOrEqual(3);
  });

  it('filters transactions by search query', async () => {
    const repo = new TransactionSupabaseRepository();
    const results = await repo.getTransactions({ search: 'AWS' });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].title).toContain('AWS');
  });

  it('filters transactions by month period', async () => {
    const repo = new TransactionSupabaseRepository();
    const octTransactions = await repo.getTransactions({ month: '2026-10' });
    expect(octTransactions.length).toBeGreaterThanOrEqual(1);
    expect(octTransactions.every((tx) => tx.timestampUtc.startsWith('2026-10'))).toBe(true);

    const sepTransactions = await repo.getTransactions({ month: '2026-09' });
    expect(sepTransactions.length).toBeGreaterThanOrEqual(1);
    expect(sepTransactions.every((tx) => tx.timestampUtc.startsWith('2026-09'))).toBe(true);
  });

  it('limits all transactions to a maximum of 1 year in the past', async () => {
    const repo = new TransactionSupabaseRepository();
    const all = await repo.getTransactions({ month: 'all' });
    // Pastikan transaksi arsip dari 2024 tidak ada di hasil
    expect(all.some((tx) => tx.id === 'tx-archive-old')).toBe(false);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setDate(1);

    expect(
      all.every((tx) => {
        const txDate = new Date(tx.timestampUtc.replace(' UTC', 'Z').replace(' ', 'T'));
        return txDate >= oneYearAgo;
      })
    ).toBe(true);
  });

  it('creates and prepends a new transaction', async () => {
    const repo = new TransactionSupabaseRepository();
    const created = await repo.createTransaction({
      title: 'Top Up Test',
      merchant: 'PT Bank Central Asia Tbk',
      type: 'topup',
      category: 'Deposit Saldo',
      status: 'success',
      amountUsdCents: 10000n,
      amountIdr: 1625000,
      fxRate: 16250,
      feeIdr: 0,
      channel: 'BCA VA',
      referenceId: 'REF-TEST-001',
      idempotencyKey: 'idemp_test_001',
    });

    expect(created.id).toBeDefined();
    expect(created.amountUsdCents).toBe(10000n);

    const all = await repo.getTransactions();
    expect(all[0].id).toBe(created.id);
  });
});

describe('CardSupabaseRepository', () => {
  it('returns card details and supports freezing/unfreezing', async () => {
    const repo = new CardSupabaseRepository();
    const initial = await repo.getCardDetails();
    expect(initial.last4).toBe('4821');

    await repo.toggleFreezeCard(true);
    const frozen = await repo.getCardDetails();
    expect(frozen.isFrozen).toBe(true);

    await repo.toggleFreezeCard(false);
    const active = await repo.getCardDetails();
    expect(active.isFrozen).toBe(false);
  });

  it('updates card controls', async () => {
    const repo = new CardSupabaseRepository();
    const updated = await repo.updateCardControls({ onlineTransactions: false });
    expect(updated.onlineTransactions).toBe(false);
  });
});
