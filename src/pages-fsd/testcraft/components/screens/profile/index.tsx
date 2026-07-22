'use client';

import { TASKS } from '@/shared/lib/testcraft/tasks-data';
import type { HistoryEntry } from '@/shared/lib/testcraft/types';
import { getTotalXP, getLevelInfo, getCategoryProgress, getCategoryLevelInfo, getStreakInfo, getCategoryCompletionBonus } from '@/shared/lib/testcraft/xp-system';
import { BadgePill, Button, ProgressBar, HistoryRow, StatCard } from '@/shared/ui';
import styles from './styles.module.scss';

interface ProfileScreenProps {
  history: HistoryEntry[];
  onOpenTask: (id: number) => void;
  onClearHistory: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  functional: '🧪',
  api: '🔌',
  bug: '🐛',
  ui: '🎨',
};

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
  const uniqueTasks = new Set(history.map((h) => h.taskId));
  const done = uniqueTasks.size;
  const bestByTask = new Map<number, HistoryEntry>();
  for (const h of history) {
    const prev = bestByTask.get(h.taskId);
    if (!prev || h.score > prev.score) {
      bestByTask.set(h.taskId, h);
    }
  }
  const bestEntries = [...bestByTask.values()];
  const avg = bestEntries.length > 0
    ? Math.round(bestEntries.reduce((s, h) => s + h.score, 0) / bestEntries.length)
    : 0;
  const bestScore = bestEntries.length > 0 ? Math.max(...bestEntries.map((h) => h.score)) : 0;
  const sorted = bestEntries.sort((a, b) => b.score - a.score).slice(0, 5);
  const categoryProgress = getCategoryProgress(history);
  const streak = getStreakInfo(history);
  const completionBonus = getCategoryCompletionBonus(history);

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
      <ProgressBar value={lvl.pct} height="md" className={styles.profileProgress} />

      {streak.current > 0 && (
        <div className={styles.streakBanner}>
          🔥 Серия: {streak.current} {streak.current === 1 ? 'день' : 'дня подряд'} · Лучшая: {streak.longest} {streak.longest === 1 ? 'день' : 'дней'}
        </div>
      )}

      {completionBonus > 0 && (
        <div className={styles.completionBonusBanner}>
          🏆 Бонус за полностью пройденные категории: +{completionBonus} XP
        </div>
      )}

      <div className={styles.sectionTitle}>Прогресс по категориям</div>
      <div className={styles.categoryGrid}>
        {categoryProgress.map((cat) => {
          const catLevel = getCategoryLevelInfo(cat.xp);
          return (
            <div key={cat.category} className={styles.categoryCard}>
              <div className={styles.categoryCardHeader}>
                <span>{CATEGORY_ICONS[cat.category]}</span>
                <span className={styles.categoryCardLabel}>{cat.categoryLabel}</span>
                <span className={styles.categoryCardStats}>
                  {cat.done}/{cat.total}
                </span>
              </div>
              <ProgressBar value={cat.total > 0 ? Math.round((cat.done / cat.total) * 100) : 0} height="sm" />
              <div className={styles.categoryCardFooter}>
                <span>Ур. {catLevel.level}</span>
                <span>{cat.done > 0 ? `${cat.avgScore}%` : '—'}</span>
                <span>{cat.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.profileStatsGrid}>
        <StatCard value={done} label="Выполнено заданий" color="accent" />
        <StatCard value={avg ? `${avg}%` : '—'} label="Средний балл" color="accent2" />
        <StatCard value={bestScore || '—'} label="Лучший результат" color="success" />
        <StatCard value={xp} label="Всего XP" color="accent3" />
        <StatCard value={TASKS.length - done} label="Осталось заданий" color="text2" />
        <StatCard value={lvl.level} label="Текущий уровень" color="accent" />
      </div>

      <div className={styles.sectionTitle}>Достижения</div>
      <div className={styles.badgesRow}>
        {BADGES.map((b) => {
          const earned = b.check(done, history, lvl.level);

          return (
            <BadgePill key={b.id} earned={earned}>
              <span>{b.icon}</span>
              <span>{b.label}</span>
              {!earned && <span className={styles.badgeLock}>🔒</span>}
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
        <div className={styles.emptyMessage}>
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
