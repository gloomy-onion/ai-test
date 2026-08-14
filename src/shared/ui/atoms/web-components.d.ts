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
      }
      'spinner-element': {
        key?: React.Key;
        class?: string;
        size?: 'sm' | 'md';
      }
    }
  }
}
