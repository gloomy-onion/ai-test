'use client';

import { TASKS } from '@/shared/lib/testcraft/tasks-data';
import type { HistoryEntry } from '@/shared/lib/testcraft/types';
import { getTotalXP, getLevelInfo } from '@/shared/lib/testcraft/xp-system';
import { BadgePill, Button, ProgressBar, HistoryRow, StatCard } from '@/shared/ui';
import styles from './styles.module.scss';

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
    check: (_done: number, _hist: HistoryEntry[]) =>
      _hist.some((h) => {
        const t = TASKS.find((x) => x.id === h.taskId);

        return t?.type === 'api';
      }),
  },
  {
    id: 'bug',
    icon: '🐛',
    label: 'Охотник за багами',
    check: (_done: number, _hist: HistoryEntry[]) =>
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

export const ProfileScreen = ({ history, onOpenTask, onClearHistory }: ProfileScreenProps) => {
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
      <ProgressBar value={lvl.pct} height={8} className={styles.profileProgress} />

      <div className={styles.profileStatsGrid}>
        <StatCard value={done} label="Выполнено заданий" color="var(--accent)" />
        <StatCard value={avg ? `${avg}%` : '—'} label="Средний балл" color="var(--accent2)" />
        <StatCard value={best || '—'} label="Лучший результат" color="var(--success)" />
        <StatCard value={xp} label="Всего XP" color="var(--accent3)" />
        <StatCard value={TASKS.length - done} label="Осталось заданий" color="var(--text2)" />
        <StatCard value={lvl.level} label="Текущий уровень" color="var(--accent)" />
      </div>

      <div className={styles.sectionTitle}>Достижения</div>
      <div className={styles.badgesRow}>
        {BADGES.map((b) => {
          const earned = b.check(done, history, lvl.level);

          return (
            <BadgePill key={b.id} earned={earned}>
              <span>{b.icon}</span>
              <span>{b.label}</span>
              {!earned && <span style={{ color: 'var(--text3)', fontSize: 11 }}>🔒</span>}
            </BadgePill>
          );
        })}
      </div>

      <div className={styles.sectionTitle}>Лучшие результаты</div>
      {sorted.length ? (
        sorted.map((h) => (
          <HistoryRow key={`${h.taskId}-${h.date}`} entry={h} onRepeat={onOpenTask} />
        ))
      ) : (
        <div style={{ fontSize: 14, color: 'var(--text3)' }}>
          Выполните задания, чтобы увидеть результаты.
        </div>
      )}

      <div className={styles.profileClearRow}>
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            // eslint-disable-next-line no-alert
            if (window.confirm('Сбросить весь прогресс? Это действие нельзя отменить.')) {
              onClearHistory();
            }
          }}
        >
          Сбросить прогресс
        </Button>
      </div>
    </div>
  );
};
