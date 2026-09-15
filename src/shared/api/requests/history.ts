import type { HistoryEntry } from '@/shared/lib/helpers/types';
import { apiInstance } from './base';

export const historyApi = {
  get: async (): Promise<HistoryEntry[]> => {
    const { data } = await apiInstance.get<{ history: HistoryEntry[] }>('/api/user/history');
    return data.history;
  },
  add: async (entry: HistoryEntry): Promise<void> => {
    await apiInstance.post('/api/user/history', { entry });
  },
  addMany: async (entries: Partial<HistoryEntry>[]): Promise<void> => {
    await apiInstance.post('/api/user/history', { history: entries });
  },
  clear: async (): Promise<void> => {
    await apiInstance.delete('/api/user/history');
  },
};