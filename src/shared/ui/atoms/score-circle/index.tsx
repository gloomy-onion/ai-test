'use client';

import styles from './styles.module.scss';

interface ScoreCircleProps {
  score: number;
}

function scoreVariant(n: number): 'high' | 'mid' | 'low' {
  if (n >= 80) {
    return 'high';
  }
  if (n >= 55) {
    return 'mid';
  }

  return 'low';
}

export const ScoreCircle = ({ score }: ScoreCircleProps) => {
  const variant = scoreVariant(score);

  return (
    <div className={`${styles.circle} ${styles[variant]}`}>
      {score}
    </div>
  );
};
