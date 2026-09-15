'use client';

import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { historyOptions } from '@/shared/api';
import { HistoryRow } from '@/shared/ui';
import styles from './styles.module.scss';

export const HistoryScreen = () => {
  const router = useRouter();
  const { data: history = [] } = useQuery(historyOptions());

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
          key={`${h.taskId}-${h.date}-${h.attempt}`}
          entry={h}
          onRepeat={(id) => router.push(`/tasks/${id}`)}
        />
      ))}
    </>
  );
};