import { NextRequest, NextResponse } from 'next/server';
import {
  createSignedSessionCookie,
  verifySessionCookie,
  SESSION_COOKIE_NAME,
  MAX_SESSION_AGE_MS,
} from '@/shared/infrastructure/auth/session';
import { config } from '@/shared/config';
import { createServerSupabaseClient } from '@/shared/infrastructure/supabase/server';
import { createSeedUser } from '@/features/auth/infrastructure/seed';
import { UserRole } from '@/features/auth/domain/entities/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user } = body;

    if (!user || !user.id || !user.email) {
      return NextResponse.json(
        { error: 'User data is required to establish session.' },
        { status: 400 }
      );
    }

    let verifiedRole: UserRole = 'customer';
    let verifiedId = user.id;
    let verifiedEmail = user.email;
    let verifiedFullName = user.fullName || user.email.split('@')[0];

    if (config.supabase.isConfigured) {
      const supabase = await createServerSupabaseClient();
      const { data: { user: authUser }, error } = await supabase.auth.getUser();

      if (error || !authUser || authUser.id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized session request.' }, { status: 401 });
      }

      verifiedId = authUser.id;
      verifiedEmail = authUser.email || user.email;
      verifiedRole = (authUser.app_metadata?.role as UserRole) || 'customer';
      verifiedFullName = (authUser.user_metadata?.full_name as string) || verifiedFullName;
    } else {
      const seed = createSeedUser(user.email);
      verifiedRole = seed.role;
    }

    const { cookieValue, payload } = await createSignedSessionCookie({
      id: verifiedId,
      email: verifiedEmail,
      fullName: verifiedFullName,
      role: verifiedRole,
    });

    const isHttps =
      request.nextUrl.protocol === 'https:' ||
      request.headers.get('x-forwarded-proto') === 'https';

    const response = NextResponse.json({ success: true, session: payload });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: cookieValue,
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(MAX_SESSION_AGE_MS / 1000), // 7200 seconds (2 hours)
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to establish session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const result = await verifySessionCookie(cookie);

  if (!result.valid) {
    return NextResponse.json({ valid: false, reason: result.reason }, { status: 401 });
  }

  return NextResponse.json({ valid: true, user: result.payload });
}

export async function DELETE(request: NextRequest) {
  const isHttps =
    request.nextUrl.protocol === 'https:' ||
    request.headers.get('x-forwarded-proto') === 'https';

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
