'use client';

import { useState } from 'react';
import { TASKS } from '@/shared/lib/testcraft/tasks-data';
import type { HistoryEntry } from '@/shared/lib/testcraft/types';
import styles from '../../styles.module.scss';
import { TaskCard } from '../task-card';

interface TasksListScreenProps {
  history: HistoryEntry[];
  onOpenTask: (id: number) => void;
  initialFilter?: string;
}

const TABS = [
  { id: 'all', label: 'Все задания' },
  { id: 'functional', label: 'Функциональное' },
  { id: 'api', label: 'API' },
  { id: 'bug', label: 'Баг-репорты' },
  { id: 'ui', label: 'UI/UX' },
];

export function TasksListScreen({
  history,
  onOpenTask,
  initialFilter = 'all',
}: TasksListScreenProps) {
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const filtered = activeFilter === 'all' ? TASKS : TASKS.filter((t) => t.type === activeFilter);

  return (
    <>
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeFilter === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className={styles.tasksGrid}>
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} history={history} onOpen={onOpenTask} />
        ))}
      </div>
    </>
  );
}
