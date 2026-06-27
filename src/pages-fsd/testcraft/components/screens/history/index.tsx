'use client';

import type { HistoryEntry } from '@/shared/lib/testcraft/types';
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

  return (
    <>
      <div className={styles.sectionTitleLarge}>История выполнений</div>
      {history.map((h) => (
        <HistoryRow key={`${h.taskId}-${h.date}`} entry={h} onRepeat={onOpenTask} />
      ))}
    </>
  );
};
