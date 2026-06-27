'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger';
  size?: 'md' | 'sm';
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'default',
  size = 'md',
  fullWidth,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) => {
  const classes = [
    styles.btn,
    variant === 'primary' ? styles.primary : '',
    variant === 'danger' ? styles.danger : '',
    size === 'sm' ? styles.sm : '',
    disabled ? styles.disabled : '',
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};
