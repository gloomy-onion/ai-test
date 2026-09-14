import Link from 'next/link';
import { ROUTES } from '@/shared/lib';
import { createBrowserSupabase } from '@/shared/lib/supabase';
import styles from './styles.module.scss';

interface MainProps {
  authUser: string | null;
}

export const Main = ({ authUser }: MainProps) => {
  const handleLogout = async () => {
    await createBrowserSupabase().auth.signOut();
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{authUser ? `Welcome back, ${authUser} 👋` : 'Welcome 👋'}</h1>

      <div className={styles.buttons}>
        {!authUser ? (
          <Link href={ROUTES.auth} className={styles.button}>
            Login
          </Link>
        ) : (
          <button onClick={handleLogout} className={styles.button}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};
