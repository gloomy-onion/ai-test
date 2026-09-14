import type { HistoryEntry } from './types';

const HISTORY_KEY = 'testcraft_history';
const HISTORY_ENDPOINT = '/api/user/history';
const DRAFT_ENDPOINT = '/api/user/draft';

export const migrateLegacyHistory = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  const raw = window.localStorage.getItem(HISTORY_KEY);

  if (!raw) {
    return;
  }

  try {
    const entries = JSON.parse(raw) as HistoryEntry[];

    if (!Array.isArray(entries) || entries.length === 0) {
      window.localStorage.removeItem(HISTORY_KEY);
      return;
    }

    const currentResponse = await fetch(HISTORY_ENDPOINT);
    const current = currentResponse.ok
      ? ((await currentResponse.json()) as { history?: HistoryEntry[] })
      : { history: undefined };

    if (current.history && current.history.length > 0) {
      window.localStorage.removeItem(HISTORY_KEY);
      return;
    }

    const response = await fetch(HISTORY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: entries }),
    });

    if (response.ok) {
      window.localStorage.removeItem(HISTORY_KEY);
    }
  } catch (error) {
    console.error('Failed to migrate history:', error);
  }
};

export const loadHistory = async (): Promise<HistoryEntry[]> => {
  try {
    const response = await fetch(HISTORY_ENDPOINT);

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { history?: HistoryEntry[] };

    return Array.isArray(data.history) ? data.history : [];
  } catch {
    return [];
  }
};

export const saveHistory = async (entry: HistoryEntry): Promise<void> => {
  try {
    await fetch(HISTORY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry }),
    });
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await fetch(HISTORY_ENDPOINT, { method: 'DELETE' });
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

export const loadDraft = async (taskId: number, defaultTemplate: string): Promise<string> => {
  if (!taskId) {
    return defaultTemplate;
  }

  try {
    const response = await fetch(`${DRAFT_ENDPOINT}?task_id=${taskId}`);

    if (!response.ok) {
      return defaultTemplate;
    }

    const data = (await response.json()) as { body?: string | null };

    return data.body ?? defaultTemplate;
  } catch {
    return defaultTemplate;
  }
};

export const saveDraft = async (taskId: number, value: string): Promise<void> => {
  if (!taskId) {
    return;
  }

  try {
    await fetch(DRAFT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, body: value }),
    });
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};

export const hasDraft = async (taskId: number, template: string): Promise<boolean> => {
  const draft = await loadDraft(taskId, template);

  return draft !== template;
};

export const getAttemptCount = (history: HistoryEntry[], taskId: number): number => {
  return history.filter((h) => h.taskId === taskId).length + 1;
};

export const getBestScore = <T extends HistoryEntry>(history: T[], taskId: number): T | undefined => {
  const entries = history.filter((h) => h.taskId === taskId);
  if (!entries.length) return undefined;
  return entries.reduce((best, h) => (h.score > best.score ? h : best));
};