'use client';

import { TASKS } from '@/shared/lib/helpers/tasks-data';
import type { HistoryEntry } from '@/shared/lib/helpers/types';
import { getTotalXP, getLevelInfo, getStreakInfo, getCategoryProgress } from '@/shared/lib/helpers/xp-system';
import { buildMiniChart } from '@/shared/lib/helpers/mini-chart';
import {StatCard, TaskCard} from '@/shared/ui';
import '@/shared/ui/atoms/progress-bar';
import styles from './styles.module.scss';

interface DashboardScreenProps {
  history: HistoryEntry[];
  onOpenTask: (id: number) => void;
}

export const DashboardScreen = ({ history, onOpenTask }: DashboardScreenProps) => {
  const xp = getTotalXP(history);
  const lvl = getLevelInfo(xp);
  const bestByTask = new Map<number, HistoryEntry>();
  for (const h of history) {
    const prev = bestByTask.get(h.taskId);
    if (!prev || h.score > prev.score) {
      bestByTask.set(h.taskId, h);
    }
  }
  const done = bestByTask.size;
  const bestEntries = [...bestByTask.values()];
  const avg = bestEntries.length > 0
    ? Math.round(bestEntries.reduce((s, h) => s + h.score, 0) / bestEntries.length)
    : null;
  const streak = getStreakInfo(history);
  const categoryProgress = getCategoryProgress(history);
  const featured = TASKS.slice(0, 4);
  const last7 = bestEntries.slice(-7);
  const chartSVG = last7.length >= 2 ? buildMiniChart(last7) : '';
  const tasksWord = done === 1 ? 'задание' : done < 5 ? 'задания' : 'заданий';

  return (
    <>
      <div className={styles.statsRow}>
        <StatCard value={done} label="Заданий выполнено" color="accent" />
        <StatCard value={avg ? `${avg}%` : '—'} label="Средний балл" color="accent2" />
        <StatCard value={TASKS.length} label="Доступно заданий" color="accent3" />
        <StatCard value={lvl.level} label="Уровень" color="success" />
      </div>

      <div className={styles.dashProgress}>
        <div className={styles.dashProgressInner}>
          <div className={styles.dashProgressInfo}>
            <div className={styles.dashProgressTitle}>
              Уровень {lvl.level} — {lvl.title}
            </div>
            <div className={styles.dashProgressSub}>
              {xp} XP
              {lvl.next
                ? ` / ${lvl.next.xpNeeded} до «${lvl.next.title}»`
                : ' — максимальный уровень!'}
            </div>
            <div className={styles.dashProgressBarRow}>
              <span>Прогресс уровня</span>
              <span>{lvl.pct}%</span>
            </div>
            <progress-bar value={lvl.pct} />
            <div className={styles.dashBadges}>
              <span className={styles.streakBadge}>
                🔥 {done} {tasksWord}
              </span>
              {avg ? (
                <span className={`${styles.streakBadge} ${styles.streakBadgeAccent}`}>
                  📊 Среднее {avg}%
                </span>
              ) : null}
              {streak.current > 0 ? (
                <span className={`${styles.streakBadge} ${styles.streakBadgeAccent2}`}>
                  🔥 Серия: {streak.current} {streak.current === 1 ? 'день' : 'дня'}
                </span>
              ) : null}
            </div>
          </div>
          {chartSVG ? (
            <div className={styles.dashChart} dangerouslySetInnerHTML={{ __html: chartSVG }} />
          ) : (
            <div className={styles.dashChartPlaceholder}>
              График появится
              <br />
              после 2+ попыток
            </div>
          )}
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Прогресс по категориям</div>
      </div>
      <div className={styles.categoryMiniGrid}>
        {categoryProgress.map((cat) => (
          <div key={cat.category} className={styles.categoryMiniCard}>
            <div className={styles.categoryMiniHeader}>
              <span>{cat.categoryLabel}</span>
              <span>{cat.done}/{cat.total}</span>
            </div>
            <progress-bar value={cat.total > 0 ? Math.round((cat.done / cat.total) * 100) : 0} height="sm" />
          </div>
        ))}
      </div>

      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>С чего начать?</div>
        <div className={styles.sectionDesc}>
          Выберите задание и попробуйте написать тест-кейс или баг-репорт. AI-наставник проверит
          вашу работу.
        </div>
      </div>

      <div className={styles.tasksGrid}>
        {featured.map((task) => (
          <TaskCard key={task.id} task={task} history={history} onOpen={onOpenTask} />
        ))}
      </div>
    </>
  );
};
