import { apiInstance } from './base';

export const settingsApi = {
  get: async (): Promise<string> => {
    const { data } = await apiInstance.get<{ provider: string }>('/api/user/settings');
    return data.provider;
  },
  update: async (provider: string): Promise<void> => {
    await apiInstance.post('/api/user/settings', { provider });
  },
};