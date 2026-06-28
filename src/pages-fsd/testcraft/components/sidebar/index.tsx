'use client';

import type { HistoryEntry } from '@/shared/lib/testcraft/types';
import { getTotalXP, getLevelInfo } from '@/shared/lib/testcraft/xp-system';
import styles from './styles.module.scss';

interface SidebarProps {
  currentScreen: string;
  history: HistoryEntry[];
  authUser: string;
  onNavigate: (screen: string) => void;
  onFilterTasks: (type: string) => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Дашборд' },
  { id: 'tasks', label: 'Задания', badge: 10 },
  { id: 'history', label: 'История' },
  { id: 'theory', label: 'Теория' },
  { id: 'profile', label: 'Профиль' },
  { id: 'settings', label: 'Настройки API' },
];

const FILTER_ITEMS = [
  { id: 'functional', label: 'Функциональное' },
  { id: 'api', label: 'API' },
  { id: 'ui', label: 'UI/UX' },
  { id: 'bug', label: 'Баг-репорты' },
];

function userInitials(email: string): string {
  return email.charAt(0).toUpperCase();
}

export const Sidebar = ({
  currentScreen,
  history,
  authUser,
  onNavigate,
  onFilterTasks,
  onLogout,
}: SidebarProps) => {
  const xp = getTotalXP(history);
  const level = getLevelInfo(xp);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <a className={styles.logoMark}>
          <div className={styles.logoIcon}>⚙</div>
          <div>
            <div>TestCraft AI</div>
            <div className={styles.logoSub}>QA Learning Platform</div>
          </div>
        </a>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>Навигация</div>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`${styles.navItem} ${currentScreen === item.id ? styles.navItemActive : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <div className={styles.navDot} />
              {item.label}
              {item.badge ? <span className={styles.navBadge}>{item.badge}</span> : null}
            </div>
          ))}
        </div>

        <div className={styles.navSection}>
          <div className={styles.navLabel}>Виды тестирования</div>
          {FILTER_ITEMS.map((item) => (
            <div key={item.id} className={styles.navItem} onClick={() => onFilterTasks(item.id)}>
              <div className={styles.navDot} />
              {item.label}
            </div>
          ))}
        </div>
      </nav>

      <div className={styles.sidebarUser}>
        <div className={styles.userAvatar}>{userInitials(authUser)}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{authUser}</div>
          <div className={styles.userLevel}>
            Уровень {level.level} · {xp} XP
          </div>
        </div>
      </div>

      <div className={styles.logoutWrap}>
        <button className={styles.logoutBtn} onClick={onLogout}>
          Выйти
        </button>
      </div>
    </aside>
  );
};
