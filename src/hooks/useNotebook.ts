import { useState, useEffect, useCallback } from 'react';
import { NotebookData, Section, Task } from '@/types/notebook';

const STORAGE_KEY = 'daily-routine-notebook';

const getDefaultData = (): NotebookData => ({
  sections: [],
  totalDays: 30,
  startDate: new Date().toISOString().split('T')[0],
});

export const useNotebook = () => {
  const [data, setData] = useState<NotebookData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getDefaultData();
      }
    }
    return getDefaultData();
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addSection = useCallback((title: string) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title,
      tasks: [],
    };
    setData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  }, []);

  const updateSectionTitle = useCallback((sectionId: string, title: string) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, title } : s
      ),
    }));
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
    }));
  }, []);

  const addTask = useCallback((sectionId: string, text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: {},
    };
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, tasks: [...s.tasks, newTask] }
          : s
      ),
    }));
  }, []);

  const updateTaskText = useCallback((sectionId: string, taskId: string, text: string) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              tasks: s.tasks.map(t =>
                t.id === taskId ? { ...t, text } : t
              ),
            }
          : s
      ),
    }));
  }, []);

  const toggleTask = useCallback((sectionId: string, taskId: string, pageNumber: number) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              tasks: s.tasks.map(t =>
                t.id === taskId
                  ? {
                      ...t,
                      completed: {
                        ...t.completed,
                        [pageNumber]: !t.completed[pageNumber],
                      },
                    }
                  : t
              ),
            }
          : s
      ),
    }));
  }, []);

  const deleteTask = useCallback((sectionId: string, taskId: string) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, tasks: s.tasks.filter(t => t.id !== taskId) }
          : s
      ),
    }));
  }, []);

  const setTotalDays = useCallback((days: number) => {
    setData(prev => ({ ...prev, totalDays: days }));
  }, []);

  const getDateForPage = useCallback((pageNumber: number): Date => {
    const start = new Date(data.startDate);
    start.setDate(start.getDate() + pageNumber - 1);
    return start;
  }, [data.startDate]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= data.totalDays) {
      setCurrentPage(page);
    }
  }, [data.totalDays]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    data,
    currentPage,
    addSection,
    updateSectionTitle,
    deleteSection,
    addTask,
    updateTaskText,
    toggleTask,
    deleteTask,
    setTotalDays,
    getDateForPage,
    goToPage,
    nextPage,
    prevPage,
  };
};
