'use client';

import type { ReactNode } from 'react';
import styles from './styles.module.scss';

type ColorVariant = 'accent' | 'accent2' | 'accent3' | 'success' | 'text2';

const COLOR_CLASS: Record<ColorVariant, string> = {
  accent: styles.numAccent,
  accent2: styles.numAccent2,
  accent3: styles.numAccent3,
  success: styles.numSuccess,
  text2: styles.numText2,
};

interface StatCardProps {
  value: ReactNode;
  label: string;
  color?: ColorVariant;
}

export const StatCard = ({ value, label, color }: StatCardProps) => (
  <div className={styles.card}>
    <div className={`${styles.num} ${color ? COLOR_CLASS[color] : ''}`}>
      {value}
    </div>
    <div className={styles.label}>{label}</div>
  </div>
);
