'use client';

import styles from './styles.module.scss';

interface DifficultyDotsProps {
  level: number;
  max?: number;
}

export const DifficultyDots = ({ level, max = 3 }: DifficultyDotsProps) => (
  <div className={styles.row}>
    {Array.from({ length: max }, (_, i) => (
      <div key={i} className={`${styles.dot} ${i < level ? styles.filled : ''}`} />
    ))}
  </div>
);
