import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiSupabase } from '@/shared/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createApiSupabase(req, res);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const metadata = user.user_metadata as Record<string, unknown> | undefined;

    return res.status(200).json({
      email: user.email ?? user.id,
      username: typeof metadata?.username === 'string' ? metadata.username : '',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}