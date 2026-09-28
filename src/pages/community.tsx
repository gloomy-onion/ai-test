import type { DehydratedState } from '@tanstack/react-query';
import { AppLayout } from '@/pages-fsd/app-layout';
import { CommunityScreen } from '@/pages-fsd/testcraft/components/screens/community';
import { withAuth } from '@/shared/lib/helpers/with-auth';

interface CommunityPageProps {
  dehydratedState: DehydratedState;
}

export default function CommunityPage() {
  return (
    <AppLayout title="Сообщество" subtitle="Участники платформы">
      <CommunityScreen />
    </AppLayout>
  );
}

export const getServerSideProps = withAuth();