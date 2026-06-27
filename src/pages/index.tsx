import { parse } from 'cookie';
import type { GetServerSideProps } from 'next';
import { TOKEN_NAME, verifyToken } from '@/shared/lib/auth';
import { TestCraftPage } from '@/pages-fsd/testcraft';

interface IndexProps {
  authUser: string;
}

export default function Index({ authUser }: IndexProps) {
  return <TestCraftPage authUser={authUser} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const rawCookies = context.req.headers.cookie;

  if (!rawCookies) {
    return { redirect: { destination: '/auth', permanent: false } };
  }

  const cookies = parse(rawCookies);
  const token = cookies[TOKEN_NAME];

  if (!token) {
    return { redirect: { destination: '/auth', permanent: false } };
  }

  const verified = verifyToken(token);

  if (!verified) {
    return { redirect: { destination: '/auth', permanent: false } };
  }

  return { props: { authUser: verified.email } };
};
