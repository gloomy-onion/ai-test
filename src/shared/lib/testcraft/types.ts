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

export interface HistoryEntry {
  taskId: number;
  taskTitle: string;
  score: number;
  xp: number;
  date: string;
}

export interface FeedbackResult {
  score: number;
  coverage: number;
  quality: number;
  summary: string;
  good: string[];
  missing: string[];
  tips: string[];
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
