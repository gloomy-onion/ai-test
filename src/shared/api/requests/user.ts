import { apiInstance } from './base';

export interface CurrentUser {
  email: string;
  username: string;
}

export const userApi = {
  get: async (): Promise<CurrentUser> => {
    const { data } = await apiInstance.get<CurrentUser>('/api/user');

    return data;
  },
};