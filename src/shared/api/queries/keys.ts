export const HISTORY_QUERY_KEY = 'history';
export const DRAFT_QUERY_KEY = 'draft';
export const SETTINGS_QUERY_KEY = 'settings';

export const draftQueryKey = (taskId: number) => [DRAFT_QUERY_KEY, taskId] as const;