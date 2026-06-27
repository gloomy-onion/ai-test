'use client';

import type { HistoryEntry } from '@/shared/lib/testcraft/types';
import { Button, ScoreCircle } from '@/shared/ui/atoms';
import styles from './styles.module.scss';

interface HistoryRowProps {
  entry: HistoryEntry;
  onRepeat?: (taskId: number) => void;
}

export const HistoryRow = ({ entry, onRepeat }: HistoryRowProps) => (
  <div className={styles.row}>
    <ScoreCircle score={entry.score} />
    <div className={styles.info}>
      <div className={styles.taskName}>{entry.taskTitle}</div>
      <div className={styles.date}>
        {entry.date} · +{entry.xp || 0} XP
      </div>
    </div>
    {onRepeat && (
      <Button size="sm" onClick={() => onRepeat(entry.taskId)}>
        Повторить
      </Button>
    )}
  </div>
);
