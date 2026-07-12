import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { TOKEN_NAME, verifyToken } from '@/shared/lib/auth';

function generateNonce(): string {
  const array = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...array));
}

function buildCspHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    isDev && "'unsafe-eval'",
  ]
    .filter(Boolean)
    .join(' ');

  const styleSrc = isDev
    ? "'self' 'unsafe-inline' https://fonts.googleapis.com"
    : "'self' https://fonts.googleapis.com";

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    "img-src 'self' blob: data: https://www.googletagmanager.com https://www.google-analytics.com https://mc.yandex.ru https://connect.facebook.net",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://mc.yandex.ru wss://mc.yandex.ru https://connect.facebook.net",
    'frame-src https://www.googletagmanager.com https://mc.yandex.ru',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};

export async function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCspHeader(nonce);

  const { pathname } = request.nextUrl;
  const publicPaths = ['/auth', '/api/auth/login'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  if (!isPublicPath) {
    const rawCookies = request.headers.get('cookie');
    const cookies = rawCookies ? parse(rawCookies) : {};
    const token = cookies[TOKEN_NAME];
    const verified = token ? await verifyToken(token) : null;

    if (!verified) {
      const redirectResponse = NextResponse.redirect(new URL('/auth', request.url));
      redirectResponse.headers.set('Content-Security-Policy', csp);
      return redirectResponse;
    }
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set('Content-Security-Policy', csp);

  return response;
}