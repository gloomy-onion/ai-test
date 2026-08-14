'use client';

import { useState, useMemo } from 'react';
import { TASKS } from '@/shared/lib/helpers/tasks-data';
import type { HistoryEntry } from '@/shared/lib/helpers/types';
import { TaskCard } from '@/shared/ui';
import styles from './styles.module.scss';

interface TasksListScreenProps {
  history: HistoryEntry[];
  onOpenTask: (id: number) => void;
  initialFilter?: string;
  onFilterChange?: (filter: string) => void;
}

const TABS = [
  { id: 'all', label: 'Все задания' },
  { id: 'functional', label: 'Функциональное' },
  { id: 'api', label: 'API' },
  { id: 'bug', label: 'Баг-репорты' },
  { id: 'ui', label: 'UI/UX' },
];

export const TasksListScreen = ({
  history,
  onOpenTask,
  initialFilter = 'all',
  onFilterChange,
}: TasksListScreenProps) => {
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const handleFilter = (id: string) => {
    setActiveFilter(id);
    onFilterChange?.(id);
  };

  const solvedIds = useMemo(() => {
    const best = new Map<number, HistoryEntry>();
    for (const h of history) {
      const prev = best.get(h.taskId);
      if (!prev || h.score > prev.score) {
        best.set(h.taskId, h);
      }
    }
    return best;
  }, [history]);

  const filtered = activeFilter === 'all' ? TASKS : TASKS.filter((t) => t.type === activeFilter);

  const tabCounts = useMemo(() => {
    const counts: Record<string, { total: number; done: number }> = {};
    for (const tab of TABS) {
      const tasks = tab.id === 'all' ? TASKS : TASKS.filter((t) => t.type === tab.id);
      const done = tasks.filter((t) => solvedIds.has(t.id)).length;
      counts[tab.id] = { total: tasks.length, done };
    }
    return counts;
  }, [solvedIds]);

  return (
    <>
      <div className={styles.tabs}>
        {TABS.map((tab) => {
          const { total, done } = tabCounts[tab.id];

          return (
            <div
              key={tab.id}
              className={`${styles.tab} ${activeFilter === tab.id ? styles.tabActive : ''}`}
              onClick={() => handleFilter(tab.id)}
            >
              {tab.label}
              <span className={done === total ? styles.tabCountDone : styles.tabCount}>
                {done}/{total}
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.tasksSummary}>
        <span className={styles.summaryDone}>✓ Выполнено: {solvedIds.size}</span>
        <span className={styles.summaryTotal}>
          Осталось: {TASKS.length - solvedIds.size}
        </span>
      </div>
      <div className={styles.tasksGrid}>
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} history={history} onOpen={onOpenTask} />
        ))}
      </div>
    </>
  );
};
