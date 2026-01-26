import { useNotebook } from '@/hooks/useNotebook';
import { CoverPage } from '@/components/notebook/CoverPage';
import { TemplatePage } from '@/components/notebook/TemplatePage';
import { DayPage } from '@/components/notebook/DayPage';
import { ReportPage } from '@/components/notebook/ReportPage';
import { PageNavigation } from '@/components/notebook/PageNavigation';

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
    updateAllLayouts,
    getAnalytics,
  } = useNotebook();

  const renderPage = () => {
    switch (currentPageInfo.type) {
      case 'cover':
        return (
          <CoverPage
            title={data.title}
            startDate={data.startDate}
            endDate={getEndDate()}
            totalDays={data.totalDays}
            onUpdateTitle={setTitle}
            onUpdateStartDate={setStartDate}
            onUpdateTotalDays={setTotalDays}
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
            onUpdateLayouts={updateAllLayouts}
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

      {/* Page Content */}
      <main className="max-w-2xl mx-auto">
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
