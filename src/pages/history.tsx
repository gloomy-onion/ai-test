import type { DehydratedState } from '@tanstack/react-query';
import { AppLayout } from '@/pages-fsd/app-layout';
import { HistoryScreen } from '@/pages-fsd/testcraft/components/screens/history';
import { withAuth } from '@/shared/lib/helpers/with-auth';

interface HistoryPageProps {
  dehydratedState: DehydratedState;
}

export default function HistoryPage() {
  return (
    <AppLayout title="История" subtitle="Ваши выполненные задания">
      <HistoryScreen />
    </AppLayout>
  );
}

export const getServerSideProps = withAuth();