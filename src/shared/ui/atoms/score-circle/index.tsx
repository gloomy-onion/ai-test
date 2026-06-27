'use client';

import styles from './styles.module.scss';

interface ScoreCircleProps {
  score: number;
}

export function scoreColor(n: number): string {
  if (n >= 80) {
    return '#4ecd7a';
  }
  if (n >= 55) {
    return '#f7b32b';
  }

  return '#ff5c5c';
}

export const ScoreCircle = ({ score }: ScoreCircleProps) => {
  const color = scoreColor(score);

  return (
    <div className={styles.circle} style={{ borderColor: color, color }}>
      {score}
    </div>
  );
};
