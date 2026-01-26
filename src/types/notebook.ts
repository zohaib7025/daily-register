export interface Task {
  id: string;
  text: string;
  completed: Record<number, boolean>; // pageNumber -> completed status
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

export interface NotebookData {
  title: string;
  sections: Section[];
  totalDays: number;
  startDate: string;
  layouts: Record<string, SectionLayout[]>; // Store layouts per breakpoint if needed
}

export type PageType = 'cover' | 'template' | 'day' | 'report';

export interface PageInfo {
  type: PageType;
  dayNumber?: number; // Only for 'day' type
}
