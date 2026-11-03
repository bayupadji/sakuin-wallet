import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/shared/config';
import {
  SESSION_COOKIE_NAME,
  verifySessionCookie,
} from '@/shared/infrastructure/auth/session';
import { createServerSupabaseClient } from '@/shared/infrastructure/supabase/server';
import {
  formatWibTimestamp,
  serializeLedgerTransaction,
  serverLedger,
} from '@/shared/infrastructure/ledger/server-ledger';

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionCookie(cookie);

  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.payload.userId;

  if (config.supabase.isConfigured) {
    const supabase = await createServerSupabaseClient();
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString();

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', oneYearAgo)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const items = (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      merchant: row.merchant,
      type: row.type,
      category: row.category,
      status: row.status,
      amountUsdCents: String(row.amount_usd_cents),
      amountIdr: Number(row.amount_idr),
      fxRate: Number(row.fx_rate),
      feeIdr: Number(row.fee_idr),
      channel: row.channel,
      referenceId: row.reference_id,
      idempotencyKey: row.idempotency_key,
      ledgerSequence: row.ledger_sequence,
      timestampUtc: row.created_at,
      timestampWib: formatWibTimestamp(row.created_at),
      expiresAt: row.expires_at ?? undefined,
    }));

    return NextResponse.json({ transactions: items });
  }

  const userTxs = serverLedger
    .getUserTransactions(userId)
    .map((tx) => serializeLedgerTransaction(tx));

  return NextResponse.json({ transactions: userTxs });
}

