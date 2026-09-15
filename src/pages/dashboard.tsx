import type { DehydratedState } from '@tanstack/react-query';
import { AppLayout } from '@/pages-fsd/app-layout';
import { DashboardScreen } from '@/pages-fsd/testcraft/components/screens/dashboard';
import { withAuth } from '@/shared/lib/helpers/with-auth';

interface DashboardPageProps {
  authUser: string;
  dehydratedState: DehydratedState;
}

export default function DashboardPage({ authUser }: DashboardPageProps) {
  return (
    <AppLayout title="Дашборд" subtitle="Добро пожаловать в TestCraft AI" authUser={authUser}>
      <DashboardScreen />
    </AppLayout>
  );
}

export const getServerSideProps = withAuth();