import Link from 'next/link';
import { ROUTES } from '@/shared/lib';
import styles from './styles.module.scss';

export const Main = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Welcome 👋</h1>

    <div className={styles.buttons}>
      <Link href={ROUTES.auth} className={styles.button}>
        Login
      </Link>
    </div>
  </div>
);
