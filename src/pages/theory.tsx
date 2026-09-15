import type { DehydratedState } from '@tanstack/react-query';
import { AppLayout } from '@/pages-fsd/app-layout';
import { TheoryScreen } from '@/pages-fsd/testcraft/components/screens/theory';
import { withAuth } from '@/shared/lib/helpers/with-auth';

interface TheoryPageProps {
  authUser: string;
  dehydratedState: DehydratedState;
}

export default function TheoryPage({ authUser }: TheoryPageProps) {
  return (
    <AppLayout title="База знаний" subtitle="Теория и AI-консультант" authUser={authUser}>
      <TheoryScreen />
    </AppLayout>
  );
}

export const getServerSideProps = withAuth();