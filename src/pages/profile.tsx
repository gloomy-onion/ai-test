import type { DehydratedState } from '@tanstack/react-query';
import { AppLayout } from '@/pages-fsd/app-layout';
import { ProfileScreen } from '@/pages-fsd/testcraft/components/screens/profile';
import { withAuth } from '@/shared/lib/helpers/with-auth';

interface ProfilePageProps {
  authUser: string;
  dehydratedState: DehydratedState;
}

export default function ProfilePage({ authUser }: ProfilePageProps) {
  return (
    <AppLayout title="Профиль" subtitle="Ваш прогресс и достижения" authUser={authUser}>
      <ProfileScreen />
    </AppLayout>
  );
}

export const getServerSideProps = withAuth();