import { type ReactNode, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { historyOptions, settingsOptions, HISTORY_QUERY_KEY } from '@/shared/api';
import { cacheProvider } from '@/shared/lib/helpers/ai-provider';
import { migrateLegacyHistory } from '@/shared/lib/helpers/legacy-history';
import { Sidebar } from '@/pages-fsd/testcraft/components/sidebar';
import { Header } from '@/pages-fsd/testcraft/components/header';
import styles from './styles.module.scss';

interface AppLayoutProps {
  title?: string;
  subtitle?: string;
  authUser: string;
  children: ReactNode;
}

export const AppLayout = ({ title, subtitle, authUser, children }: AppLayoutProps) => {
  const queryClient = useQueryClient();
  useQuery(historyOptions());
  const { data: provider } = useQuery(settingsOptions());

  useEffect(() => {
    if (provider) {
      cacheProvider(provider);
    }
  }, [provider]);

  useEffect(() => {
    void migrateLegacyHistory().then(() => {
      void queryClient.invalidateQueries({ queryKey: [HISTORY_QUERY_KEY] });
    });
  }, [queryClient]);

  return (
    <div className={styles.app} data-theme="dark">
      <Sidebar authUser={authUser} />
      <div className={styles.main}>
        {Boolean(title || subtitle) && <Header title={title || ''} subtitle={subtitle || ''} />}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};