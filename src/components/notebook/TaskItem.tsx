import { useState } from 'react';
import { NotebookCheckbox } from './NotebookCheckbox';
import { Task } from '@/types/notebook';
import { Trash2, Pencil } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  pageNumber: number;
  onToggle: () => void;
  onUpdateText: (text: string) => void;
  onDelete: () => void;
}

export const TaskItem = ({
  task,
  pageNumber,
  onToggle,
  onUpdateText,
  onDelete,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const isCompleted = task.completed[pageNumber] || false;

  const handleSave = () => {
    if (editText.trim()) {
      onUpdateText(editText.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 py-2 pl-14 pr-4 group min-h-[32px]">
      <NotebookCheckbox checked={isCompleted} onChange={onToggle} />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="flex-1 bg-transparent border-b border-dashed border-muted-foreground/30 
                     font-handwritten text-xl text-ink focus:outline-none focus:border-primary"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 font-handwritten text-xl text-ink cursor-pointer
                      ${isCompleted ? 'line-through opacity-60' : ''}`}
          onClick={() => setIsEditing(true)}
        >
          {task.text}
        </span>
      )}

      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Edit task"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
