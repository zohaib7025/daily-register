export interface Task {
  id: string;
  text: string;
  completed: Record<number, boolean>; // pageNumber -> completed status
  hasCounter?: boolean;
  counterStart?: number;
  counterIncrement?: number;
}

export interface SectionLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Section {
  id: string;
  title: string;
  tasks: Task[];
  layout: SectionLayout;
}

export interface ChallengeAttempt {
  id: string;
  startedAt: string;
  endedAt?: string;
  completedDays: number;
  sections: Section[];
}

export interface NotebookData {
  title: string;
  sections: Section[];
  totalDays: number;
  startDate: string;
  layouts: Record<string, SectionLayout[]>;
  currentAttempt: number;
  attempts: ChallengeAttempt[];
  reminderTime?: string; // HH:mm format
  reminderEnabled?: boolean;
  theme: 'light' | 'dark';
}

export type PageType = 'cover' | 'template' | 'day' | 'report';

export interface PageInfo {
  type: PageType;
  dayNumber?: number; // Only for 'day' type
}
