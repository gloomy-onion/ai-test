import { TASKS } from './tasks-data';
import type { Level, LevelInfo, HistoryEntry } from './types';

export const LEVELS: Level[] = [
  { level: 1, title: 'Новичок', xpNeeded: 0 },
  { level: 2, title: 'QA Apprentice', xpNeeded: 200 },
  { level: 3, title: 'QA Engineer', xpNeeded: 500 },
  { level: 4, title: 'Senior QA', xpNeeded: 1000 },
  { level: 5, title: 'QA Lead', xpNeeded: 2000 },
];

export function getTotalXP(history: HistoryEntry[]): number {
  return history.reduce((s, h) => {
    const task = TASKS.find((t) => t.id === h.taskId);
    const xp = task ? Math.round((task.xp * h.score) / 100) : 0;

    return s + xp;
  }, 0);
}

export function getLevelInfo(xp: number): LevelInfo {
  let lvl = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpNeeded) {
      lvl = l;
    } else {
      break;
    }
  }
  const idx = LEVELS.indexOf(lvl);
  const next = LEVELS[idx + 1];
  const pct = next ? Math.round(((xp - lvl.xpNeeded) / (next.xpNeeded - lvl.xpNeeded)) * 100) : 100;

  return { ...lvl, next, xp, pct };
}
