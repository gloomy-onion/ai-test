export { ROUTES } from './config';
export { TOKEN_NAME, TOKEN_MAX_AGE, createToken, verifyToken } from './auth';
export { TASKS, THEORY_TOPICS, HINTS_MAP } from '@/shared/lib/helpers/tasks-data';
export {
  PROVIDERS,
  callClaude,
  buildPrompt,
  getHint,
  scoreColor,
} from '@/shared/lib/helpers/ai-provider';
export { LEVELS, getTotalXP, getLevelInfo } from '@/shared/lib/helpers/xp-system';
export { loadHistory, saveHistory, loadDraft, saveDraft } from '@/shared/lib/helpers/storage';
export type {
  Task,
  HistoryEntry,
  FeedbackResult,
  LevelInfo,
  TheoryTopic,
} from '@/shared/lib/helpers/types';
