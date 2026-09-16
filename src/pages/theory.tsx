import type { DehydratedState } from '@tanstack/react-query';
import { AppLayout } from '@/pages-fsd/app-layout';
import { TheoryScreen } from '@/pages-fsd/testcraft/components/screens/theory';
import { withAuth } from '@/shared/lib/helpers/with-auth';

interface TheoryPageProps {
  dehydratedState: DehydratedState;
}

export default function TheoryPage() {
  return (
    <AppLayout title="База знаний" subtitle="Теория и AI-консультант">
      <TheoryScreen />
    </AppLayout>
  );
}

export const getServerSideProps = withAuth();