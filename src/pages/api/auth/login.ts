import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const TOKEN_NAME = 'auth-token';
const TOKEN_MAX_AGE = 30 * 60; // 30 минут

const MOCK_USERS = [
  { email: 'user@example.com', password: 'password123' },
  { email: 'admin@example.com', password: 'admin123' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ email }, JWT_SECRET, {
      expiresIn: TOKEN_MAX_AGE,
    });

    const cookie = serialize(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_MAX_AGE,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({ success: true, email });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: 'Internal server error' });
  }
}
