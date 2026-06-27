'use client';

import type { ReactNode } from 'react';
import styles from './styles.module.scss';

interface BadgePillProps {
  earned?: boolean;
  children: ReactNode;
}

export const BadgePill = ({ earned = false, children }: BadgePillProps) => (
  <div className={`${styles.pill} ${earned ? styles.earned : ''}`}>{children}</div>
);
