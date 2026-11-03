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
  fetchEphemeralIssuerSecrets,
  getOrCreateFallbackCard,
} from '@/shared/infrastructure/card/server-card';

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionCookie(cookie);
  if (!session.valid) {
    return NextResponse.json({ error: 'Sesi Anda telah berakhir. Silakan masuk kembali.' }, { status: 401 });
  }

  let body: { password?: unknown };
  try {
    body = (await request.json()) as { password?: unknown };
  } catch {
    return NextResponse.json({ error: 'Format permintaan tidak valid.' }, { status: 400 });
  }

  const password = typeof body.password === 'string' ? body.password : '';
  if (password.trim().length < 6) {
    return NextResponse.json(
      { error: 'Kata sandi tidak valid. Periksa kembali kata sandi akun Anda.' },
      { status: 403 }
    );
  }

  const { userId, email, fullName } = session.payload;
  let issuerCardRef = '';
  let last4 = '';
  let cardId = '';

  if (config.supabase.isConfigured) {
    const supabase = await createServerSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: 'Kata sandi tidak valid. Periksa kembali kata sandi akun Anda.' },
        { status: 403 }
      );
    }

    const { data: cardRow, error: cardError } = await supabase
      .from('cards')
      .select('id, issuer_card_ref, last4')
      .eq('user_id', userId)
      .maybeSingle();

    if (cardError || !cardRow) {
      return NextResponse.json(
        { error: 'Kartu debit virtual belum aktif untuk akun ini.' },
        { status: 404 }
      );
    }

    cardId = cardRow.id;
    issuerCardRef = cardRow.issuer_card_ref;
    last4 = cardRow.last4;

    try {
      const admin = createAdminSupabaseClient();
      await admin.from('audit_logs').insert({
        actor_id: userId,
        action: 'CARD_DETAILS_REVEALED',
        entity: 'card',
        entity_id: cardId,
        ip_address: request.headers.get('x-forwarded-for') ?? null,
      });
    } catch {
      // Non-fatal if service_role absent in dev
    }
  } else {
    const fallback = getOrCreateFallbackCard(userId, fullName);
    cardId = fallback.id;
    issuerCardRef = fallback.issuerCardRef;
    last4 = fallback.last4;
  }

  try {
    const secrets = await fetchEphemeralIssuerSecrets(issuerCardRef, last4);
    return NextResponse.json(
      {
        cardNumberFormatted: secrets.cardNumberFormatted,
        cvv: secrets.cvv,
        expiresInSeconds: 30,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        },
      }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Gagal menampilkan detail kartu debit virtual.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

