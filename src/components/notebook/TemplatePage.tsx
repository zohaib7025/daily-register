import { forwardRef, useState } from 'react';
import { Section, Task } from '@/types/notebook';
import { Plus, Trash2, Pencil, GripVertical, Settings2 } from 'lucide-react';
import { TaskFormModal } from './TaskFormModal';

interface TemplatePageProps {
  sections: Section[];
  onAddSection: (title: string) => void;
  onUpdateSectionTitle: (sectionId: string, title: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddTask: (sectionId: string, text: string, hasCounter?: boolean, counterStart?: number, counterIncrement?: number) => void;
  onUpdateTaskText: (sectionId: string, taskId: string, text: string) => void;
  onDeleteTask: (sectionId: string, taskId: string) => void;
}

export const TemplatePage = forwardRef<HTMLDivElement, TemplatePageProps>(({
  sections,
  onAddSection,
  onUpdateSectionTitle,
  onDeleteSection,
  onAddTask,
  onUpdateTaskText,
  onDeleteTask,
}, ref) => {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [addingTaskToSection, setAddingTaskToSection] = useState<string | null>(null);

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      onAddSection(newSectionTitle.trim());
      setNewSectionTitle('');
      setIsAddingSection(false);
    }
  };

  const handleAddTask = (sectionId: string, data: {
    text: string;
    hasCounter: boolean;
    counterStart: number;
    counterIncrement: number;
  }) => {
    onAddTask(sectionId, data.text, data.hasCounter, data.counterStart, data.counterIncrement);
  };

  return (
    <div 
      ref={ref}
      className="notebook-page page-curl min-h-[600px] rounded-sm overflow-hidden animate-fade-in"
    >
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
          Add sections and tasks • Changes apply to all days
        </p>
      </div>

      {/* Sections - Flexible layout */}
      <div className="pt-4 px-4 min-h-[400px] space-y-4 pb-16">
        {sections.map(section => (
          <div 
            key={section.id} 
            className="bg-secondary/30 rounded-lg border-2 border-dashed border-primary/30 overflow-hidden"
          >
            {/* Section Header */}
            <div className="flex items-center gap-2 p-3 bg-primary/10 border-b border-primary/20">
              <GripVertical size={16} className="cursor-move text-primary/50" />
              {editingSectionId === section.id ? (
                <input
                  type="text"
                  defaultValue={section.title}
                  onBlur={e => {
                    onUpdateSectionTitle(section.id, e.target.value);
                    setEditingSectionId(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      onUpdateSectionTitle(section.id, e.currentTarget.value);
                      setEditingSectionId(null);
                    }
                  }}
                  className="flex-1 bg-transparent font-handwritten text-xl font-bold text-primary focus:outline-none"
                  autoFocus
                />
              ) : (
                <span className="flex-1 font-handwritten text-xl font-bold text-primary">
                  {section.title}
                </span>
              )}
              <button
                onClick={() => setEditingSectionId(section.id)}
                className="p-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDeleteSection(section.id)}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Tasks */}
            <div className="p-3 space-y-2">
              {section.tasks.map((task: Task) => (
                <div key={task.id} className="flex items-center gap-2 group">
                  <span className="w-4 h-4 border-2 border-primary/30 rounded flex-shrink-0" />
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      defaultValue={task.text}
                      onBlur={e => {
                        onUpdateTaskText(section.id, task.id, e.target.value);
                        setEditingTaskId(null);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          onUpdateTaskText(section.id, task.id, e.currentTarget.value);
                          setEditingTaskId(null);
                        }
                      }}
                      className="flex-1 bg-transparent font-handwritten text-lg text-foreground focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => setEditingTaskId(task.id)}
                      className="flex-1 font-handwritten text-lg text-foreground cursor-pointer"
                    >
                      {task.text}
                      {task.hasCounter && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          (Start: {task.counterStart}, +{task.counterIncrement}/day)
                        </span>
                      )}
                    </span>
                  )}
                  <button
                    onClick={() => onDeleteTask(section.id, task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Add Task Button */}
              <button
                onClick={() => {
                  setAddingTaskToSection(section.id);
                  setTaskModalOpen(true);
                }}
                className="flex items-center gap-2 text-primary/60 hover:text-primary text-sm mt-2"
              >
                <Plus size={14} />
                <span className="font-handwritten">Add task</span>
              </button>
            </div>
          </div>
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

      {/* Task Form Modal */}
      <TaskFormModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        onSubmit={(data) => {
          if (addingTaskToSection) {
            handleAddTask(addingTaskToSection, data);
            setAddingTaskToSection(null);
          }
        }}
      />

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="font-typewriter text-xs text-muted-foreground">
          — Template —
        </span>
      </div>
    </div>
  );
});

TemplatePage.displayName = 'TemplatePage';
