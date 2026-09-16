import { createServerClient } from '@supabase/ssr';
import { parse, serialize } from 'cookie';
import type { GetServerSideProps } from 'next';

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

  const code = context.query.code;
  const next = Array.isArray(context.query.next) ? context.query.next[0] : context.query.next;
  const destination =
    typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  if (typeof code === 'string') {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return { redirect: { destination: `/auth?error=${encodeURIComponent(error.message)}`, permanent: false } };
      }
    } catch {
      return { redirect: { destination: '/auth?error=oauth_failed', permanent: false } };
    }
  }

  return { redirect: { destination, permanent: false } };
};

export default function AuthCallback() {
  return null;
}