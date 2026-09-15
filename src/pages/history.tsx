import type { DehydratedState } from '@tanstack/react-query';
import { AppLayout } from '@/pages-fsd/app-layout';
import { HistoryScreen } from '@/pages-fsd/testcraft/components/screens/history';
import { withAuth } from '@/shared/lib/helpers/with-auth';

interface HistoryPageProps {
  authUser: string;
  dehydratedState: DehydratedState;
}

export default function HistoryPage({ authUser }: HistoryPageProps) {
  return (
    <AppLayout title="История" subtitle="Ваши выполненные задания" authUser={authUser}>
      <HistoryScreen />
    </AppLayout>
  );
}

export const getServerSideProps = withAuth();