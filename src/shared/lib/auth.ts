import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const TOKEN_NAME = 'auth-token';
const TOKEN_MAX_AGE = 30 * 60;

export interface TokenPayload {
  email: string;
  iat: number;
  exp: number;
}

export function createToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getVerifiedToken(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function setAuthCookie(email: string) {
  const token = createToken(email);
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export { TOKEN_NAME };
