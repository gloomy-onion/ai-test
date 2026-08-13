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
    }
  }
}
