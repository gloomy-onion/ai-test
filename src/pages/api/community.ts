import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiSupabase } from '@/shared/lib/supabase';

interface ProfileRow {
  id: string;
  username: string;
  xp: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createApiSupabase(req, res);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, xp')
      .order('xp', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to load community' });
    }

    const profiles = (data as unknown as ProfileRow[]).map((row) => ({
      id: row.id,
      username: row.username,
      xp: row.xp ?? 0,
    }));

    return res.status(200).json({ users: profiles, me: user.id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}