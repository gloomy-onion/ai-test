'use client';

import { useQuery } from '@tanstack/react-query';
import { communityOptions } from '@/shared/api';
import { getUserInitials } from '@/shared/lib/helpers/user';
import { getLevelInfo } from '@/shared/lib/helpers/xp-system';
import styles from './styles.module.scss';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, var(--accent), var(--accent2))',
  'linear-gradient(135deg, var(--accent2), #4ecdbe)',
  'linear-gradient(135deg, var(--accent3), var(--accent))',
  'linear-gradient(135deg, var(--accent), #7d76ff)',
];

export const CommunityScreen = () => {
  const { data, isPending } = useQuery(communityOptions());
  const users = data?.users ?? [];
  const me = data?.me ?? '';

  if (isPending) {
    return (
      <div className={styles.communityContainer}>
        <div className={styles.sectionTitle}>Сообщество</div>
        <div className={styles.loadingText}>Загружаю участников...</div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className={styles.communityContainer}>
        <div className={styles.sectionTitle}>Сообщество</div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <div className={styles.emptyText}>
            Пока никого нет. Станьте первым участником сообщества!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.communityContainer}>
      <div className={styles.sectionTitle}>Сообщество</div>
      <div className={styles.communitySubtitle}>
        Всего участников: {users.length}
      </div>
      <div className={styles.usersGrid}>
        {users.map((user, index) => {
          const isMe = user.id === me;
          const initials = getUserInitials(user.username);
          const level = getLevelInfo(user.xp);

          return (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.avatarWrap}>
                <div
                  className={styles.avatar}
                  style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
                >
                  {initials}
                </div>
                <span className={styles.presenceDot} />
              </div>
              <div className={styles.userName}>
                {user.username || 'Пользователь'}
                {isMe && <span className={styles.meBadge}>это вы</span>}
              </div>
              <div className={styles.userLevel}>
                Уровень {level.level}
              </div>
              <div className={styles.userLevelTitle}>{level.title}</div>
              <div className={styles.userXP}>{user.xp} XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};