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

  const isMetadataRoute =
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/llms.txt' ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon') ||
    pathname.startsWith('/opengraph-image');

  if (isMetadataRoute) {
    return NextResponse.next();
  }

  // Maintenance mode enforcement (bypass for admin and API routes)
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const isMaintenanceRoute = pathname === '/maintenance';
  const isAdminRoute = pathname.startsWith('/admin');
  const isApiRoute = pathname.startsWith('/api');

  if (isMaintenanceMode && !isAdminRoute && !isApiRoute) {
    const maintenanceHeaders = {
      'Retry-After': '3600',
      'Cache-Control': 'no-store, must-revalidate',
    };

    if (isMaintenanceRoute) {
      return NextResponse.next({
        status: 503,
        headers: maintenanceHeaders,
      });
    }

    return NextResponse.rewrite(new URL('/maintenance', request.url), {
      status: 503,
      headers: maintenanceHeaders,
    });
  }

  const isHttps =
    request.nextUrl.protocol === 'https:' ||
    request.headers.get('x-forwarded-proto') === 'https';

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
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: remainingSeconds,
    });

    return response;
  }

  // 2. Redirect already-authenticated users away from signin/signup
  if (isAuthRoute && result.valid) {
    const destination = result.payload.role !== 'customer' ? '/admin' : '/wallet';
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
      secure: isHttps,
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
     * - crawler/metadata files, icons, and static image files
     */
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|llms\\.txt|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
