export type IdeaStatus =
  | 'spark'
  | 'planned'
  | 'building'
  | 'testing'
  | 'done'
  | 'published'
  | 'archived';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

// Built-in categories. Custom ones are stored as plain strings via the store.
export type IdeaCategory = string;

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'status_change' | 'note' | 'manual';
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  priority: Priority;
  category: IdeaCategory;
  tags: string[];
  repoUrl: string;
  demoUrl: string;
  coverEmoji: string;
  progress: number; // 0-100
  notes: string;
  todos: Todo[];
  logs: LogEntry[];
  techStack: string[];
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_CONFIG: Record<
  IdeaStatus,
  { label: string; emoji: string; color: string; bg: string }
> = {
  spark: {
    label: 'Spark',
    emoji: '💡',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
  },
  planned: {
    label: 'Planned',
    emoji: '📋',
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.12)',
  },
  building: {
    label: 'Building',
    emoji: '🔨',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
  testing: {
    label: 'Testing',
    emoji: '🧪',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
  },
  done: {
    label: 'Done',
    emoji: '✅',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
  },
  published: {
    label: 'Published',
    emoji: '🚀',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.12)',
  },
  archived: {
    label: 'Archived',
    emoji: '🗄️',
    color: '#6b7280',
    bg: 'rgba(107, 114, 128, 0.12)',
  },
};

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string }
> = {
  low: { label: 'Low', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  high: { label: 'High', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  critical: { label: 'Critical', color: '#dc2626', bg: 'rgba(220,38,38,0.2)' },
};

export const ALL_STATUSES: IdeaStatus[] = [
  'spark',
  'planned',
  'building',
  'testing',
  'done',
  'published',
  'archived',
];
