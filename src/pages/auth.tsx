import { GetServerSideProps } from 'next';
import { Auth } from '@/pages-fsd/auth';

export default function AuthPage() {
  return <Auth />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};