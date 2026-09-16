import type { DehydratedState } from '@tanstack/react-query';
import { AppLayout } from '@/pages-fsd/app-layout';
import { WorkspaceScreen } from '@/pages-fsd/testcraft/components/screens/workspace';
import { withAuth } from '@/shared/lib/helpers/with-auth';

interface WorkspacePageProps {
  dehydratedState: DehydratedState;
}

export default function WorkspacePage() {
  return (
    <AppLayout>
      <WorkspaceScreen />
    </AppLayout>
  );
}

export const getServerSideProps = withAuth();