import { createServerClient } from '@supabase/ssr';
import { parse, serialize } from 'cookie';
import type { GetServerSideProps } from 'next';
import { TestCraftPage } from '@/pages-fsd/testcraft';

interface IndexProps {
  authUser: string;
}

export default function Index({ authUser }: IndexProps) {
  return <TestCraftPage authUser={authUser} />;
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

  return { props: { authUser: user.email || user.id } };
};