import type { HistoryEntry } from './types';

const HISTORY_KEY = 'testcraft_history';
const DRAFT_PREFIX = 'testcraft_draft_';

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
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
