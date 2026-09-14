import { NextRequest, NextResponse } from 'next/server';

function generateNonce(): string {
  const array = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...array));
}

function buildCspHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
    : '';

  const scriptSrc = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", isDev && "'unsafe-eval'"]
    .filter(Boolean)
    .join(' ');

  const styleSrc = isDev
    ? "'self' 'unsafe-inline' https://fonts.googleapis.com"
    : "'self' https://fonts.googleapis.com";

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    "img-src 'self' blob: data: https://www.googletagmanager.com https://www.google-analytics.com",
    "font-src 'self' https://fonts.gstatic.com",
    [
      'connect-src',
      "'self'",
      'https://api.groq.com',
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://www.googletagmanager.com',
      supabaseOrigin,
    ].filter(Boolean).join(' '),
    'frame-src https://www.googletagmanager.com',
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

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCspHeader(nonce);

  request.headers.set('x-nonce', nonce);

  const response = NextResponse.next({ request });
  response.headers.set('Content-Security-Policy', csp);

  return response;
}