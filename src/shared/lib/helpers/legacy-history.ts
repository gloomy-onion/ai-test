import type { HistoryEntry } from './types';
import { historyApi } from '@/shared/api/requests/history';

const HISTORY_KEY = 'testcraft_history';

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

    const current = await historyApi.get();

    if (current.length > 0) {
      window.localStorage.removeItem(HISTORY_KEY);
      return;
    }

    await historyApi.addMany(entries);
    window.localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to migrate history:', error);
  }
};