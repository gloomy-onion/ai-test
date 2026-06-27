'use client';

import styles from './styles.module.scss';

interface SpinnerProps {
  size?: 'md' | 'sm';
}

export const Spinner = ({ size = 'md' }: SpinnerProps) => (
  <div className={`${styles.spinner} ${size === 'sm' ? styles.sm : ''}`} />
);

export const LoadingState = ({ text }: { text?: string }) => (
  <div className={styles.loadingState}>
    <Spinner />
    {text && <div>{text}</div>}
  </div>
);
