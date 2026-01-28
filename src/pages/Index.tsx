import { useCallback } from 'react';
import { useNotebook } from '@/hooks/useNotebook';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useReminder } from '@/hooks/useReminder';
import { CoverPage } from '@/components/notebook/CoverPage';
import { TemplatePage } from '@/components/notebook/TemplatePage';
import { DayPage } from '@/components/notebook/DayPage';
import { ReportPage } from '@/components/notebook/ReportPage';
import { PageNavigation } from '@/components/notebook/PageNavigation';
import { ThemeToggle } from '@/components/notebook/ThemeToggle';
import { ReminderSettings } from '@/components/notebook/ReminderSettings';
import { ReminderBadge } from '@/components/notebook/ReminderBadge';

const Index = () => {
  const {
    data,
    currentPageIndex,
    currentPageInfo,
    totalPages,
    setTitle,
    setStartDate,
    addSection,
    updateSectionTitle,
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
    getAnalytics,
    setReminderEnabled,
    setReminderTime,
    checkForMissedDay,
    resetChallenge,
    getTaskValueForDay,
    hasIncompleteTasksToday,
  } = useNotebook();

  const { containerRef, swipeOffset, isSwiping } = useSwipeNavigation({
    onSwipeLeft: nextPage,
    onSwipeRight: prevPage,
  });

  const {
    notificationPermission,
    requestPermission,
    showBadge,
    dismissBadge,
  } = useReminder({
    enabled: data.reminderEnabled || false,
    reminderTime: data.reminderTime,
    hasIncompleteTasks: hasIncompleteTasksToday(),
  });

  const missedDay = checkForMissedDay();

  const handleToggleReminder = useCallback(() => {
    if (!data.reminderEnabled && notificationPermission !== 'granted') {
      requestPermission().then(granted => {
        if (granted) {
          setReminderEnabled(true);
        }
      });
    } else {
      setReminderEnabled(!data.reminderEnabled);
    }
  }, [data.reminderEnabled, notificationPermission, requestPermission, setReminderEnabled]);

  const renderPage = () => {
    switch (currentPageInfo.type) {
      case 'cover':
        return (
          <CoverPage
            title={data.title}
            startDate={data.startDate}
            endDate={getEndDate()}
            totalDays={data.totalDays}
            attempts={data.attempts}
            currentAttempt={data.currentAttempt}
            missedDay={missedDay}
            onUpdateTitle={setTitle}
            onUpdateStartDate={setStartDate}
            onUpdateTotalDays={setTotalDays}
            onResetChallenge={resetChallenge}
          />
        );
      case 'template':
        return (
          <TemplatePage
            sections={data.sections}
            onAddSection={addSection}
            onUpdateSectionTitle={updateSectionTitle}
            onDeleteSection={deleteSection}
            onAddTask={addTask}
            onUpdateTaskText={updateTaskText}
            onDeleteTask={deleteTask}
          />
        );
      case 'day':
        return (
          <DayPage
            dayNumber={currentPageInfo.dayNumber!}
            date={getDateForDay(currentPageInfo.dayNumber!)}
            sections={data.sections}
            onToggleTask={(sectionId, taskId) => 
              toggleTask(sectionId, taskId, currentPageInfo.dayNumber!)
            }
            getTaskValueForDay={getTaskValueForDay}
          />
        );
      case 'report':
        return (
          <ReportPage
            analytics={getAnalytics()}
            totalDays={data.totalDays}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Top Bar */}
      <div className="max-w-2xl mx-auto mb-4 flex justify-end gap-2">
        <ReminderSettings
          enabled={data.reminderEnabled || false}
          time={data.reminderTime}
          notificationPermission={notificationPermission}
          onToggle={handleToggleReminder}
          onTimeChange={setReminderTime}
          onRequestPermission={requestPermission}
        />
        <ReminderBadge
          showBadge={showBadge}
          onDismiss={dismissBadge}
          reminderEnabled={data.reminderEnabled || false}
          onToggleReminder={handleToggleReminder}
        />
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <PageNavigation
        currentPageIndex={currentPageIndex}
        totalPages={totalPages}
        currentPageInfo={currentPageInfo}
        totalDays={data.totalDays}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        onGoToPage={goToPage}
      />

      {/* Page Content with Swipe */}
      <main 
        ref={containerRef}
        className="max-w-2xl mx-auto transition-transform"
        style={{
          transform: isSwiping ? `translateX(${swipeOffset}px)` : 'translateX(0)',
        }}
      >
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto mt-8 text-center">
        <p className="font-typewriter text-xs text-muted-foreground">
          ✦ Swipe through pages or use navigation tabs ✦
        </p>
      </footer>
    </div>
  );
};

export default Index;
