import { TASKS } from './tasks-data';
import type { Level, LevelInfo, HistoryEntry, CategoryProgress, StreakInfo, TaskCategory } from './types';

export const CATEGORIES: { key: TaskCategory; label: string }[] = [
  { key: 'functional', label: 'Функциональное' },
  { key: 'api', label: 'API' },
  { key: 'bug', label: 'Баг-репорты' },
  { key: 'ui', label: 'UI/UX' },
];

export const CATEGORY_LEVELS: Level[] = [
  { level: 1, title: 'Новичок', xpNeeded: 0 },
  { level: 2, title: 'Практик', xpNeeded: 150 },
  { level: 3, title: 'Специалист', xpNeeded: 400 },
  { level: 4, title: 'Эксперт', xpNeeded: 800 },
];

export const LEVELS: Level[] = [
  { level: 1, title: 'Новичок', xpNeeded: 0 },
  { level: 2, title: 'QA Apprentice', xpNeeded: 200 },
  { level: 3, title: 'QA Engineer', xpNeeded: 500 },
  { level: 4, title: 'Senior QA', xpNeeded: 1000 },
  { level: 5, title: 'QA Lead', xpNeeded: 2000 },
];

export const getBestPerTask = (history: HistoryEntry[]): Map<number, HistoryEntry> => {
  const best = new Map<number, HistoryEntry>();
  for (const h of history) {
    const prev = best.get(h.taskId);
    if (!prev || h.score > prev.score) {
      best.set(h.taskId, h);
    }
  }
  return best;
};

export const getTotalXP = (history: HistoryEntry[]): number => {
  const byTask = getBestPerTask(history);
  let total = 0;
  for (const h of byTask.values()) {
    const task = TASKS.find((t) => t.id === h.taskId);
    if (task) {
      total += Math.round((task.xp * h.score) / 100);
    }
  }
  return total;
};

export const getLevelInfo = (xp: number): LevelInfo => {
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
};

export const getCategoryProgress = (history: HistoryEntry[]): CategoryProgress[] => {
  return CATEGORIES.map(({ key, label }) => {
    const tasks = TASKS.filter((t) => t.type === key);
    const categoryEntries = history.filter((h) => {
      const t = TASKS.find((x) => x.id === h.taskId);
      return t?.type === key;
    });
    const bestByTask = new Map<number, HistoryEntry>();
    for (const h of categoryEntries) {
      const prev = bestByTask.get(h.taskId);
      if (!prev || h.score > prev.score) {
        bestByTask.set(h.taskId, h);
      }
    }
    const done = bestByTask.size;
    const scores = [...bestByTask.values()].map((h) => h.score);
    const bestScore = scores.length ? Math.max(...scores) : 0;
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const xp = [...bestByTask.values()].reduce((s, h) => {
      const task = TASKS.find((t) => t.id === h.taskId);
      return s + (task ? Math.round((task.xp * h.score) / 100) : 0);
    }, 0);

    return { category: key, categoryLabel: label, total: tasks.length, done, bestScore, avgScore, xp };
  });
};

export const getCategoryLevelInfo = (categoryXp: number): LevelInfo => {
  let lvl = CATEGORY_LEVELS[0];
  for (const l of CATEGORY_LEVELS) {
    if (categoryXp >= l.xpNeeded) {
      lvl = l;
    } else {
      break;
    }
  }
  const idx = CATEGORY_LEVELS.indexOf(lvl);
  const next = CATEGORY_LEVELS[idx + 1];
  const pct = next
    ? Math.round(((categoryXp - lvl.xpNeeded) / (next.xpNeeded - lvl.xpNeeded)) * 100)
    : 100;

  return { ...lvl, next, xp: categoryXp, pct };
};

export const getStreakInfo = (history: HistoryEntry[]): StreakInfo => {
  const dates = new Set<string>();
  for (const h of history) {
    const d = h.date;
    dates.add(d);
  }
  const sorted = [...dates]
    .map((d) => {
      const [day, month, year] = d.split(/[.\s]+/);
      return new Date(`${month} ${day}, ${year}`);
    })
    .sort((a, b) => a.getTime() - b.getTime());

  let current = 0;
  let longest = 0;
  let streak = 0;
  const today = new Date();
  const todayStr = today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const diff = (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1) {
        streak++;
      } else {
        streak = 1;
      }
    }
    if (streak > longest) {
      longest = streak;
    }
  }

  const todayDone = dates.has(todayStr);
  const yesterdayDone = dates.has(todayStr) || dates.has(yesterdayStr);

  if (sorted.length > 0) {
    const lastDate = sorted[sorted.length - 1];
    const diffFromLast = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffFromLast <= 1 && yesterdayDone) {
      current = streak;
    } else if (todayDone) {
      current = 1;
    } else {
      current = 0;
    }
  }

  return { current, longest, todayDone };
};

export const getCategoryCompletionBonus = (history: HistoryEntry[]): number => {
  const progress = getCategoryProgress(history);
  let bonus = 0;
  for (const cat of progress) {
    if (cat.done > 0 && cat.done >= cat.total) {
      bonus += 50;
    }
  }
  return bonus;
};

export const calculateRetryXP = (taskXp: number, newScore: number, prevScore: number | undefined, attempt: number): number => {
  const earned = Math.round((taskXp * newScore) / 100);
  if (!prevScore) {
    return earned;
  }
  const prevEarned = Math.round((taskXp * prevScore) / 100);
  if (newScore <= prevScore) {
    return 0;
  }
  const improvement = earned - prevEarned;
  const retryFactor = attempt <= 2 ? 1 : Math.max(0.3, 1 - (attempt - 2) * 0.2);
  return Math.round(improvement * retryFactor);
};
