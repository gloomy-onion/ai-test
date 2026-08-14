export interface Task {
  id: number;
  title: string;
  type: 'functional' | 'api' | 'bug' | 'ui';
  typeLabel: string;
  difficulty: number;
  xp: number;
  docType: string;
  docLabel: string;
  accent: string;
  desc: string;
  requirement: string;
  template: string;
  placeholder: string;
}

export interface FeedbackSection {
  title: string;
  score: number;
  comment: string;
}

export interface HistoryEntry {
  taskId: number;
  taskTitle: string;
  score: number;
  xp: number;
  date: string;
  attempt: number;
  selfScore?: number;
  prevBestScore?: number;
}

export interface FeedbackResult {
  score: number;
  coverage: number;
  quality: number;
  summary: string;
  good: string[];
  missing: string[];
  tips: string[];
  sections?: FeedbackSection[];
}

export interface AIProvider {
  name: string;
  url: string;
  model: string;
  keyHint: string;
  free: boolean;
}

export interface Level {
  level: number;
  title: string;
  xpNeeded: number;
}

export interface LevelInfo extends Level {
  next: Level | undefined;
  xp: number;
  pct: number;
}

export interface TheoryTopic {
  icon: string;
  title: string;
  desc: string;
  q: string;
}

export interface Badge {
  id: string;
  icon: string;
  label: string;
  check: (done: number, history: HistoryEntry[], level: number) => boolean;
}

export type TaskCategory = 'functional' | 'api' | 'bug' | 'ui';

export interface CategoryProgress {
  category: TaskCategory;
  categoryLabel: string;
  total: number;
  done: number;
  bestScore: number;
  avgScore: number;
  xp: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
  todayDone: boolean;
}


