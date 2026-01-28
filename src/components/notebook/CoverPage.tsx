import { forwardRef, useState } from 'react';
import { format } from 'date-fns';
import { BookOpen, Pencil, Calendar, RefreshCw } from 'lucide-react';
import { AttemptHistory } from './AttemptHistory';
import { ChallengeAttempt } from '@/types/notebook';

interface CoverPageProps {
  title: string;
  startDate: string;
  endDate: Date;
  totalDays: number;
  attempts: ChallengeAttempt[];
  currentAttempt: number;
  missedDay: { missed: boolean; dayNumber: number };
  onUpdateTitle: (title: string) => void;
  onUpdateStartDate: (date: string) => void;
  onUpdateTotalDays: (days: number) => void;
  onResetChallenge: () => void;
}

export const CoverPage = forwardRef<HTMLDivElement, CoverPageProps>(({
  title,
  startDate,
  endDate,
  totalDays,
  attempts,
  currentAttempt,
  missedDay,
  onUpdateTitle,
  onUpdateStartDate,
  onUpdateTotalDays,
  onResetChallenge,
}, ref) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(title);
  const [isEditingDays, setIsEditingDays] = useState(false);
  const [daysText, setDaysText] = useState(totalDays.toString());

  const handleSaveTitle = () => {
    if (titleText.trim()) {
      onUpdateTitle(titleText.trim());
    }
    setIsEditingTitle(false);
  };

  const handleSaveDays = () => {
    const days = parseInt(daysText);
    if (!isNaN(days) && days >= 1 && days <= 365) {
      onUpdateTotalDays(days);
    }
    setIsEditingDays(false);
  };

  return (
    <div 
      ref={ref}
      className="notebook-page page-curl min-h-[600px] rounded-sm overflow-hidden animate-fade-in flex flex-col items-center justify-center relative"
    >
      {/* Decorative elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-4 border-primary/20 rounded-full" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-4 border-primary/20 rounded-full" />
      <div className="absolute top-1/4 right-12 w-8 h-8 bg-primary/10 rotate-45" />
      <div className="absolute bottom-1/4 left-12 w-8 h-8 bg-primary/10 rotate-45" />

      {/* Reset Warning */}
      {missedDay.missed && (
        <div className="absolute top-4 left-4 right-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg z-20">
          <p className="font-typewriter text-sm text-destructive mb-2">
            ⚠️ You missed Day {missedDay.dayNumber}! Your challenge needs to restart.
          </p>
          <button
            onClick={onResetChallenge}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg 
                       font-typewriter text-sm hover:bg-destructive/90"
          >
            <RefreshCw size={16} />
            Start New Attempt
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="text-center z-10 px-8">
        <BookOpen size={64} className="mx-auto text-primary mb-6" />
        
        {/* Title */}
        {isEditingTitle ? (
          <input
            type="text"
            value={titleText}
            onChange={e => setTitleText(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
            className="w-full text-center bg-transparent border-b-4 border-primary 
                       font-handwritten text-5xl font-bold text-primary 
                       focus:outline-none"
            autoFocus
          />
        ) : (
          <h1
            onClick={() => setIsEditingTitle(true)}
            className="font-handwritten text-5xl font-bold text-primary cursor-pointer 
                       hover:underline decoration-wavy decoration-primary/30 flex items-center justify-center gap-3"
          >
            {title}
            <Pencil size={24} className="opacity-50" />
          </h1>
        )}

        {/* Challenge Duration */}
        <div className="mt-8 space-y-4">
          {isEditingDays ? (
            <div className="flex items-center justify-center gap-3">
              <input
                type="number"
                min={1}
                max={365}
                value={daysText}
                onChange={e => setDaysText(e.target.value)}
                onBlur={handleSaveDays}
                onKeyDown={e => e.key === 'Enter' && handleSaveDays()}
                className="w-20 text-center bg-transparent border-b-2 border-primary 
                           font-handwritten text-3xl text-primary focus:outline-none"
                autoFocus
              />
              <span className="font-handwritten text-3xl text-muted-foreground">Day Challenge</span>
            </div>
          ) : (
            <p
              onClick={() => setIsEditingDays(true)}
              className="font-handwritten text-3xl text-muted-foreground cursor-pointer hover:text-primary transition-colors"
            >
              {totalDays} Day Challenge ✦
            </p>
          )}

          {/* Date Range */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span className="font-typewriter text-sm text-muted-foreground">Start:</span>
              <input
                type="date"
                value={startDate}
                onChange={e => onUpdateStartDate(e.target.value)}
                className="bg-transparent border-b border-dashed border-primary 
                           font-handwritten text-lg text-foreground focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <p className="font-typewriter text-sm text-muted-foreground">
            End: {format(endDate, 'MMM d, yyyy')}
          </p>
        </div>

        {/* Attempt History */}
        {attempts.length > 0 && (
          <div className="mt-6">
            <AttemptHistory attempts={attempts} currentAttempt={currentAttempt} />
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          <p className="font-typewriter text-sm text-muted-foreground">
            ✦ Swipe right to set up your daily tasks ✦
          </p>
          <p className="font-typewriter text-sm text-muted-foreground mt-2">
            ✦ Complete ALL tasks each day to keep your streak ✦
          </p>
          <p className="font-typewriter text-sm text-muted-foreground mt-2">
            ✦ Missing a day resets your challenge ✦
          </p>
        </div>
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="font-typewriter text-xs text-muted-foreground">
          — Cover —
        </span>
      </div>
    </div>
  );
});

CoverPage.displayName = 'CoverPage';
