import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/shared/config';
import {
  SESSION_COOKIE_NAME,
  verifySessionCookie,
} from '@/shared/infrastructure/auth/session';
import {
  createAdminSupabaseClient,
  createServerSupabaseClient,
} from '@/shared/infrastructure/supabase/server';
import {
  getOrCreateFallbackCard,
  updateFallbackCard,
} from '@/shared/infrastructure/card/server-card';

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionCookie(cookie);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, fullName } = session.payload;

  if (config.supabase.isConfigured) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('cards')
      .select(
        'id, cardholder_name, last4, expiry, issuing_country, is_frozen, monthly_limit_cents, online_transactions, non_3ds_transactions, atm_withdrawals'
      )
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      return NextResponse.json({
        card: {
          id: data.id,
          cardholderName: data.cardholder_name,
          last4: data.last4,
          expiry: data.expiry,
          issuingCountry: data.issuing_country,
          isFrozen: Boolean(data.is_frozen),
          monthlyLimit: Math.round(Number(data.monthly_limit_cents) / 100),
          onlineTransactions: Boolean(data.online_transactions),
          non3dsTransactions: Boolean(data.non_3ds_transactions),
          atmWithdrawals: Boolean(data.atm_withdrawals),
        },
      });
    }
  }

  const card = getOrCreateFallbackCard(userId, fullName);
  return NextResponse.json({
    card: {
      id: card.id,
      cardholderName: card.cardholderName,
      last4: card.last4,
      expiry: card.expiry,
      issuingCountry: card.issuingCountry,
      isFrozen: card.isFrozen,
      monthlyLimit: card.monthlyLimit,
      onlineTransactions: card.onlineTransactions,
      non3dsTransactions: card.non3dsTransactions,
      atmWithdrawals: card.atmWithdrawals,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionCookie(cookie);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Format permintaan tidak valid.' }, { status: 400 });
  }

  const { userId, fullName } = session.payload;
  const patch = {
    isFrozen: typeof body.isFrozen === 'boolean' ? body.isFrozen : undefined,
    monthlyLimit:
      typeof body.monthlyLimit === 'number' && Number.isFinite(body.monthlyLimit)
        ? Math.max(0, Math.round(body.monthlyLimit))
        : undefined,
    onlineTransactions:
      typeof body.onlineTransactions === 'boolean' ? body.onlineTransactions : undefined,
    non3dsTransactions:
      typeof body.non3dsTransactions === 'boolean' ? body.non3dsTransactions : undefined,
    atmWithdrawals: typeof body.atmWithdrawals === 'boolean' ? body.atmWithdrawals : undefined,
  };

  if (config.supabase.isConfigured) {
    const supabase = await createServerSupabaseClient();
    const dbPatch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (patch.isFrozen !== undefined) dbPatch.is_frozen = patch.isFrozen;
    if (patch.monthlyLimit !== undefined) dbPatch.monthly_limit_cents = patch.monthlyLimit * 100;
    if (patch.onlineTransactions !== undefined)
      dbPatch.online_transactions = patch.onlineTransactions;
    if (patch.non3dsTransactions !== undefined)
      dbPatch.non_3ds_transactions = patch.non3dsTransactions;
    if (patch.atmWithdrawals !== undefined) dbPatch.atm_withdrawals = patch.atmWithdrawals;

    const { data, error } = await supabase
      .from('cards')
      .update(dbPatch)
      .eq('user_id', userId)
      .select(
        'id, cardholder_name, last4, expiry, issuing_country, is_frozen, monthly_limit_cents, online_transactions, non_3ds_transactions, atm_withdrawals'
      )
      .maybeSingle();

    if (!error && data) {
      if (patch.isFrozen !== undefined) {
        try {
          const admin = createAdminSupabaseClient();
          await admin.from('audit_logs').insert({
            actor_id: userId,
            action: patch.isFrozen ? 'CARD_FROZEN' : 'CARD_UNFROZEN',
            entity: 'card',
            entity_id: data.id,
            after_state: { is_frozen: patch.isFrozen },
          });
        } catch {
          // Non-fatal if service_role is absent in dev
        }
      }

      return NextResponse.json({
        card: {
          id: data.id,
          cardholderName: data.cardholder_name,
          last4: data.last4,
          expiry: data.expiry,
          issuingCountry: data.issuing_country,
          isFrozen: Boolean(data.is_frozen),
          monthlyLimit: Math.round(Number(data.monthly_limit_cents) / 100),
          onlineTransactions: Boolean(data.online_transactions),
          non3dsTransactions: Boolean(data.non_3ds_transactions),
          atmWithdrawals: Boolean(data.atm_withdrawals),
        },
      });
    }
  }

  const updated = updateFallbackCard(userId, fullName, patch);
  return NextResponse.json({
    card: {
      id: updated.id,
      cardholderName: updated.cardholderName,
      last4: updated.last4,
      expiry: updated.expiry,
      issuingCountry: updated.issuingCountry,
      isFrozen: updated.isFrozen,
      monthlyLimit: updated.monthlyLimit,
      onlineTransactions: updated.onlineTransactions,
      non3dsTransactions: updated.non3dsTransactions,
      atmWithdrawals: updated.atmWithdrawals,
    },
  });
}

