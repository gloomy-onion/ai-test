import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiSupabase } from '@/shared/lib/supabase';

const VALID_PROVIDERS = ['claude', 'gemini', 'groq', 'openai', 'deepseek'];
const DEFAULT_PROVIDER = 'claude';

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
      .from('ai_settings')
      .select('provider')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to load settings' });
    }

    return res.status(200).json({ provider: data?.provider ?? DEFAULT_PROVIDER });
  }

  if (req.method === 'POST') {
    const provider = req.body?.provider;

    if (typeof provider !== 'string' || !VALID_PROVIDERS.includes(provider)) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    const { error } = await supabase.from('ai_settings').upsert(
      {
        user_id: user.id,
        provider,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to save settings' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}