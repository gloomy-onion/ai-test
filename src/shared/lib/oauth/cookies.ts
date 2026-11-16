import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_PH = process.env.OAUTH_COOKIE_PH ?? 'dev-fallback';

export const PKCE_COOKIE = 'gh_oauth_pkce';
export const SESSION_COOKIE = 'gh_connected';
export const PKCE_MAX_AGE = 600; // 10 минут на весь flow
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function sign(payload: string): string {
  return createHmac('sha256', COOKIE_PH).update(payload).digest('base64url');
}

export function serializeCookie(name: string, value: object | string, maxAge: number): string {
  const payload = typeof value === 'string' ? value : JSON.stringify(value);
  const encoded = Buffer.from(payload).toString('base64url');
  const signed = `${encoded}.${sign(encoded)}`;

  return `${name}=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export function parseSignedCookie(raw: string | undefined): string | null {
  if (!raw) {
    return null;
  }
  const idx = raw.lastIndexOf('.');
  if (idx <= 0) {
    return null;
  }
  const encoded = raw.slice(0, idx);
  const sig = raw.slice(idx + 1);
  const expected = sign(encoded);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }
  } catch {
    return null;
  }

  return Buffer.from(encoded, 'base64url').toString('utf8');
}

export interface PkceBag {
  state: string;
  verifier: string;
  redirectUri: string;
  next: string;
}

export interface GhSession {
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
  html_url: string;
  scope: string;
  connected_at: string;
}
