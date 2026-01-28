import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface TaskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    text: string;
    hasCounter: boolean;
    counterStart: number;
    counterIncrement: number;
  }) => void;
  initialText?: string;
}

export const TaskFormModal = ({
  open,
  onOpenChange,
  onSubmit,
  initialText = '',
}: TaskFormModalProps) => {
  const [text, setText] = useState(initialText);
  const [hasCounter, setHasCounter] = useState(false);
  const [counterStart, setCounterStart] = useState(5);
  const [counterIncrement, setCounterIncrement] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({
        text: text.trim(),
        hasCounter,
        counterStart,
        counterIncrement,
      });
      setText('');
      setHasCounter(false);
      setCounterStart(5);
      setCounterIncrement(5);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-paper border-muted">
        <DialogHeader>
          <DialogTitle className="font-handwritten text-2xl text-primary">
            Add New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Task Name */}
          <div>
            <label className="font-typewriter text-sm text-muted-foreground mb-2 block">
              Task Name
            </label>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="e.g., Push-ups, Reading, Meditation..."
              className="w-full bg-secondary border border-muted rounded px-3 py-2 
                         font-handwritten text-lg focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>

          {/* Counter Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-typewriter text-sm block">Progressive Counter</span>
              <span className="font-typewriter text-xs text-muted-foreground">
                Increase the target each day
              </span>
            </div>
            <Switch checked={hasCounter} onCheckedChange={setHasCounter} />
          </div>

          {/* Counter Settings */}
          {hasCounter && (
            <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center justify-between">
                <label className="font-typewriter text-sm">Starting Value (Day 1)</label>
                <input
                  type="number"
                  min={1}
                  value={counterStart}
                  onChange={e => setCounterStart(parseInt(e.target.value) || 1)}
                  className="w-20 bg-background border border-muted rounded px-2 py-1 
                             font-handwritten text-lg text-center focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="font-typewriter text-sm">Daily Increment (+)</label>
                <input
                  type="number"
                  min={0}
                  value={counterIncrement}
                  onChange={e => setCounterIncrement(parseInt(e.target.value) || 0)}
                  className="w-20 bg-background border border-muted rounded px-2 py-1 
                             font-handwritten text-lg text-center focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <p className="font-typewriter text-xs text-muted-foreground">
                Example: Day 1 = {counterStart}, Day 2 = {counterStart + counterIncrement}, 
                Day 3 = {counterStart + counterIncrement * 2}...
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-lg font-typewriter text-sm bg-secondary hover:bg-secondary/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-4 py-2 rounded-lg font-typewriter text-sm bg-primary text-primary-foreground 
                         hover:bg-primary/90 disabled:opacity-50"
            >
              Add Task
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
