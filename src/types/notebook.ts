export interface Task {
  id: string;
  text: string;
  completed: Record<number, boolean>; // pageNumber -> completed status
}

export interface Section {
  id: string;
  title: string;
  tasks: Task[];
}

export interface NotebookData {
  sections: Section[];
  totalDays: number;
  startDate: string;
}
