import type { HistoryEntry } from './types';
import { TASKS } from './tasks-data';

export const CATEGORY_ICONS: Record<string, string> = {
  functional: '🧪',
  api: '🔌',
  bug: '🐛',
  ui: '🎨',
};

export interface Badge {
  id: string;
  icon: string;
  label: string;
  check: (done: number, history: HistoryEntry[], level: number) => boolean;
}

export const BADGES: Badge[] = [
  { id: 'first', icon: '🎯', label: 'Первый шаг', check: (done) => done >= 1 },
  { id: 'five', icon: '🏅', label: '5 заданий', check: (done) => done >= 5 },
  { id: 'ten', icon: '🏆', label: '10 заданий', check: (done) => done >= 10 },
  {
    id: 'perfect',
    icon: '⭐',
    label: 'Отличник (90+)',
    check: (_done, history) => history.some((h) => h.score >= 90),
  },
  {
    id: 'improve',
    icon: '📈',
    label: 'Прогресс',
    check: (_done, history) => history.length >= 2,
  },
  {
    id: 'api',
    icon: '🔌',
    label: 'API-тестировщик',
    check: (_done, history) =>
      history.some((h) => {
        const t = TASKS.find((x) => x.id === h.taskId);
        return t?.type === 'api';
      }),
  },
  {
    id: 'bug',
    icon: '🐛',
    label: 'Охотник за багами',
    check: (_done, history) =>
      history.some((h) => {
        const t = TASKS.find((x) => x.id === h.taskId);
        return t?.type === 'bug';
      }),
  },
  {
    id: 'level3',
    icon: '🚀',
    label: 'QA Engineer',
    check: (_done, _history, level) => level >= 3,
  },
];
