import { format } from 'date-fns';
import { Section } from '@/types/notebook';
import { SectionBlock } from './SectionBlock';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface NotebookPageProps {
  pageNumber: number;
  date: Date;
  sections: Section[];
  onAddSection: (title: string) => void;
  onUpdateSectionTitle: (sectionId: string, title: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddTask: (sectionId: string, text: string) => void;
  onToggleTask: (sectionId: string, taskId: string) => void;
  onUpdateTaskText: (sectionId: string, taskId: string, text: string) => void;
  onDeleteTask: (sectionId: string, taskId: string) => void;
}

export const NotebookPage = ({
  pageNumber,
  date,
  sections,
  onAddSection,
  onUpdateSectionTitle,
  onDeleteSection,
  onAddTask,
  onToggleTask,
  onUpdateTaskText,
  onDeleteTask,
}: NotebookPageProps) => {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      onAddSection(newSectionTitle.trim());
      setNewSectionTitle('');
      setIsAddingSection(false);
    }
  };

  return (
    <div className="notebook-page page-curl min-h-[600px] rounded-sm overflow-hidden animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-start pt-4 px-4 mb-4">
        <div className="pl-10">
          <span className="font-typewriter text-sm text-muted-foreground uppercase tracking-wider">
            Day {pageNumber}
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

      {/* Sections */}
      <div className="pt-4">
        {sections.map(section => (
          <SectionBlock
            key={section.id}
            section={section}
            pageNumber={pageNumber}
            onUpdateTitle={title => onUpdateSectionTitle(section.id, title)}
            onDelete={() => onDeleteSection(section.id)}
            onAddTask={text => onAddTask(section.id, text)}
            onToggleTask={taskId => onToggleTask(section.id, taskId)}
            onUpdateTaskText={(taskId, text) => onUpdateTaskText(section.id, taskId, text)}
            onDeleteTask={taskId => onDeleteTask(section.id, taskId)}
          />
        ))}

        {/* Add Section */}
        {isAddingSection ? (
          <div className="flex items-center gap-3 pl-14 pr-4 py-3">
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
                         font-handwritten text-2xl text-primary font-bold
                         focus:outline-none placeholder:text-primary/40"
              autoFocus
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAddingSection(true)}
            className="flex items-center gap-2 pl-14 pr-4 py-3 w-full text-left
                       text-primary/70 hover:text-primary transition-colors group"
          >
            <Plus size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-handwritten text-xl">Add new section...</span>
          </button>
        )}
      </div>

      {/* Page Footer */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="font-typewriter text-xs text-muted-foreground">
          — {pageNumber} —
        </span>
      </div>
    </div>
  );
};
