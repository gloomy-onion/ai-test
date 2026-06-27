import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createToken, TOKEN_MAX_AGE, TOKEN_NAME } from '@/shared/lib';
import { MOCK_USERS } from '@/shared/lib/mock-users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const cookie = serialize(TOKEN_NAME, createToken(email), {
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
