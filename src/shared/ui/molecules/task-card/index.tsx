'use client';

import type { Task, HistoryEntry } from '@/shared/lib/testcraft/types';
import { DifficultyDots } from '@/shared/ui/atoms';
import styles from './styles.module.scss';

interface TaskCardProps {
  task: Task;
  history: HistoryEntry[];
  onOpen: (id: number) => void;
}

const TYPE_CLASS: Record<string, string> = {
  api: styles.typeApi,
  bug: styles.typeBug,
  ui: styles.typeUi,
};

const ACCENT_CLASS: Record<string, string> = {
  '#6c63ff': styles.accent1,
  '#4ecdbe': styles.accent2,
  '#ff5c5c': styles.accent3,
  '#f7b32b': styles.accent4,
};

export const TaskCard = ({ task, history, onOpen }: TaskCardProps) => {
  const done = history.find((h) => h.taskId === task.id);

  return (
    <div
      className={`${styles.card} ${ACCENT_CLASS[task.accent] || ''}`}
      onClick={() => onOpen(task.id)}
    >
      <div className={styles.meta}>
        <span className={`${styles.type} ${TYPE_CLASS[task.type] || ''}`}>{task.typeLabel}</span>
        <DifficultyDots level={task.difficulty} />
      </div>
      <div className={styles.title}>{task.title}</div>
      <div className={styles.desc}>{task.desc}</div>
      <div className={styles.footer}>
        <span className={styles.stat}>+{task.xp} XP</span>
        <span className={styles.stat}>{task.docLabel}</span>
        {done ? <span className={styles.completed}>✓ {done.score}%</span> : null}
      </div>
    </div>
  );
};
