import { useNotebook } from '@/hooks/useNotebook';
import { NotebookPage } from '@/components/notebook/NotebookPage';
import { PageNavigation } from '@/components/notebook/PageNavigation';
import { NotebookSettings } from '@/components/notebook/NotebookSettings';
import { BookOpen } from 'lucide-react';

const Index = () => {
  const {
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
  } = useNotebook();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Header */}
      <header className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={32} className="text-primary" />
            <h1 className="font-handwritten text-4xl font-bold text-foreground">
              Daily Routine
            </h1>
          </div>
          <NotebookSettings
            totalDays={data.totalDays}
            onSetTotalDays={setTotalDays}
          />
        </div>
        <p className="font-typewriter text-sm text-muted-foreground mt-2 pl-11">
          Your personal challenge tracker
        </p>
      </header>

      {/* Navigation */}
      <PageNavigation
        currentPage={currentPage}
        totalPages={data.totalDays}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        onGoToPage={goToPage}
      />

      {/* Notebook Page */}
      <main className="max-w-2xl mx-auto">
        <NotebookPage
          key={currentPage}
          pageNumber={currentPage}
          date={getDateForPage(currentPage)}
          sections={data.sections}
          onAddSection={addSection}
          onUpdateSectionTitle={updateSectionTitle}
          onDeleteSection={deleteSection}
          onAddTask={addTask}
          onToggleTask={(sectionId, taskId) => toggleTask(sectionId, taskId, currentPage)}
          onUpdateTaskText={updateTaskText}
          onDeleteTask={deleteTask}
        />
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto mt-8 text-center">
        <p className="font-typewriter text-xs text-muted-foreground">
          ✦ Create sections and tasks on any page — they appear on all pages ✦
        </p>
        <p className="font-typewriter text-xs text-muted-foreground mt-1">
          ✦ Check off tasks per day to track your progress ✦
        </p>
      </footer>
    </div>
  );
};

export default Index;
