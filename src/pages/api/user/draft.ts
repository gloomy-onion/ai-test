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
    const taskId = Number(req.query.task_id);

    if (!Number.isInteger(taskId)) {
      return res.status(400).json({ error: 'Invalid task_id' });
    }

    const { data, error } = await supabase
      .from('drafts')
      .select('body')
      .eq('user_id', user.id)
      .eq('task_id', taskId)
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to load draft' });
    }

    return res.status(200).json({ body: data?.body ?? null });
  }

  if (req.method === 'POST') {
    const taskId = Number(req.body?.task_id);
    const body = typeof req.body?.body === 'string' ? req.body.body : '';

    if (!Number.isInteger(taskId)) {
      return res.status(400).json({ error: 'Invalid task_id' });
    }

    const { error } = await supabase.from('drafts').upsert(
      {
        user_id: user.id,
        task_id: taskId,
        body,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,task_id' },
    );

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to save draft' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}