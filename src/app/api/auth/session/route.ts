import { NextRequest, NextResponse } from 'next/server';
import {
  createSignedSessionCookie,
  verifySessionCookie,
  SESSION_COOKIE_NAME,
  MAX_SESSION_AGE_MS,
} from '@/shared/infrastructure/auth/session';

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

    const { cookieValue, payload } = await createSignedSessionCookie({
      id: user.id,
      email: user.email,
      fullName: user.fullName || user.email.split('@')[0],
      role: user.role || 'customer',
    });

    const response = NextResponse.json({ success: true, session: payload });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
