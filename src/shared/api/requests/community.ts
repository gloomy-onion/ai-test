import { apiInstance } from './base';

export interface CommunityUser {
  id: string;
  username: string;
  xp: number;
}

export interface CommunityResponse {
  users: CommunityUser[];
  me: string;
}

export const communityApi = {
  get: async (): Promise<CommunityResponse> => {
    const { data } = await apiInstance.get<CommunityResponse>('/api/community');

    return data;
  },
};