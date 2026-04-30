import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TOKEN_NAME } from '@/shared/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookie = serialize(TOKEN_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);

    return res.status(500).json({ error: 'Internal server error' });
  }
}
