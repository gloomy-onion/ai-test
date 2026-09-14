export { ROUTES } from './config';
export { TASKS, THEORY_TOPICS, HINTS_MAP } from '@/shared/lib/helpers/tasks-data';
export {
  PROVIDERS,
  callClaude,
  buildPrompt,
  getHint,
  scoreColor,
} from '@/shared/lib/helpers/ai-provider';
export { LEVELS, getTotalXP, getLevelInfo } from '@/shared/lib/helpers/xp-system';
export { getRemainingTasks } from '@/shared/lib/helpers/tasks-data';
export { getUserInitials } from '@/shared/lib/helpers/user';
export { writeClipboard, readClipboard } from '@/shared/lib/helpers/clipboard';
export { getNetworkInfo, subscribeToNetwork } from '@/shared/lib/helpers/network';
export type { NetworkInfo } from '@/shared/lib/helpers/network';
export {
  loadHistory,
  saveHistory,
  clearHistory,
  migrateLegacyHistory,
  loadDraft,
  saveDraft,
  hasDraft,
} from '@/shared/lib/helpers/storage';
export type {
  Task,
  HistoryEntry,
  FeedbackResult,
  LevelInfo,
  TheoryTopic,
} from '@/shared/lib/helpers/types';
