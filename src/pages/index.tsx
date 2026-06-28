import type { GetServerSideProps } from 'next';
import { parse } from 'cookie';
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
  const cookies = rawCookies ? parse(rawCookies) : {};
  const token = cookies[TOKEN_NAME];
  const verified = token ? await verifyToken(token) : null;

  if (!verified) {
    return { redirect: { destination: '/auth', permanent: false } };
  }

  return { props: { authUser: verified.email } };
};