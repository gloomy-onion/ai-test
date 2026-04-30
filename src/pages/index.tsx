import { parse } from 'cookie';
import { GetServerSideProps } from 'next';
import { TOKEN_NAME, verifyToken } from '@/shared/lib/auth';
import { Main } from '@/pages-fsd/main';

interface MainPageProps {
  authUser: string | null;
}

export default function MainPage({ authUser }: MainPageProps) {
  return <Main authUser={authUser} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const rawCookies = context.req.headers.cookie;

  if (!rawCookies) {
    return {
      props: {
        authUser: null,
      },
    };
  }

  const cookies = parse(rawCookies);
  const token = cookies[TOKEN_NAME];

  if (!token) {
    return {
      props: {
        authUser: null,
      },
    };
  }

  const verified = verifyToken(token);

  return {
    props: {
      authUser: verified?.email || null,
    },
  };
};
