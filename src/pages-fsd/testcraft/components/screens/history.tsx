'use client';

import type { HistoryEntry } from '@/shared/lib/testcraft/types';
import styles from '../../styles.module.scss';

interface HistoryScreenProps {
  history: HistoryEntry[];
  onOpenTask: (id: number) => void;
}

export function HistoryScreen({ history, onOpenTask }: HistoryScreenProps) {
  if (!history.length) {
    return (
      <>
        <div className={styles.sectionTitleLarge}>История выполнений</div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <div className={styles.emptyText}>
            Вы ещё не выполнили ни одного задания.
            <br />
            Начните с любого задания из списка!
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.sectionTitleLarge}>История выполнений</div>
      {history.map((h) => {
        const color =
          h.score >= 80 ? 'var(--success)' : h.score >= 55 ? 'var(--accent3)' : 'var(--danger)';

        return (
          <div key={`${h.taskId}-${h.date}`} className={styles.historyItem}>
            <div className={styles.historyScoreBadge} style={{ borderColor: color, color }}>
              {h.score}
            </div>
            <div className={styles.historyInfo}>
              <div className={styles.historyTaskName}>{h.taskTitle}</div>
              <div className={styles.historyDate}>
                {h.date} · +{h.xp || 0} XP
              </div>
            </div>
            <button
              className={`${styles.btn} ${styles.btnSm}`}
              onClick={() => onOpenTask(h.taskId)}
            >
              Повторить
            </button>
          </div>
        );
      })}
    </>
  );
}
