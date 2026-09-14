import type { NextApiRequest, NextApiResponse } from 'next';
import { createApiSupabase } from '@/shared/lib/supabase';
import type { HistoryEntry } from '@/shared/lib/helpers/types';

interface HistoryRow {
  task_id: number;
  task_title: string;
  score: number;
  xp: number;
  date: string;
  attempt: number | null;
  self_score: number | null;
  prev_best_score: number | null;
}

const toEntry = (row: HistoryRow): HistoryEntry => ({
  taskId: row.task_id,
  taskTitle: row.task_title,
  score: row.score,
  xp: row.xp,
  date: row.date,
  attempt: row.attempt ?? 1,
  selfScore: row.self_score ?? undefined,
  prevBestScore: row.prev_best_score ?? undefined,
});

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
      .from('history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to load history' });
    }

    return res.status(200).json({ history: (data as unknown as HistoryRow[]).map(toEntry) });
  }

  if (req.method === 'POST') {
    const body = req.body as { entry?: Partial<HistoryEntry>; history?: Partial<HistoryEntry>[] } | undefined;
    const entries = Array.isArray(body?.history) ? body.history : body?.entry ? [body.entry] : [];

    if (!entries.length) {
      return res.status(400).json({ error: 'Invalid entry' });
    }

    const rows = entries.map((entry) => ({
      user_id: user.id,
      task_id: entry.taskId,
      task_title: String(entry.taskTitle ?? ''),
      score: entry.score,
      xp: entry.xp ?? 0,
      date: String(entry.date ?? ''),
      attempt: entry.attempt ?? 1,
      self_score: Number.isFinite(entry.selfScore) ? entry.selfScore : null,
      prev_best_score: Number.isFinite(entry.prevBestScore) ? entry.prevBestScore : null,
    }));

    const { error } = await supabase.from('history').insert(
      rows.filter((row) => Number.isInteger(row.task_id) && Number.isFinite(row.score)),
    );

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to save history' });
    }

    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('history').delete().eq('user_id', user.id);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to clear history' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}