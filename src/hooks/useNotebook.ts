import { useState, useEffect, useCallback } from 'react';
import { NotebookData, Section, Task, SectionLayout, PageInfo, ChallengeAttempt } from '@/types/notebook';

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
  currentAttempt: 0,
  attempts: [],
  reminderTime: '20:00',
  reminderEnabled: false,
  theme: 'light',
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
        if (!parsed.title) parsed.title = 'My Daily Challenge';
        // Migration: add attempts if missing
        if (parsed.currentAttempt === undefined) parsed.currentAttempt = 0;
        if (!parsed.attempts) parsed.attempts = [];
        if (!parsed.theme) parsed.theme = 'light';
        return parsed;
      } catch {
        return getDefaultData();
      }
    }
    return getDefaultData();
  });

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
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

  const addTask = useCallback((
    sectionId: string,
    text: string,
    hasCounter?: boolean,
    counterStart?: number,
    counterIncrement?: number
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: {},
      hasCounter: hasCounter || false,
      counterStart: counterStart || 0,
      counterIncrement: counterIncrement || 0,
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
    if (currentPageIndex > days + 2) {
      setCurrentPageIndex(days + 2);
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

  // Reminder settings
  const setReminderEnabled = useCallback((enabled: boolean) => {
    setData(prev => ({ ...prev, reminderEnabled: enabled }));
  }, []);

  const setReminderTime = useCallback((time: string) => {
    setData(prev => ({ ...prev, reminderTime: time }));
  }, []);

  // Check if current day has incomplete tasks (for reset logic)
  const checkDayCompletion = useCallback((dayNumber: number): boolean => {
    const totalTasks = data.sections.reduce((sum, s) => sum + s.tasks.length, 0);
    if (totalTasks === 0) return true;
    
    let completed = 0;
    data.sections.forEach(s => {
      s.tasks.forEach(t => {
        if (t.completed[dayNumber]) completed++;
      });
    });
    return completed === totalTasks;
  }, [data.sections]);

  // Reset challenge (keep history, start new attempt)
  const resetChallenge = useCallback(() => {
    // Calculate how many days were completed in current attempt
    let completedDays = 0;
    for (let day = 1; day <= data.totalDays; day++) {
      if (checkDayCompletion(day)) {
        completedDays = day;
      } else {
        break;
      }
    }

    // Create attempt record
    const attempt: ChallengeAttempt = {
      id: crypto.randomUUID(),
      startedAt: data.startDate,
      endedAt: new Date().toISOString(),
      completedDays,
      sections: JSON.parse(JSON.stringify(data.sections)),
    };

    // Clear all completion data
    const clearedSections = data.sections.map(s => ({
      ...s,
      tasks: s.tasks.map(t => ({ ...t, completed: {} })),
    }));

    setData(prev => ({
      ...prev,
      sections: clearedSections,
      attempts: [...prev.attempts, attempt],
      currentAttempt: prev.attempts.length,
      startDate: new Date().toISOString().split('T')[0],
    }));

    setCurrentPageIndex(2); // Go to Day 1
  }, [data.sections, data.startDate, data.totalDays, checkDayCompletion]);

  // Check for missed day and trigger reset prompt
  const checkForMissedDay = useCallback((): { missed: boolean; dayNumber: number } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(data.startDate);
    start.setHours(0, 0, 0, 0);
    
    const daysPassed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check all previous days (not today)
    for (let day = 1; day < Math.min(daysPassed + 1, data.totalDays + 1); day++) {
      if (!checkDayCompletion(day)) {
        return { missed: true, dayNumber: day };
      }
    }
    return { missed: false, dayNumber: 0 };
  }, [data.startDate, data.totalDays, checkDayCompletion]);

  // Get task value for a specific day (for counter tasks)
  const getTaskValueForDay = useCallback((task: Task, dayNumber: number): number => {
    if (!task.hasCounter) return 0;
    return (task.counterStart || 0) + (task.counterIncrement || 0) * (dayNumber - 1);
  }, []);

  // Has incomplete tasks today
  const hasIncompleteTasksToday = useCallback((): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(data.startDate);
    start.setHours(0, 0, 0, 0);
    
    const currentDay = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (currentDay < 1 || currentDay > data.totalDays) return false;
    return !checkDayCompletion(currentDay);
  }, [data.startDate, data.totalDays, checkDayCompletion]);

  // Analytics
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

    const sectionBreakdown = data.sections.map(s => {
      let totalCompleted = 0;
      const totalPossible = s.tasks.length * data.totalDays;
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
    setReminderEnabled,
    setReminderTime,
    checkDayCompletion,
    resetChallenge,
    checkForMissedDay,
    getTaskValueForDay,
    hasIncompleteTasksToday,
  };
};
