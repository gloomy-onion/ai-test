export { ROUTES } from './config';
export { TOKEN_NAME, TOKEN_MAX_AGE, createToken, verifyToken } from './auth';
export { TASKS, THEORY_TOPICS, HINTS_MAP } from './testcraft/tasks-data';
export { PROVIDERS, callClaude, buildPrompt, getHint, scoreColor } from './testcraft/ai-provider';
export { LEVELS, getTotalXP, getLevelInfo } from './testcraft/xp-system';
export { loadHistory, saveHistory, loadDraft, saveDraft } from './testcraft/storage';
export type { Task, HistoryEntry, FeedbackResult, LevelInfo, TheoryTopic } from './testcraft/types';
