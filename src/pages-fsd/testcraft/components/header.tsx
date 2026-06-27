'use client';

import { type ReactNode } from 'react';
import styles from '../styles.module.scss';

interface HeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <div className={styles.headerTitle}>{title}</div>
        <div className={styles.headerSub}>{subtitle}</div>
      </div>
      {actions ? <div className={styles.headerActions}>{actions}</div> : null}
    </div>
  );
}
