import { useState } from 'react';
import { Section } from '@/types/notebook';
import { TaskItem } from './TaskItem';
import { Plus, Trash2, Pencil } from 'lucide-react';

interface SectionBlockProps {
  section: Section;
  pageNumber: number;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
  onAddTask: (text: string) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTaskText: (taskId: string, text: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const SectionBlock = ({
  section,
  pageNumber,
  onUpdateTitle,
  onDelete,
  onAddTask,
  onToggleTask,
  onUpdateTaskText,
  onDeleteTask,
}: SectionBlockProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(section.title);
  const [newTaskText, setNewTaskText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleSaveTitle = () => {
    if (titleText.trim()) {
      onUpdateTitle(titleText.trim());
    }
    setIsEditingTitle(false);
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
      setIsAddingTask(false);
    }
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pl-14 pr-4 py-2 group border-b border-dashed border-muted-foreground/20">
        {isEditingTitle ? (
          <input
            type="text"
            value={titleText}
            onChange={e => setTitleText(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
            className="flex-1 bg-transparent font-handwritten text-2xl font-bold text-primary 
                       focus:outline-none border-b-2 border-primary"
            autoFocus
          />
        ) : (
          <h3
            className="flex-1 font-handwritten text-2xl font-bold text-primary cursor-pointer 
                       hover:underline decoration-wavy decoration-primary/30"
            onClick={() => setIsEditingTitle(true)}
          >
            {section.title}
          </h3>
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={() => setIsEditingTitle(true)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Edit section title"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Delete section"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-0">
        {section.tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            pageNumber={pageNumber}
            onToggle={() => onToggleTask(task.id)}
            onUpdateText={text => onUpdateTaskText(task.id, text)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}

        {/* Add Task */}
        {isAddingTask ? (
          <div className="flex items-center gap-3 py-2 pl-14 pr-4">
            <div className="w-5 h-5 flex-shrink-0" />
            <input
              type="text"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              onBlur={() => {
                if (!newTaskText.trim()) setIsAddingTask(false);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddTask();
                if (e.key === 'Escape') setIsAddingTask(false);
              }}
              placeholder="Write your task..."
              className="flex-1 bg-transparent border-b border-dashed border-muted-foreground/30 
                         font-handwritten text-xl text-ink focus:outline-none focus:border-primary
                         placeholder:text-muted-foreground/50"
              autoFocus
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-2 py-2 pl-14 pr-4 w-full text-left
                       text-muted-foreground hover:text-primary transition-colors group"
          >
            <Plus size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-handwritten text-lg">Add task...</span>
          </button>
        )}
      </div>
    </div>
  );
};
