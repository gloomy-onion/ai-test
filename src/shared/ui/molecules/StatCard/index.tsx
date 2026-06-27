'use client';

import type { ReactNode } from 'react';
import styles from './styles.module.scss';

interface StatCardProps {
  value: ReactNode;
  label: string;
  color?: string;
}

export const StatCard = ({ value, label, color }: StatCardProps) => (
  <div className={styles.card}>
    <div className={styles.num} style={color ? { color } : undefined}>
      {value}
    </div>
    <div className={styles.label}>{label}</div>
  </div>
);
