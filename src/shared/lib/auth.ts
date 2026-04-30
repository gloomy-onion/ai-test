import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
export const TOKEN_NAME = 'auth-token';
export const TOKEN_MAX_AGE = 30 * 60;

export interface TokenPayload {
  email: string;
  iat: number;
  exp: number;
}

export function createToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, {
    expiresIn: TOKEN_MAX_AGE,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
