import { Bell, BellOff, X } from 'lucide-react';

interface ReminderBadgeProps {
  showBadge: boolean;
  onDismiss: () => void;
  reminderEnabled: boolean;
  onToggleReminder: () => void;
}

export const ReminderBadge = ({
  showBadge,
  onDismiss,
  reminderEnabled,
  onToggleReminder,
}: ReminderBadgeProps) => {
  return (
    <div className="relative">
      <button
        onClick={onToggleReminder}
        className={`p-2 rounded-full transition-all hover:scale-105 active:scale-95
                   ${reminderEnabled 
                     ? 'bg-primary text-primary-foreground' 
                     : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
        aria-label={reminderEnabled ? 'Disable reminder' : 'Enable reminder'}
      >
        {reminderEnabled ? <Bell size={20} /> : <BellOff size={20} />}
      </button>
      
      {showBadge && (
        <div className="absolute -top-1 -right-1 flex items-center">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive items-center justify-center">
              <button
                onClick={onDismiss}
                className="text-destructive-foreground"
                aria-label="Dismiss reminder"
              >
                <X size={10} />
              </button>
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
