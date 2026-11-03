import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/shared/config';
import {
  SESSION_COOKIE_NAME,
  verifySessionCookie,
} from '@/shared/infrastructure/auth/session';
import { createAdminSupabaseClient } from '@/shared/infrastructure/supabase/server';
import { getOrLockServerFxRate } from '@/shared/infrastructure/fx/server-rate-lock';
import {
  DEFAULT_FEE_RULES,
  FeeConfigRule,
  calculateFeeIdr,
} from '@/shared/domain/ledger';
import {
  formatWibTimestamp,
  serializeLedgerTransaction,
  serverLedger,
} from '@/shared/infrastructure/ledger/server-ledger';

async function loadFeeRule(method: 'va' | 'qris'): Promise<FeeConfigRule> {
  const code = method === 'qris' ? 'topup_qris' : 'topup_va';
  if (config.supabase.isConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = createAdminSupabaseClient();
      const { data } = await admin
        .from('fee_config')
        .select('code, fee_type, fee_value')
        .eq('code', code)
        .maybeSingle();

      if (data) {
        return {
          code: data.code,
          feeType: data.fee_type as 'flat_idr' | 'bps',
          feeValue: Number(data.fee_value),
        };
      }
    } catch {
      // Fallback to default fee config rule
    }
  }
  return DEFAULT_FEE_RULES[method];
}

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionCookie(cookie);

    if (!session.valid) {
      return NextResponse.json({ error: 'Sesi berakhir. Silakan masuk kembali.' }, { status: 401 });
    }

    const body = await request.json();
    const idempotencyKey = typeof body?.idempotencyKey === 'string' ? body.idempotencyKey.trim() : '';
    const channel = typeof body?.channel === 'string' ? body.channel.trim() : '';
    const method: 'va' | 'qris' = body?.method === 'qris' ? 'qris' : 'va';
    const rawCents = body?.amountUsdCents;

    if (!idempotencyKey) {
      return NextResponse.json({ error: 'Idempotency key wajib disertakan.' }, { status: 400 });
    }

    let amountUsdCents: bigint;
    try {
      amountUsdCents = BigInt(rawCents);
    } catch {
      return NextResponse.json({ error: 'Nominal sen USD tidak valid.' }, { status: 400 });
    }

    if (amountUsdCents <= 0n) {
      return NextResponse.json({ error: 'Nominal isi saldo harus lebih dari $0.00.' }, { status: 400 });
    }

    const userId = session.payload.userId;

    // Resolve server-locked Wise FX rate (15-min lock, no margin)
    let fxRate = 16250;
    let lockedUntilMs = Date.now() + 15 * 60 * 1000;
    try {
      const lockedFx = await getOrLockServerFxRate();
      fxRate = lockedFx.rate;
      lockedUntilMs = lockedFx.lockedUntil;
    } catch {
      if (typeof body?.fxRate === 'number' && body.fxRate > 0) {
        fxRate = body.fxRate;
      }
    }

    const amountUsdNumber = Number(amountUsdCents) / 100;
    const subtotalIdr = Math.round(amountUsdNumber * fxRate);
    const feeRule = await loadFeeRule(method);
    const feeIdr = calculateFeeIdr(subtotalIdr, feeRule);
    const expiresAt = new Date(lockedUntilMs).toISOString();
    const referenceId = `REF-TOPUP-${idempotencyKey.slice(-12).toUpperCase()}`;
    const resolvedChannel = channel || (method === 'qris' ? 'QRIS Dinamis' : 'Virtual Account');
    const merchant = method === 'qris' ? 'Mitra QRIS PJP 1' : 'Virtual Account Perbankan';

    if (config.supabase.isConfigured && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminSupabaseClient();

      // Enforce KYC approved before top-up (AGENTS.md Section 7)
      const { data: latestKyc } = await admin
        .from('kyc_submissions')
        .select('status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!latestKyc || latestKyc.status !== 'approved') {
        return NextResponse.json(
          { error: 'Verifikasi KTP harus disetujui admin sebelum melakukan isi saldo.' },
          { status: 403 }
        );
      }

      // Idempotency lookup
      const { data: existing } = await admin
        .from('transactions')
        .select('*')
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();

      if (existing) {
        if (existing.user_id !== userId) {
          return NextResponse.json({ error: 'Konflik idempotency key.' }, { status: 409 });
        }
        return NextResponse.json({
          order: {
            id: existing.id,
            title: existing.title,
            merchant: existing.merchant,
            type: existing.type,
            category: existing.category,
            status: existing.status,
            amountUsdCents: String(existing.amount_usd_cents),
            amountIdr: Number(existing.amount_idr),
            fxRate: Number(existing.fx_rate),
            feeIdr: Number(existing.fee_idr),
            channel: existing.channel,
            referenceId: existing.reference_id,
            idempotencyKey: existing.idempotency_key,
            ledgerSequence: existing.ledger_sequence,
            timestampUtc: existing.created_at,
            timestampWib: formatWibTimestamp(existing.created_at),
            expiresAt: existing.expires_at,
          },
        });
      }

      const { data: inserted, error } = await admin
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'topup',
          status: 'pending',
          title: `Top Up via ${resolvedChannel}`,
          merchant,
          category: 'Deposit Saldo',
          amount_usd_cents: Number(amountUsdCents),
          amount_idr: subtotalIdr,
          fx_rate: fxRate,
          fee_idr: feeIdr,
          channel: resolvedChannel,
          reference_id: referenceId,
          idempotency_key: idempotencyKey,
          ledger_sequence: 'LDG-PENDING',
          expires_at: expiresAt,
        })
        .select('*')
        .single();

      if (error || !inserted) {
        return NextResponse.json(
          { error: error?.message || 'Gagal menerbitkan tagihan top-up.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        order: {
          id: inserted.id,
          title: inserted.title,
          merchant: inserted.merchant,
          type: inserted.type,
          category: inserted.category,
          status: inserted.status,
          amountUsdCents: String(inserted.amount_usd_cents),
          amountIdr: Number(inserted.amount_idr),
          fxRate: Number(inserted.fx_rate),
          feeIdr: Number(inserted.fee_idr),
          channel: inserted.channel,
          referenceId: inserted.reference_id,
          idempotencyKey: inserted.idempotency_key,
          ledgerSequence: inserted.ledger_sequence,
          timestampUtc: inserted.created_at,
          timestampWib: formatWibTimestamp(inserted.created_at),
          expiresAt: inserted.expires_at,
        },
      });
    }

    const pendingOrder = serverLedger.createPendingOrder({
      userId,
      title: `Top Up via ${resolvedChannel}`,
      merchant,
      type: 'topup',
      category: 'Deposit Saldo',
      amountUsdCents,
      amountIdr: subtotalIdr,
      fxRate,
      feeIdr,
      channel: resolvedChannel,
      referenceId,
      idempotencyKey,
      expiresAt,
    });

    return NextResponse.json({
      order: serializeLedgerTransaction(pendingOrder),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuat pesanan top-up.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

