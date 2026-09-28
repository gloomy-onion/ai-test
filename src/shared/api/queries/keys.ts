export const HISTORY_QUERY_KEY = 'history';
export const DRAFT_QUERY_KEY = 'draft';
export const SETTINGS_QUERY_KEY = 'settings';
export const USER_QUERY_KEY = 'user';
export const COMMUNITY_QUERY_KEY = 'community';

export const draftQueryKey = (taskId: number) => [DRAFT_QUERY_KEY, taskId] as const;