import type { HistoryEntry } from './types';

export const getAttemptCount = (history: HistoryEntry[], taskId: number): number => {
  return history.filter((h) => h.taskId === taskId).length + 1;
};

export const getBestScore = <T extends HistoryEntry>(history: T[], taskId: number): T | undefined => {
  const entries = history.filter((h) => h.taskId === taskId);
  if (!entries.length) return undefined;
  return entries.reduce((best, h) => (h.score > best.score ? h : best));
};