import type { DehydratedState } from '@tanstack/react-query';
import { AppLayout } from '@/pages-fsd/app-layout';
import { SettingsScreen } from '@/pages-fsd/testcraft/components/screens/settings';
import { withAuth } from '@/shared/lib/helpers/with-auth';

interface SettingsPageProps {
  authUser: string;
  dehydratedState: DehydratedState;
}

export default function SettingsPage({ authUser }: SettingsPageProps) {
  return (
    <AppLayout title="Настройки API" subtitle="Провайдер и ключ для проверки заданий" authUser={authUser}>
      <SettingsScreen />
    </AppLayout>
  );
}

export const getServerSideProps = withAuth();