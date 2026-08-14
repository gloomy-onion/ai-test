'use client';

import styles from './styles.module.scss';

interface ScoreCardProps {
  value: number;
  suffix?: string;
  label: string;
}

const colorClass = (n: number): string => {
  if (n >= 80) {
    return styles.green;
  }
  if (n >= 55) {
    return styles.amber;
  }

  return styles.red;
};

export const ScoreCard = ({ value, suffix = '', label }: ScoreCardProps) => (
  <div className={styles.card}>
    <div className={`${styles.val} ${colorClass(value)}`}>
      {value}
      {suffix}
    </div>
    <div className={styles.label}>{label}</div>
  </div>
);
