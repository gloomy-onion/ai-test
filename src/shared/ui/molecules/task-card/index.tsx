'use client';

import type { Task, HistoryEntry } from '@/shared/lib/helpers/types';
import '@/shared/ui/atoms/difficulty-dots';
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
  const best = [...history]
    .filter((h) => h.taskId === task.id)
    .sort((a, b) => b.score - a.score)[0];

  const isSolved = !!best;

  return (
    <div
      className={`${styles.card} ${ACCENT_CLASS[task.accent] || ''} ${isSolved ? styles.cardSolved : styles.cardUnsolved}`}
      onClick={() => onOpen(task.id)}
    >
      {isSolved && <div className={styles.solvedRibbon}>✓</div>}
      <div className={styles.meta}>
        <span className={`${styles.type} ${TYPE_CLASS[task.type] || ''}`}>{task.typeLabel}</span>
        <difficulty-dots level={task.difficulty} />
        {isSolved && (
          <span className={styles.solvedPill}>
            ✓ {best.score}%
          </span>
        )}
      </div>
      <div className={styles.title}>{task.title}</div>
      <div className={styles.desc}>{task.desc}</div>
      <div className={styles.footer}>
        <span className={styles.stat}>+{task.xp} XP</span>
        <span className={styles.stat}>{task.docLabel}</span>
        <span className={isSolved ? styles.statDone : styles.statTodo}>
          {isSolved ? 'Выполнено' : 'Не решено'}
        </span>
      </div>
    </div>
  );
};
