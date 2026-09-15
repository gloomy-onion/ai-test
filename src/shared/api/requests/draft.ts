import { apiInstance } from './base';

export const draftApi = {
  get: async (taskId: number): Promise<string | null> => {
    const { data } = await apiInstance.get<{ body: string | null }>('/api/user/draft', {
      params: { task_id: taskId },
    });
    return data.body;
  },
  save: async (taskId: number, body: string): Promise<void> => {
    await apiInstance.post('/api/user/draft', { task_id: taskId, body });
  },
};