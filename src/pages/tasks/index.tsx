import type { DehydratedState } from '@tanstack/react-query';
import { AppLayout } from '@/pages-fsd/app-layout';
import { TasksListScreen } from '@/pages-fsd/testcraft/components/screens/tasks-list';
import { withAuth } from '@/shared/lib/helpers/with-auth';

interface TasksPageProps {
  dehydratedState: DehydratedState;
}

export default function TasksPage() {
  return (
    <AppLayout title="Задания" subtitle="Выберите задание для практики">
      <TasksListScreen />
    </AppLayout>
  );
}

export const getServerSideProps = withAuth();