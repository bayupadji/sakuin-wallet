import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/shared/config';
import {
  SESSION_COOKIE_NAME,
  verifySessionCookie,
} from '@/shared/infrastructure/auth/session';
import { createServerSupabaseClient } from '@/shared/infrastructure/supabase/server';
import { serverLedger } from '@/shared/infrastructure/ledger/server-ledger';

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionCookie(cookie);

  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.payload.userId;

  if (config.supabase.isConfigured) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('wallets')
      .select('id, user_id, balance_cents, is_frozen, updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ wallet: null });
    }

    return NextResponse.json({
      wallet: {
        id: data.id,
        userId: data.user_id,
        balanceCents: String(data.balance_cents),
        isFrozen: Boolean(data.is_frozen),
        updatedAt: data.updated_at,
      },
    });
  }

  const derivedCents = serverLedger.getWalletBalanceCents(userId);
  return NextResponse.json({
    wallet: {
      id: `wallet-${userId}`,
      userId,
      balanceCents: derivedCents.toString(),
      isFrozen: false,
      updatedAt: new Date().toISOString(),
    },
  });
}

