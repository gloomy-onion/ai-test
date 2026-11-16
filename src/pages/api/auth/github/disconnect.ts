import type { NextApiRequest, NextApiResponse } from 'next';
import { SESSION_COOKIE, serializeCookie } from '@/shared/lib/oauth/cookies';

/** Отключение GitHub-аккаунта: сбрасываем подписанную cookie сессии. */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.setHeader('Set-Cookie', serializeCookie(SESSION_COOKIE, '', 0));
  return res.status(200).json({ connected: false });
}
