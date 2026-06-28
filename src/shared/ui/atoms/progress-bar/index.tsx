'use client';

import styles from './styles.module.scss';

const STEP = 5;

const HEIGHT_CLASS: Record<string, string> = {
  sm: styles.trackSm,
  md: styles.trackMd,
  lg: styles.trackLg,
};

interface ProgressBarProps {
  value: number;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar = ({ value, height = 'sm', className = '' }: ProgressBarProps) => {
  const pct = Math.min(100, Math.max(0, Math.round(value / STEP) * STEP));
  const fillClass = (styles as Record<string, string>)[`fill${pct}`] || styles.fill0;
  const heightClass = HEIGHT_CLASS[height] || styles.trackSm;

  return (
    <div className={`${styles.track} ${heightClass} ${className}`}>
      <div className={`${styles.fill} ${fillClass}`} />
    </div>
  );
};
