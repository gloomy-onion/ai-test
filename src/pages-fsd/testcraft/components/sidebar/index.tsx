'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { NAV_ITEMS, FILTER_ITEMS } from '@/shared/lib/config';
import { historyOptions } from '@/shared/api';
import { getRemainingTasks } from '@/shared/lib/helpers/tasks-data';
import { getUserInitials } from '@/shared/lib/helpers/user';
import { getNetworkInfo, subscribeToNetwork } from '@/shared/lib/helpers/network';
import { getTotalXP, getLevelInfo } from '@/shared/lib/helpers/xp-system';
import { createBrowserSupabase } from '@/shared/lib/supabase';
import styles from './styles.module.scss';

interface SidebarProps {
  authUser: string;
}

const TASK_FILTER_ROUTES: Record<string, string> = {
  functional: '/tasks?filter=functional',
  api: '/tasks?filter=api',
  ui: '/tasks?filter=ui',
  bug: '/tasks?filter=bug',
};

const ACTIVE_SCREEN_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/tasks': 'tasks',
  '/history': 'history',
  '/theory': 'theory',
  '/profile': 'profile',
  '/settings': 'settings',
};

export const Sidebar = ({ authUser }: SidebarProps) => {
  const router = useRouter();
  const { data: history = [] } = useQuery(historyOptions());
  const xp = getTotalXP(history);
  const level = getLevelInfo(xp);

  const activeScreen = ACTIVE_SCREEN_MAP[router.pathname] || '';
  const activeFilter = router.query.filter as string | undefined;

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(getNetworkInfo().online);
    return subscribeToNetwork(() => setIsOnline(getNetworkInfo().online));
  }, []);

  const handleLogout = async () => {
    await createBrowserSupabase().auth.signOut();
    window.location.href = '/auth';
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Link href="/dashboard" className={styles.logoMark}>
          <div className={styles.logoIcon}>⚙</div>
          <div>
            <div>TestCraft AI</div>
            <div className={styles.logoSub}>QA Learning Platform</div>
          </div>
        </Link>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>Навигация</div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.navItem} ${activeScreen === item.id ? styles.navItemActive : ''}`}
            >
              <div className={styles.navDot} />
              {item.label}
              {item.id === 'tasks' ? (
                <span className={styles.navBadge}>{getRemainingTasks(history)}</span>
              ) : null}
            </Link>
          ))}
        </div>

        <div className={styles.navSection}>
          <div className={styles.navLabel}>Виды тестирования</div>
          {FILTER_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={TASK_FILTER_ROUTES[item.id]}
              className={`${styles.navItem} ${activeFilter === item.id ? styles.navItemActive : ''}`}
            >
              <div className={styles.navDot} />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className={styles.connectionInfo}>
        <span className={`${styles.connectionDot} ${isOnline ? styles.connectionDotOnline : styles.connectionDotOffline}`} />
        <span className={isOnline ? styles.connectionOnline : styles.connectionOffline}>
          {isOnline ? 'Соединение активно' : 'Нет соединения'}
        </span>
      </div>

      <div className={styles.sidebarUser}>
        <div className={styles.userAvatar}>{getUserInitials(authUser)}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{authUser}</div>
          <div className={styles.userLevel}>
            Уровень {level.level} · {xp} XP
          </div>
        </div>
      </div>

      <div className={styles.logoutWrap}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </aside>
  );
};