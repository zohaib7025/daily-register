import { useState } from 'react';
import { Section, SectionLayout } from '@/types/notebook';
import { Plus, Trash2, Pencil, GripVertical, Settings2 } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface TemplatePageProps {
  sections: Section[];
  onAddSection: (title: string) => void;
  onUpdateSectionTitle: (sectionId: string, title: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddTask: (sectionId: string, text: string) => void;
  onUpdateTaskText: (sectionId: string, taskId: string, text: string) => void;
  onDeleteTask: (sectionId: string, taskId: string) => void;
  onUpdateLayouts: (layouts: { id: string; layout: SectionLayout }[]) => void;
}

const SectionCard = ({
  section,
  editingSectionId,
  editingTaskId,
  addingTaskToSection,
  newTaskText,
  onEditSection,
  onUpdateSectionTitle,
  onDeleteSection,
  onEditTask,
  onUpdateTaskText,
  onDeleteTask,
  onAddTaskToSection,
  onNewTaskTextChange,
  onAddTask,
  onCancelAddTask,
}: {
  section: Section;
  editingSectionId: string | null;
  editingTaskId: string | null;
  addingTaskToSection: string | null;
  newTaskText: string;
  onEditSection: (id: string | null) => void;
  onUpdateSectionTitle: (id: string, title: string) => void;
  onDeleteSection: (id: string) => void;
  onEditTask: (id: string | null) => void;
  onUpdateTaskText: (sectionId: string, taskId: string, text: string) => void;
  onDeleteTask: (sectionId: string, taskId: string) => void;
  onAddTaskToSection: (id: string | null) => void;
  onNewTaskTextChange: (text: string) => void;
  onAddTask: (sectionId: string) => void;
  onCancelAddTask: () => void;
}) => {
  return (
    <div className="h-full bg-secondary/30 rounded-lg border-2 border-dashed border-primary/30 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Section Header */}
        <div className="flex items-center gap-2 p-2 bg-primary/10 border-b border-primary/20">
          <GripVertical size={16} className="cursor-move text-primary/50" />
          {editingSectionId === section.id ? (
            <input
              type="text"
              defaultValue={section.title}
              onBlur={e => {
                onUpdateSectionTitle(section.id, e.target.value);
                onEditSection(null);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onUpdateSectionTitle(section.id, e.currentTarget.value);
                  onEditSection(null);
                }
              }}
              className="flex-1 bg-transparent font-handwritten text-lg font-bold text-primary focus:outline-none"
              autoFocus
            />
          ) : (
            <span className="flex-1 font-handwritten text-lg font-bold text-primary truncate">
              {section.title}
            </span>
          )}
          <button
            onClick={() => onEditSection(section.id)}
            className="p-1 text-muted-foreground hover:text-primary"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDeleteSection(section.id)}
            className="p-1 text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Tasks */}
        <div className="flex-1 overflow-auto p-2 space-y-1">
          {section.tasks.map(task => (
            <div key={task.id} className="flex items-center gap-2 group">
              <span className="w-4 h-4 border-2 border-primary/30 rounded flex-shrink-0" />
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  defaultValue={task.text}
                  onBlur={e => {
                    onUpdateTaskText(section.id, task.id, e.target.value);
                    onEditTask(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      onUpdateTaskText(section.id, task.id, e.currentTarget.value);
                      onEditTask(null);
                    }
                  }}
                  className="flex-1 bg-transparent font-handwritten text-base text-foreground focus:outline-none"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => onEditTask(task.id)}
                  className="flex-1 font-handwritten text-base text-foreground cursor-pointer truncate"
                >
                  {task.text}
                </span>
              )}
              <button
                onClick={() => onDeleteTask(section.id, task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {/* Add Task */}
          {addingTaskToSection === section.id ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4" />
              <input
                type="text"
                value={newTaskText}
                onChange={e => onNewTaskTextChange(e.target.value)}
                onBlur={() => {
                  if (!newTaskText.trim()) onCancelAddTask();
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') onAddTask(section.id);
                  if (e.key === 'Escape') onCancelAddTask();
                }}
                placeholder="Task name..."
                className="flex-1 bg-transparent font-handwritten text-base text-foreground 
                           focus:outline-none placeholder:text-muted-foreground/50"
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => onAddTaskToSection(section.id)}
              className="flex items-center gap-2 text-primary/60 hover:text-primary text-sm"
            >
              <Plus size={14} />
              <span className="font-handwritten">Add task</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const TemplatePage = ({
  sections,
  onAddSection,
  onUpdateSectionTitle,
  onDeleteSection,
  onAddTask,
  onUpdateTaskText,
  onDeleteTask,
}: TemplatePageProps) => {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [addingTaskToSection, setAddingTaskToSection] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      onAddSection(newSectionTitle.trim());
      setNewSectionTitle('');
      setIsAddingSection(false);
    }
  };

  const handleAddTask = (sectionId: string) => {
    if (newTaskText.trim()) {
      onAddTask(sectionId, newTaskText.trim());
      setNewTaskText('');
      setAddingTaskToSection(null);
    }
  };

  // Group sections into rows of 2
  const rows: Section[][] = [];
  for (let i = 0; i < sections.length; i += 2) {
    rows.push(sections.slice(i, i + 2));
  }

  return (
    <div className="notebook-page page-curl min-h-[600px] rounded-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start pt-4 px-4 mb-4">
        <div className="pl-10">
          <span className="font-typewriter text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Settings2 size={16} />
            Template Setup
          </span>
        </div>
      </div>

      <div className="pl-14 pr-4 pb-4 border-b-2 border-dashed border-muted-foreground/20">
        <h2 className="font-handwritten text-3xl font-bold text-foreground">
          Design Your Daily Tasks
        </h2>
        <p className="font-typewriter text-xs text-muted-foreground mt-1">
          Drag dividers to resize • Changes apply to all days
        </p>
      </div>

      {/* Sections Grid */}
      <div className="pt-4 px-4 min-h-[400px] space-y-4">
        {rows.map((row, rowIndex) => (
          <ResizablePanelGroup
            key={rowIndex}
            direction="horizontal"
            className="min-h-[200px] rounded-lg"
          >
            {row.map((section, colIndex) => (
              <>
                <ResizablePanel key={section.id} defaultSize={50} minSize={30}>
                  <SectionCard
                    section={section}
                    editingSectionId={editingSectionId}
                    editingTaskId={editingTaskId}
                    addingTaskToSection={addingTaskToSection}
                    newTaskText={newTaskText}
                    onEditSection={setEditingSectionId}
                    onUpdateSectionTitle={onUpdateSectionTitle}
                    onDeleteSection={onDeleteSection}
                    onEditTask={setEditingTaskId}
                    onUpdateTaskText={onUpdateTaskText}
                    onDeleteTask={onDeleteTask}
                    onAddTaskToSection={setAddingTaskToSection}
                    onNewTaskTextChange={setNewTaskText}
                    onAddTask={handleAddTask}
                    onCancelAddTask={() => setAddingTaskToSection(null)}
                  />
                </ResizablePanel>
                {colIndex < row.length - 1 && <ResizableHandle withHandle />}
              </>
            ))}
          </ResizablePanelGroup>
        ))}

        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <p className="font-handwritten text-xl">No sections yet</p>
            <p className="font-typewriter text-sm mt-2">Add a section to get started</p>
          </div>
        )}

        {/* Add Section Button */}
        <div className="mt-4 pl-10">
          {isAddingSection ? (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newSectionTitle}
                onChange={e => setNewSectionTitle(e.target.value)}
                onBlur={() => {
                  if (!newSectionTitle.trim()) setIsAddingSection(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddSection();
                  if (e.key === 'Escape') setIsAddingSection(false);
                }}
                placeholder="Section name..."
                className="flex-1 bg-transparent border-b-2 border-primary 
                           font-handwritten text-xl text-primary font-bold
                           focus:outline-none placeholder:text-primary/40"
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => setIsAddingSection(true)}
              className="flex items-center gap-2 text-primary/70 hover:text-primary transition-colors group"
            >
              <Plus size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-handwritten text-xl">Add new section...</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="font-typewriter text-xs text-muted-foreground">
          — Template —
        </span>
      </div>
    </div>
  );
};
