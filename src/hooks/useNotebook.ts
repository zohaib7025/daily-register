import { useState, useEffect, useCallback } from 'react';
import { NotebookData, Section, Task, SectionLayout, PageInfo, PageType } from '@/types/notebook';

const STORAGE_KEY = 'daily-routine-notebook';

const getDefaultLayout = (index: number): SectionLayout => ({
  x: (index % 2) * 6,
  y: Math.floor(index / 2) * 4,
  w: 6,
  h: 4,
});

const getDefaultData = (): NotebookData => ({
  title: 'My Daily Challenge',
  sections: [],
  totalDays: 30,
  startDate: new Date().toISOString().split('T')[0],
  layouts: {},
});

export const useNotebook = () => {
  const [data, setData] = useState<NotebookData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: add layout to existing sections if missing
        if (parsed.sections) {
          parsed.sections = parsed.sections.map((s: Section, i: number) => ({
            ...s,
            layout: s.layout || getDefaultLayout(i),
          }));
        }
        // Migration: add title if missing
        if (!parsed.title) {
          parsed.title = 'My Daily Challenge';
        }
        return parsed;
      } catch {
        return getDefaultData();
      }
    }
    return getDefaultData();
  });

  // Page navigation: 0 = cover, 1 = template, 2 to totalDays+1 = days, totalDays+2 = report
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Calculate total pages: cover(1) + template(1) + days(totalDays) + report(1)
  const totalPages = data.totalDays + 3;

  const getPageInfo = useCallback((pageIndex: number): PageInfo => {
    if (pageIndex === 0) return { type: 'cover' };
    if (pageIndex === 1) return { type: 'template' };
    if (pageIndex >= 2 && pageIndex <= data.totalDays + 1) {
      return { type: 'day', dayNumber: pageIndex - 1 };
    }
    return { type: 'report' };
  }, [data.totalDays]);

  const currentPageInfo = getPageInfo(currentPageIndex);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setTitle = useCallback((title: string) => {
    setData(prev => ({ ...prev, title }));
  }, []);

  const setStartDate = useCallback((startDate: string) => {
    setData(prev => ({ ...prev, startDate }));
  }, []);

  const addSection = useCallback((title: string) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title,
      tasks: [],
      layout: getDefaultLayout(data.sections.length),
    };
    setData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  }, [data.sections.length]);

  const updateSectionTitle = useCallback((sectionId: string, title: string) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, title } : s
      ),
    }));
  }, []);

  const updateSectionLayout = useCallback((sectionId: string, layout: SectionLayout) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, layout } : s
      ),
    }));
  }, []);

  const updateAllLayouts = useCallback((layouts: { id: string; layout: SectionLayout }[]) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        const updated = layouts.find(l => l.id === s.id);
        return updated ? { ...s, layout: updated.layout } : s;
      }),
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

  const toggleTask = useCallback((sectionId: string, taskId: string, dayNumber: number) => {
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
                        [dayNumber]: !t.completed[dayNumber],
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
    // Adjust current page if needed
    if (currentPageIndex > days + 2) {
      setCurrentPageIndex(days + 2); // Go to report page
    }
  }, [currentPageIndex]);

  const getDateForDay = useCallback((dayNumber: number): Date => {
    const start = new Date(data.startDate);
    start.setDate(start.getDate() + dayNumber - 1);
    return start;
  }, [data.startDate]);

  const getEndDate = useCallback((): Date => {
    return getDateForDay(data.totalDays);
  }, [data.totalDays, getDateForDay]);

  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPageIndex(pageIndex);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPageIndex + 1);
  }, [currentPageIndex, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPageIndex - 1);
  }, [currentPageIndex, goToPage]);

  // Analytics calculations
  const getAnalytics = useCallback(() => {
    const totalTasks = data.sections.reduce((sum, s) => sum + s.tasks.length, 0);
    const dailyCompletion: { day: number; completed: number; total: number; percentage: number }[] = [];
    
    for (let day = 1; day <= data.totalDays; day++) {
      let completed = 0;
      data.sections.forEach(s => {
        s.tasks.forEach(t => {
          if (t.completed[day]) completed++;
        });
      });
      dailyCompletion.push({
        day,
        completed,
        total: totalTasks,
        percentage: totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0,
      });
    }

    // Section breakdown
    const sectionBreakdown = data.sections.map(s => {
      let totalCompleted = 0;
      let totalPossible = s.tasks.length * data.totalDays;
      s.tasks.forEach(t => {
        Object.values(t.completed).forEach(c => {
          if (c) totalCompleted++;
        });
      });
      return {
        name: s.title,
        completed: totalCompleted,
        total: totalPossible,
        percentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      };
    });

    // Streak calculation
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let day = 1; day <= data.totalDays; day++) {
      const dayCompletion = dailyCompletion.find(d => d.day === day);
      if (dayCompletion && dayCompletion.percentage === 100) {
        tempStreak++;
        if (day === data.totalDays || dailyCompletion[day]?.percentage !== 100) {
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        }
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 0;
      }
    }

    // Calculate current streak from most recent day backwards
    for (let day = data.totalDays; day >= 1; day--) {
      const dayCompletion = dailyCompletion.find(d => d.day === day);
      if (dayCompletion && dayCompletion.percentage === 100) {
        currentStreak++;
      } else {
        break;
      }
    }

    const overallCompletion = dailyCompletion.reduce((sum, d) => sum + d.completed, 0);
    const overallTotal = totalTasks * data.totalDays;

    return {
      totalTasks,
      dailyCompletion,
      sectionBreakdown,
      currentStreak,
      longestStreak: Math.max(longestStreak, tempStreak),
      overallCompletion,
      overallTotal,
      overallPercentage: overallTotal > 0 ? Math.round((overallCompletion / overallTotal) * 100) : 0,
    };
  }, [data]);

  return {
    data,
    currentPageIndex,
    currentPageInfo,
    totalPages,
    setTitle,
    setStartDate,
    addSection,
    updateSectionTitle,
    updateSectionLayout,
    updateAllLayouts,
    deleteSection,
    addTask,
    updateTaskText,
    toggleTask,
    deleteTask,
    setTotalDays,
    getDateForDay,
    getEndDate,
    goToPage,
    nextPage,
    prevPage,
    getPageInfo,
    getAnalytics,
  };
};
