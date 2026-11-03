import { describe, it, expect } from 'vitest';
import {
  AppendOnlyLedger,
  calculateFeeIdr,
  DEFAULT_FEE_RULES,
  signGatewayWebhookPayload,
  verifyGatewayWebhookSignature,
} from '@/shared/domain/ledger';
import { createSeedUser } from '@/features/auth/infrastructure/seed';

describe('AppendOnlyLedger & Gateway Webhook Settlement Invariants', () => {
  it('does NOT credit wallet balance when a pending top-up order is created', () => {
    const ledger = new AppendOnlyLedger();
    const order = ledger.createPendingOrder({
      userId: 'user-alice',
      title: 'Top Up Saldo USD',
      merchant: 'BCA Virtual Account',
      type: 'topup',
      category: 'Deposit Saldo',
      amountUsdCents: 10000n,
      amountIdr: 1629500,
      fxRate: 16250,
      feeIdr: 4500,
      channel: 'BCA Virtual Account',
      referenceId: 'REF-ALICE-01',
      idempotencyKey: 'idemp_order_alice_01',
    });

    expect(order.status).toBe('pending');
    expect(order.ledgerSequence).toBe('LDG-PENDING');
    expect(ledger.getWalletBalanceCents('user-alice')).toBe(0n);
    expect(ledger.getLedgerEntries('user-alice').length).toBe(0);
  });

  it('deduplicates repeated order creation with the same idempotencyKey', () => {
    const ledger = new AppendOnlyLedger();
    const first = ledger.createPendingOrder({
      userId: 'user-alice',
      title: 'Top Up Saldo USD',
      merchant: 'QRIS Dinamis',
      type: 'topup',
      category: 'Deposit Saldo',
      amountUsdCents: 5000n,
      amountIdr: 818188,
      fxRate: 16250,
      feeIdr: calculateFeeIdr(812500, DEFAULT_FEE_RULES.qris),
      channel: 'QRIS Dinamis',
      referenceId: 'REF-ALICE-02',
      idempotencyKey: 'idemp_retry_same_key',
    });

    const retry = ledger.createPendingOrder({
      userId: 'user-alice',
      title: 'Top Up Saldo USD',
      merchant: 'QRIS Dinamis',
      type: 'topup',
      category: 'Deposit Saldo',
      amountUsdCents: 5000n,
      amountIdr: 818188,
      fxRate: 16250,
      feeIdr: calculateFeeIdr(812500, DEFAULT_FEE_RULES.qris),
      channel: 'QRIS Dinamis',
      referenceId: 'REF-ALICE-02-RETRY',
      idempotencyKey: 'idemp_retry_same_key',
    });

    expect(retry.id).toBe(first.id);
    expect(ledger.getUserTransactions('user-alice').length).toBe(1);
  });

  it('verifies HMAC-SHA256 gateway webhook signatures and rejects tampering', async () => {
    const secret = 'whsec_test_gateway_secret_key_2026';
    const rawBody = JSON.stringify({
      transactionId: 'tx-100',
      eventId: 'evt-001',
      status: 'PAID',
      paidAmountIdr: 1629500,
    });

    const validSig = await signGatewayWebhookPayload(rawBody, secret);
    expect(await verifyGatewayWebhookSignature(rawBody, validSig, secret)).toBe(true);
    expect(await verifyGatewayWebhookSignature(rawBody, `sha256=${validSig}`, secret)).toBe(true);

    const tamperedBody = JSON.stringify({
      transactionId: 'tx-100',
      eventId: 'evt-001',
      status: 'PAID',
      paidAmountIdr: 99999999,
    });
    expect(await verifyGatewayWebhookSignature(tamperedBody, validSig, secret)).toBe(false);
    expect(await verifyGatewayWebhookSignature(rawBody, null, secret)).toBe(false);
    expect(await verifyGatewayWebhookSignature(rawBody, 'invalid-hex', secret)).toBe(false);
  });

  it('credits owning account exactly once on double webhook delivery and supports third-party payer names', () => {
    const ledger = new AppendOnlyLedger();
    const order = ledger.createPendingOrder({
      userId: 'user-owner',
      title: 'Top Up Saldo USD',
      merchant: 'Mandiri Virtual Account',
      type: 'topup',
      category: 'Deposit Saldo',
      amountUsdCents: 25000n,
      amountIdr: 4067000,
      fxRate: 16250,
      feeIdr: 4500,
      channel: 'Mandiri Virtual Account',
      referenceId: 'REF-OWNER-01',
      idempotencyKey: 'idemp_owner_order_01',
    });

    // Different payer name still credits user-owner (AGENTS.md Section 6 Rule 13)
    const firstSettlement = ledger.settlePendingOrder({
      transactionId: order.id,
      webhookIdempotencyKey: 'wh_evt_1001',
      payerName: 'PT Klien Pembayar Berbeda',
      paymentSource: 'Mandiri Corporate VA',
    });

    expect(firstSettlement.alreadySettled).toBe(false);
    expect(firstSettlement.balanceCents).toBe(25000n);
    expect(firstSettlement.transaction.status).toBe('success');
    expect(firstSettlement.transaction.payerName).toBe('PT Klien Pembayar Berbeda');
    expect(Object.isFrozen(firstSettlement.entry)).toBe(true);

    // Duplicate webhook with same webhookIdempotencyKey
    const duplicateSameEvent = ledger.settlePendingOrder({
      transactionId: order.id,
      webhookIdempotencyKey: 'wh_evt_1001',
    });
    expect(duplicateSameEvent.alreadySettled).toBe(true);
    expect(ledger.getWalletBalanceCents('user-owner')).toBe(25000n);

    // Duplicate webhook with different event key for already-settled transaction
    const duplicateNewEvent = ledger.settlePendingOrder({
      transactionId: order.id,
      webhookIdempotencyKey: 'wh_evt_1002',
    });
    expect(duplicateNewEvent.alreadySettled).toBe(true);
    expect(ledger.getWalletBalanceCents('user-owner')).toBe(25000n);
    expect(ledger.getLedgerEntries('user-owner').length).toBe(1);
  });

  it('rejects settlement after order expiry without crediting balance', () => {
    const ledger = new AppendOnlyLedger();
    const createdAt = new Date('2026-10-01T10:00:00Z');
    const expiresAt = new Date('2026-10-01T10:15:00Z').toISOString();

    const order = ledger.createPendingOrder({
      userId: 'user-late',
      title: 'Top Up Saldo USD',
      merchant: 'QRIS Dinamis',
      type: 'topup',
      category: 'Deposit Saldo',
      amountUsdCents: 10000n,
      amountIdr: 1636375,
      fxRate: 16250,
      feeIdr: 11375,
      channel: 'QRIS Dinamis',
      referenceId: 'REF-LATE-01',
      idempotencyKey: 'idemp_late_01',
      expiresAt,
      now: createdAt,
    });

    expect(() =>
      ledger.settlePendingOrder({
        transactionId: order.id,
        webhookIdempotencyKey: 'wh_late_01',
        now: new Date('2026-10-01T10:16:00Z'),
      })
    ).toThrow(/expired/i);

    expect(ledger.getWalletBalanceCents('user-late')).toBe(0n);
    expect(ledger.getUserTransactions('user-late')[0].status).toBe('expired');
  });

  it('passes ledger reconciliation check and isolates balances across users', () => {
    const ledger = new AppendOnlyLedger();

    const topupA = ledger.createPendingOrder({
      userId: 'user-a',
      title: 'Top Up A',
      merchant: 'BCA VA',
      type: 'topup',
      category: 'Deposit',
      amountUsdCents: 50000n,
      amountIdr: 8129500,
      fxRate: 16250,
      feeIdr: 4500,
      channel: 'BCA VA',
      referenceId: 'REF-A-1',
      idempotencyKey: 'idemp_a_1',
    });
    ledger.settlePendingOrder({
      transactionId: topupA.id,
      webhookIdempotencyKey: 'wh_a_1',
    });

    const spendA = ledger.createPendingOrder({
      userId: 'user-a',
      title: 'OpenAI API',
      merchant: 'OpenAI',
      type: 'card',
      category: 'SaaS',
      amountUsdCents: 2000n,
      amountIdr: 325000,
      fxRate: 16250,
      feeIdr: 0,
      channel: 'VISA Virtual',
      referenceId: 'REF-A-2',
      idempotencyKey: 'idemp_a_2',
    });
    ledger.settlePendingOrder({
      transactionId: spendA.id,
      webhookIdempotencyKey: 'wh_a_2',
    });

    const reconA = ledger.reconcileUserBalance('user-a');
    expect(reconA.balanced).toBe(true);
    expect(reconA.derivedCents).toBe(48000n);
    expect(reconA.lastSnapshotCents).toBe(48000n);

    // User B sees zero balance and zero transactions from User A
    expect(ledger.getWalletBalanceCents('user-b')).toBe(0n);
    expect(ledger.getUserTransactions('user-b')).toEqual([]);
  });
});

describe('Auth Seed Privilege Escalation Prevention', () => {
  it('never grants admin role to arbitrary emails containing "admin" or "kyc"', () => {
    expect(createSeedUser('myadmin@gmail.com').role).toBe('customer');
    expect(createSeedUser('kyc-attacker@outlook.com').role).toBe('customer');
    expect(createSeedUser('admin@sakuin.co.id').role).toBe('super_admin');
    expect(createSeedUser('compliance@sakuin.co.id').role).toBe('kyc_reviewer');

    // Different customers get distinct deterministic IDs
    const u1 = createSeedUser('rina@example.com');
    const u2 = createSeedUser('budi@example.com');
    expect(u1.id).not.toBe(u2.id);
  });
});

