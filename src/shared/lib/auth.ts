import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret'
);

export const TOKEN_NAME = 'auth-token';
export const TOKEN_MAX_AGE = 30 * 60;

export interface TokenPayload {
  email: string;
  iat: number;
  exp: number;
}

export const createToken = async (email: string): Promise<string> => {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + TOKEN_MAX_AGE)
    .sign(JWT_SECRET);
};

export const verifyToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
};
