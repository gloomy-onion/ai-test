'use client';

import styles from './styles.module.scss';

interface ProgressBarProps {
  value: number;
  height?: number;
  className?: string;
}

export const ProgressBar = ({ value, height = 4, className = '' }: ProgressBarProps) => (
  <div className={`${styles.track} ${className}`} style={{ height }}>
    <div className={styles.fill} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);
