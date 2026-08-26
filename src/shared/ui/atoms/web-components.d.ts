import type * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'badge-pill': {
        key?: React.Key;
        earned?: boolean | string;
        children?: React.ReactNode;
      };
      'difficulty-dots': {
        key?: React.Key;
        level?: number | string;
        max?: number | string;
      };
      'progress-bar': {
        key?: React.Key;
        class?: string;
        value?: number;
        height?: 'sm' | 'md' | 'lg';
      };
      'markdown-renderer': {
        key?: React.Key;
        class?: string;
        text?: string;
      };
      'score-circle': {
        key?: React.Key;
        class?: string;
        score?: number;
      };
      'spinner-element': {
        key?: React.Key;
        class?: string;
        size?: 'sm' | 'md';
      };
      'button-element': {
        key?: React.Key;
        variant?: 'default' | 'primary' | 'danger';
        size?: 'md' | 'sm';
        disabled?: boolean;
        fullWidth?: boolean;
        children?: React.ReactNode;
        onClick?: () => void;
        slot?: string;
        id?: string;
      };
      'popover-element': {
        key?: React.Key;
        id?: string;
        class?: string;
        position?: 'top-start' | 'bottom-start' | 'bottom-end' | 'top-end';
        open?: boolean;
        children?: React.ReactNode;
        hide?: boolean;
      }
      'pagination-element': {
        key?: React.Key;
        page?: number;
        totalPages?: number;
        onChange?: (event: CustomEvent<{ page: number; totalPages: number }>) => void;
      }
    }
  }
}
