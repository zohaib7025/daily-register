import { format } from 'date-fns';
import { Section } from '@/types/notebook';
import { NotebookCheckbox } from './NotebookCheckbox';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface DayPageProps {
  dayNumber: number;
  date: Date;
  sections: Section[];
  onToggleTask: (sectionId: string, taskId: string) => void;
}

const SectionDisplay = ({
  section,
  dayNumber,
  onToggleTask,
}: {
  section: Section;
  dayNumber: number;
  onToggleTask: (sectionId: string, taskId: string) => void;
}) => {
  return (
    <div className="h-full bg-secondary/20 rounded-lg border border-muted-foreground/20 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Section Header */}
        <div className="p-2 bg-primary/5 border-b border-primary/10">
          <span className="font-handwritten text-lg font-bold text-primary">
            {section.title}
          </span>
        </div>

        {/* Tasks */}
        <div className="flex-1 overflow-auto p-2 space-y-1">
          {section.tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 py-1 cursor-pointer group"
              onClick={() => onToggleTask(section.id, task.id)}
            >
              <NotebookCheckbox
                checked={task.completed[dayNumber] || false}
                onChange={() => onToggleTask(section.id, task.id)}
              />
              <span
                className={`font-handwritten text-base transition-all ${
                  task.completed[dayNumber]
                    ? 'line-through text-muted-foreground'
                    : 'text-foreground'
                }`}
              >
                {task.text}
              </span>
            </div>
          ))}

          {section.tasks.length === 0 && (
            <p className="font-typewriter text-xs text-muted-foreground italic">
              No tasks in this section
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const DayPage = ({
  dayNumber,
  date,
  sections,
  onToggleTask,
}: DayPageProps) => {
  // Group sections into rows of 2
  const rows: Section[][] = [];
  for (let i = 0; i < sections.length; i += 2) {
    rows.push(sections.slice(i, i + 2));
  }

  return (
    <div className="notebook-page page-curl min-h-[600px] rounded-sm overflow-hidden animate-fade-in">
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

      {/* Sections Grid */}
      <div className="pt-4 px-4 space-y-4">
        {rows.map((row, rowIndex) => (
          <ResizablePanelGroup
            key={rowIndex}
            direction="horizontal"
            className="min-h-[180px] rounded-lg"
          >
            {row.map((section, colIndex) => (
              <>
                <ResizablePanel key={section.id} defaultSize={50} minSize={30}>
                  <SectionDisplay
                    section={section}
                    dayNumber={dayNumber}
                    onToggleTask={onToggleTask}
                  />
                </ResizablePanel>
                {colIndex < row.length - 1 && <ResizableHandle withHandle />}
              </>
            ))}
          </ResizablePanelGroup>
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
};
