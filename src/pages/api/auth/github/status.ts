import type { NextApiRequest, NextApiResponse } from 'next';
import { SESSION_COOKIE, parseSignedCookie, type GhSession } from '@/shared/lib/oauth/cookies';

/** Отдаёт состояние подключения (без токенов — они в cookie не хранятся вовсе). */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.cookies?.[SESSION_COOKIE];
  try {
    const json = parseSignedCookie(typeof raw === 'string' ? raw : undefined);
    if (!json) return res.status(200).json({ connected: false });
    const s = JSON.parse(json) as GhSession;
    return res.status(200).json({ connected: true, account: s });
  } catch {
    return res.status(200).json({ connected: false });
  }
}
