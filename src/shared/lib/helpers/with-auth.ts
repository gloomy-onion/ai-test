import { createServerClient } from '@supabase/ssr';
import { parse, serialize } from 'cookie';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { HISTORY_QUERY_KEY, SETTINGS_QUERY_KEY, USER_QUERY_KEY } from '@/shared/api';
import type { HistoryEntry } from '@/shared/lib/helpers/types';
import type { CurrentUser } from '@/shared/api/requests/user';

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

const toHistoryEntry = (row: HistoryRow): HistoryEntry => ({
  taskId: row.task_id,
  taskTitle: row.task_title,
  score: row.score,
  xp: row.xp,
  date: row.date,
  attempt: row.attempt ?? 1,
  ...(row.self_score != null && { selfScore: row.self_score }),
  ...(row.prev_best_score != null && { prevBestScore: row.prev_best_score }),
});

const prefetchAppData = async (
  supabase: ReturnType<typeof createServerClient>,
  queryClient: QueryClient,
  userId: string,
  username: string,
  email: string,
) => {
  const [historyResult, settingsResult] = await Promise.all([
    supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase.from('ai_settings').select('provider').eq('user_id', userId).maybeSingle(),
  ]);

  if (!historyResult.error && historyResult.data) {
    queryClient.setQueryData(
      [HISTORY_QUERY_KEY],
      (historyResult.data as unknown as HistoryRow[]).map(toHistoryEntry),
    );
  }

  if (!settingsResult.error) {
    queryClient.setQueryData([SETTINGS_QUERY_KEY], settingsResult.data?.provider ?? 'claude');
  }

  queryClient.setQueryData<CurrentUser>([USER_QUERY_KEY], { email, username });
};

export const withAuth = (): GetServerSideProps => {
  return async (context: GetServerSidePropsContext) => {
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
      return {
        redirect: { destination: `/auth?next=${encodeURIComponent(context.resolvedUrl)}`, permanent: false },
      };
    }

    const queryClient = new QueryClient();
    const metadata = user.user_metadata as Record<string, unknown> | undefined;
    const username = typeof metadata?.username === 'string' ? metadata.username : '';
    const email = user.email ?? user.id;
    await prefetchAppData(supabase, queryClient, user.id, username, email);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  };
};