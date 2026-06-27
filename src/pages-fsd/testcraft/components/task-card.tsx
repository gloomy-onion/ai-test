'use client';

import type { Task, HistoryEntry } from '@/shared/lib/testcraft/types';
import styles from '../styles.module.scss';

interface TaskCardProps {
  task: Task;
  history: HistoryEntry[];
  onOpen: (id: number) => void;
}

function diffDots(n: number, max = 3): string {
  return Array.from(
    { length: max },
    (_, i) => `<div class="${styles.diffDot}${i < n ? ` ${styles.diffDotFilled}` : ''}"></div>`,
  ).join('');
}

export function TaskCard({ task, history, onOpen }: TaskCardProps) {
  const done = history.find((h) => h.taskId === task.id);

  return (
    <div
      className={styles.taskCard}
      style={{ '--card-accent': task.accent } as React.CSSProperties}
      onClick={() => onOpen(task.id)}
    >
      <div className={styles.taskMeta}>
        <span className={`${styles.taskType} ${styles[task.type] || ''}`}>{task.typeLabel}</span>
        <div
          className={styles.diffDots}
          dangerouslySetInnerHTML={{ __html: diffDots(task.difficulty) }}
        />
      </div>
      <div className={styles.taskTitle}>{task.title}</div>
      <div className={styles.taskDesc}>{task.desc}</div>
      <div className={styles.taskFooter}>
        <span className={styles.taskStat}>+{task.xp} XP</span>
        <span className={styles.taskStat}>{task.docLabel}</span>
        {done ? <span className={styles.taskCompleted}>✓ {done.score}%</span> : null}
      </div>
    </div>
  );
}
