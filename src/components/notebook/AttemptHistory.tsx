import { format } from 'date-fns';
import { History, Trophy, X } from 'lucide-react';
import { ChallengeAttempt } from '@/types/notebook';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AttemptHistoryProps {
  attempts: ChallengeAttempt[];
  currentAttempt: number;
}

export const AttemptHistory = ({ attempts, currentAttempt }: AttemptHistoryProps) => {
  if (attempts.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="px-3 py-1 rounded-full font-typewriter text-xs bg-secondary text-muted-foreground 
                     hover:bg-secondary/80 flex items-center gap-2"
        >
          <History size={14} />
          Attempt #{currentAttempt + 1}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-paper border-muted max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-handwritten text-2xl text-primary">
            Challenge History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {attempts.map((attempt, index) => (
            <div
              key={attempt.id}
              className={`p-4 rounded-lg border ${
                index === currentAttempt
                  ? 'border-primary bg-primary/10'
                  : 'border-muted bg-secondary/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-handwritten text-xl font-bold text-foreground">
                  Attempt #{index + 1}
                </span>
                {index === currentAttempt && (
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded text-xs font-typewriter">
                    Current
                  </span>
                )}
              </div>

              <div className="space-y-1 font-typewriter text-sm text-muted-foreground">
                <p>Started: {format(new Date(attempt.startedAt), 'MMM d, yyyy')}</p>
                {attempt.endedAt && (
                  <p>Ended: {format(new Date(attempt.endedAt), 'MMM d, yyyy')}</p>
                )}
                <p className="flex items-center gap-2">
                  <Trophy size={14} className="text-primary" />
                  Completed: {attempt.completedDays} days
                </p>
              </div>

              {attempt.endedAt && (
                <div className="mt-2 pt-2 border-t border-muted">
                  <p className="font-typewriter text-xs text-muted-foreground flex items-center gap-1">
                    <X size={12} className="text-destructive" />
                    Reset due to missed day
                  </p>
                </div>
              )}
            </div>
          ))}

          {attempts.length === 0 && (
            <p className="font-typewriter text-sm text-muted-foreground text-center py-8">
              No previous attempts yet. This is your first challenge!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
