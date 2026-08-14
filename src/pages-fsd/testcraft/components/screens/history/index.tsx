'use client';

import type { HistoryEntry } from '@/shared/lib/helpers/types';
import { HistoryRow } from '@/shared/ui';
import styles from './styles.module.scss';

interface HistoryScreenProps {
  history: HistoryEntry[];
  onOpenTask: (id: number) => void;
}

export const HistoryScreen = ({ history, onOpenTask }: HistoryScreenProps) => {
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

  const sorted = [...history].reverse();

  return (
    <>
      <div className={styles.sectionTitleLarge}>История выполнений</div>
      <div className={styles.historySubtitle}>
        Всего попыток: {history.length} · Уникальных заданий: {new Set(history.map((h) => h.taskId)).size}
      </div>
      {sorted.map((h) => (
        <HistoryRow
          key={`${h.taskId}-${h.date}-${h.attempt}-${Math.random()}`}
          entry={h}
          onRepeat={onOpenTask}
        />
      ))}
    </>
  );
};
