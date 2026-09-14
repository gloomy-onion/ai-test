import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { parse, serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const assertConfig = (): void => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase env configuration');
  }
};

export const createBrowserSupabase = () => {
  assertConfig();

  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
};

export const createApiSupabase = (req: NextApiRequest, res: NextApiResponse) => {
  assertConfig();

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        const raw = req.headers.cookie;
        if (!raw) {
          return [];
        }

        return Object.entries(parse(raw)).map(([name, value]) => ({ name, value: value ?? '' }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.appendHeader('Set-Cookie', serialize(name, value, options));
        });
      },
    },
  });
};

export const getRequestUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createApiSupabase(req, res);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};