import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/shared/infrastructure/auth/session';

export async function POST(request: NextRequest) {
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
