import { forwardRef } from 'react';
import { format } from 'date-fns';
import { Section, Task } from '@/types/notebook';
import { NotebookCheckbox } from './NotebookCheckbox';

interface DayPageProps {
  dayNumber: number;
  date: Date;
  sections: Section[];
  onToggleTask: (sectionId: string, taskId: string) => void;
  getTaskValueForDay: (task: Task, dayNumber: number) => number;
}

export const DayPage = forwardRef<HTMLDivElement, DayPageProps>(({
  dayNumber,
  date,
  sections,
  onToggleTask,
  getTaskValueForDay,
}, ref) => {
  return (
    <div 
      ref={ref}
      className="notebook-page page-curl min-h-[600px] rounded-sm overflow-hidden animate-fade-in"
    >
      {/* Page Header */}
      <div className="flex justify-between items-start pt-4 px-4 mb-4">
        <div className="pl-10">
          <span className="font-typewriter text-sm text-muted-foreground uppercase tracking-wider">
            Day {dayNumber}
          </span>
        </div>
        <div className="text-right">
          <span className="font-typewriter text-sm text-muted-foreground">
            {format(date, 'EEEE')}
          </span>
          <div className="font-handwritten text-xl text-primary font-bold">
            {format(date, 'MMM d, yyyy')}
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="pl-14 pr-4 pb-4 border-b-2 border-dashed border-muted-foreground/20">
        <h2 className="font-handwritten text-3xl font-bold text-foreground">
          Daily Challenges
        </h2>
      </div>

      {/* Sections - Simple scrollable layout */}
      <div className="pt-4 px-4 space-y-6 pb-16">
        {sections.map(section => (
          <div key={section.id} className="bg-secondary/20 rounded-lg border border-muted-foreground/20 overflow-hidden">
            {/* Section Header */}
            <div className="p-3 bg-primary/5 border-b border-primary/10">
              <span className="font-handwritten text-xl font-bold text-primary">
                {section.title}
              </span>
            </div>

            {/* Tasks */}
            <div className="p-3 space-y-2">
              {section.tasks.map(task => {
                const isCompleted = task.completed[dayNumber] || false;
                const counterValue = task.hasCounter ? getTaskValueForDay(task, dayNumber) : 0;
                
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 py-2 cursor-pointer group hover:bg-secondary/30 rounded px-2 -mx-2"
                    onClick={() => onToggleTask(section.id, task.id)}
                  >
                    <NotebookCheckbox
                      checked={isCompleted}
                      onChange={() => onToggleTask(section.id, task.id)}
                    />
                    <span
                      className={`font-handwritten text-lg transition-all flex-1 ${
                        isCompleted
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {task.text}
                      {task.hasCounter && (
                        <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-base">
                          × {counterValue}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}

              {section.tasks.length === 0 && (
                <p className="font-typewriter text-sm text-muted-foreground italic py-2">
                  No tasks in this section
                </p>
              )}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <p className="font-handwritten text-xl">No sections defined</p>
            <p className="font-typewriter text-sm mt-2">Go to Template page to add sections</p>
          </div>
        )}
      </div>

      {/* Page Footer */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="font-typewriter text-xs text-muted-foreground">
          — {dayNumber} —
        </span>
      </div>
    </div>
  );
});

DayPage.displayName = 'DayPage';
