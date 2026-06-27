'use client';

import { TASKS } from '@/shared/lib/testcraft/tasks-data';
import type { HistoryEntry } from '@/shared/lib/testcraft/types';
import { getTotalXP, getLevelInfo } from '@/shared/lib/testcraft/xp-system';
import styles from '../../styles.module.scss';

interface ProfileScreenProps {
  history: HistoryEntry[];
  onOpenTask: (id: number) => void;
  onClearHistory: () => void;
}

const BADGES = [
  { id: 'first', icon: '🎯', label: 'Первый шаг', check: (done: number) => done >= 1 },
  { id: 'five', icon: '🏅', label: '5 заданий', check: (done: number) => done >= 5 },
  { id: 'ten', icon: '🏆', label: '10 заданий', check: (done: number) => done >= 10 },
  {
    id: 'perfect',
    icon: '⭐',
    label: 'Отличник (90+)',
    check: (_done: number, _hist: HistoryEntry[]) => _hist.some((h) => h.score >= 90),
  },
  {
    id: 'improve',
    icon: '📈',
    label: 'Прогресс',
    check: (_done: number, _hist: HistoryEntry[]) => _hist.length >= 2,
  },
  {
    id: 'api',
    icon: '🔌',
    label: 'API-тестировщик',
    check: (_done: number, _hist: HistoryEntry[], _lvl: number) =>
      _hist.some((h) => {
        const t = TASKS.find((x) => x.id === h.taskId);

        return t?.type === 'api';
      }),
  },
  {
    id: 'bug',
    icon: '🐛',
    label: 'Охотник за багами',
    check: (_done: number, _hist: HistoryEntry[], _lvl: number) =>
      _hist.some((h) => {
        const t = TASKS.find((x) => x.id === h.taskId);

        return t?.type === 'bug';
      }),
  },
  {
    id: 'level3',
    icon: '🚀',
    label: 'QA Engineer',
    check: (_done: number, _hist: HistoryEntry[], _lvl: number) => _lvl >= 3,
  },
];

export function ProfileScreen({ history, onOpenTask, onClearHistory }: ProfileScreenProps) {
  const xp = getTotalXP(history);
  const lvl = getLevelInfo(xp);
  const done = history.length;
  const avg = done > 0 ? Math.round(history.reduce((s, h) => s + h.score, 0) / done) : 0;
  const best = done > 0 ? Math.max(...history.map((h) => h.score)) : 0;

  const sorted = [...history].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>QA</div>
        <div>
          <div className={styles.profileName}>Junior Tester</div>
          <div className={styles.profileLevel}>
            Уровень {lvl.level} — {lvl.title}
          </div>
          <div className={styles.profileXP}>
            {xp} / {lvl.next ? lvl.next.xpNeeded : xp} XP до следующего уровня
          </div>
        </div>
      </div>

      <div className={styles.progressBarRow}>
        <span>Прогресс уровня</span>
        <span>{lvl.pct}%</span>
      </div>
      <div className={styles.progressBar} style={{ height: 8, marginBottom: 32 }}>
        <div className={styles.progressFill} style={{ width: `${lvl.pct}%` }} />
      </div>

      <div className={styles.profileStatsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--accent)' }}>
            {done}
          </div>
          <div className={styles.statLabel}>Выполнено заданий</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--accent2)' }}>
            {avg ? `${avg}%` : '—'}
          </div>
          <div className={styles.statLabel}>Средний балл</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--success)' }}>
            {best || '—'}
          </div>
          <div className={styles.statLabel}>Лучший результат</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--accent3)' }}>
            {xp}
          </div>
          <div className={styles.statLabel}>Всего XP</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--text2)' }}>
            {TASKS.length - done}
          </div>
          <div className={styles.statLabel}>Осталось заданий</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: 'var(--accent)' }}>
            {lvl.level}
          </div>
          <div className={styles.statLabel}>Текущий уровень</div>
        </div>
      </div>

      <div className={styles.sectionTitle}>Достижения</div>
      <div className={styles.badgesRow}>
        {BADGES.map((b) => {
          const earned = b.check(done, history, lvl.level);

          return (
            <div
              key={b.id}
              className={`${styles.badgePill} ${earned ? styles.badgePillEarned : ''}`}
              title={earned ? 'Получено!' : 'Ещё не получено'}
            >
              <span>{b.icon}</span>
              <span>{b.label}</span>
              {!earned && <span style={{ color: 'var(--text3)', fontSize: 11 }}>🔒</span>}
            </div>
          );
        })}
      </div>

      <div className={styles.sectionTitle}>Лучшие результаты</div>
      {sorted.length ? (
        sorted.map((h) => {
          const color =
            h.score >= 80 ? 'var(--success)' : h.score >= 55 ? 'var(--accent3)' : 'var(--danger)';

          return (
            <div key={`${h.taskId}-${h.date}`} className={styles.historyItem}>
              <div className={styles.historyScoreBadge} style={{ borderColor: color, color }}>
                {h.score}
              </div>
              <div className={styles.historyInfo}>
                <div className={styles.historyTaskName}>{h.taskTitle}</div>
                <div className={styles.historyDate}>{h.date}</div>
              </div>
              <button
                className={`${styles.btn} ${styles.btnSm}`}
                onClick={() => onOpenTask(h.taskId)}
              >
                Повторить
              </button>
            </div>
          );
        })
      ) : (
        <div style={{ fontSize: 14, color: 'var(--text3)' }}>
          Выполните задания, чтобы увидеть результаты.
        </div>
      )}

      <div className={styles.profileClearRow}>
        <button
          className={`${styles.btn} ${styles.btnSm}`}
          style={{ color: 'var(--danger)', borderColor: 'rgba(255,92,92,0.4)' }}
          onClick={() => {
            // eslint-disable-next-line no-alert
            if (window.confirm('Сбросить весь прогресс? Это действие нельзя отменить.')) {
              onClearHistory();
            }
          }}
        >
          Сбросить прогресс
        </button>
      </div>
    </div>
  );
}
