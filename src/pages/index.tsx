import { createServerClient } from '@supabase/ssr';
import { parse, serialize } from 'cookie';
import { dehydrate, QueryClient, type DehydratedState } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import { TestCraftPage } from '@/pages-fsd/testcraft';
import { HISTORY_QUERY_KEY, SETTINGS_QUERY_KEY } from '@/shared/api';
import type { HistoryEntry } from '@/shared/lib/helpers/types';

interface IndexProps {
  authUser: string;
  dehydratedState: DehydratedState;
}

export default function Index({ authUser, dehydratedState }: IndexProps) {
  return <TestCraftPage authUser={authUser} dehydratedState={dehydratedState} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const raw = context.req.headers.cookie;
          if (!raw) {
            return [];
          }

          return Object.entries(parse(raw)).map(([name, value]) => ({ name, value: value ?? '' }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            context.res.appendHeader('Set-Cookie', serialize(name, value, options));
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { redirect: { destination: '/auth', permanent: false } };
  }

  const queryClient = new QueryClient();

  const [historyResult, settingsResult] = await Promise.all([
    supabase
      .from('history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('ai_settings')
      .select('provider')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  if (!historyResult.error && historyResult.data) {
    const history: HistoryEntry[] = historyResult.data.map((row: {
      task_id: number;
      task_title: string;
      score: number;
      xp: number;
      date: string;
      attempt: number | null;
      self_score: number | null;
      prev_best_score: number | null;
    }) => ({
      taskId: row.task_id,
      taskTitle: row.task_title,
      score: row.score,
      xp: row.xp,
      date: row.date,
      attempt: row.attempt ?? 1,
      ...(row.self_score != null && { selfScore: row.self_score }),
      ...(row.prev_best_score != null && { prevBestScore: row.prev_best_score }),
    }));

    queryClient.setQueryData([HISTORY_QUERY_KEY], history);
  }

  if (!settingsResult.error) {
    queryClient.setQueryData([SETTINGS_QUERY_KEY], settingsResult.data?.provider ?? 'claude');
  }

  return {
    props: {
      authUser: user.email || user.id,
      dehydratedState: dehydrate(queryClient),
    },
  };
};