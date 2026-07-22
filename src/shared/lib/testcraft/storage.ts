import type { HistoryEntry } from './types';

const HISTORY_KEY = 'testcraft_history';
const DRAFT_PREFIX = 'testcraft_draft_';

const DEFAULT_ENTRY: Partial<HistoryEntry> = {
  attempt: 1,
  selfScore: undefined,
  prevBestScore: undefined,
};

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as HistoryEntry[];
    return raw.map((h) => ({ ...DEFAULT_ENTRY, ...h }));
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadDraft(taskId: number | null, defaultTemplate: string): string {
  if (!taskId || typeof window === 'undefined') {
    return defaultTemplate;
  }

  return localStorage.getItem(`${DRAFT_PREFIX}${taskId}`) || defaultTemplate;
}

export function saveDraft(taskId: number | null, value: string): void {
  if (!taskId || typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(`${DRAFT_PREFIX}${taskId}`, value);
}

export function hasDraft(taskId: number, template: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const draft = localStorage.getItem(`${DRAFT_PREFIX}${taskId}`);

  return !!draft && draft !== template;
}

export function getAttemptCount(history: HistoryEntry[], taskId: number): number {
  return history.filter((h) => h.taskId === taskId).length + 1;
}

export function getBestScore<T extends HistoryEntry>(history: T[], taskId: number): T | undefined {
  const entries = history.filter((h) => h.taskId === taskId);
  if (!entries.length) return undefined;
  return entries.reduce((best, h) => (h.score > best.score ? h : best));
}
