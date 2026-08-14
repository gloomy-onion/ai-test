'use client';

import type { HistoryEntry } from '@/shared/lib/helpers/types';
import { Button, ScoreCircle } from '@/shared/ui/atoms';
import styles from './styles.module.scss';

interface HistoryRowProps {
  entry: HistoryEntry;
  onRepeat?: (taskId: number) => void;
}

export const HistoryRow = ({ entry, onRepeat }: HistoryRowProps) => {
  const attemptLabel = entry.attempt && entry.attempt > 1 ? `попытка #${entry.attempt}` : '';
  const improved = entry.prevBestScore !== undefined && entry.score > entry.prevBestScore;
  const unchanged = entry.prevBestScore !== undefined && entry.score <= entry.prevBestScore;

  return (
    <div className={styles.row}>
      <ScoreCircle score={entry.score} />
      <div className={styles.info}>
        <div className={styles.taskName}>{entry.taskTitle}</div>
        <div className={styles.date}>
          {entry.date}
          {attemptLabel ? ` · ${attemptLabel}` : ''}
          {entry.xp ? ` · +${entry.xp} XP` : ''}
          {improved ? ' 📈' : ''}
          {entry.selfScore ? ` · самооценка ${entry.selfScore}/5` : ''}
        </div>
        {unchanged && entry.prevBestScore !== undefined && (
          <div className={styles.prevBest}>
            Предыдущий лучший: {entry.prevBestScore}%
          </div>
        )}
      </div>
      {onRepeat && (
        <Button size="sm" onClick={() => onRepeat(entry.taskId)}>
          Повторить
        </Button>
      )}
    </div>
  );
};
