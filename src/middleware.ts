import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE_NAME,
  MAX_SESSION_AGE_MS,
  verifySessionCookie,
  refreshSignedSessionCookie,
} from '@/shared/infrastructure/auth/session';

const PROTECTED_ROUTES = [
  '/wallet',
  '/card',
  '/transactions',
  '/top-up',
  '/kyc/submit',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const now = Date.now();
  const result = await verifySessionCookie(sessionCookie, now);

  const isProtectedRoute =
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/signin' || pathname === '/signup';

  // 1. Protected routes enforcement
  if (isProtectedRoute) {
    if (!result.valid) {
      const redirectUrl = new URL('/signin', request.url);
      if (result.reason === 'idle_timeout') {
        redirectUrl.searchParams.set('reason', 'idle');
      } else if (result.reason === 'expired') {
        redirectUrl.searchParams.set('reason', 'expired');
      } else {
        redirectUrl.searchParams.set('redirect', pathname);
      }

      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: '',
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    // Role check for administrative console
    if (pathname.startsWith('/admin') && result.payload.role === 'customer') {
      return NextResponse.redirect(new URL('/wallet', request.url));
    }

    // Active session: sliding window refresh for idle timeout (30 min)
    const { cookieValue } = await refreshSignedSessionCookie(result.payload, now);
    const response = NextResponse.next();
    const remainingSeconds = Math.max(
      0,
      Math.floor((result.payload.createdAt + MAX_SESSION_AGE_MS - now) / 1000)
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: remainingSeconds,
    });

    return response;
  }

  // 2. Redirect already-authenticated users away from signin/signup
  if (isAuthRoute && result.valid) {
    const destination = result.payload.role === 'super_admin' ? '/admin' : '/wallet';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 3. For public pages with an active session, slide the idle window
  if (result.valid) {
    const { cookieValue } = await refreshSignedSessionCookie(result.payload, now);
    const response = NextResponse.next();
    const remainingSeconds = Math.max(
      0,
      Math.floor((result.payload.createdAt + MAX_SESSION_AGE_MS - now) / 1000)
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: remainingSeconds,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icons, and static image files
     * - api routes other than protected ones
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
