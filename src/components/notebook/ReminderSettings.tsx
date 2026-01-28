import { useState } from 'react';
import { Bell, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface ReminderSettingsProps {
  enabled: boolean;
  time: string | undefined;
  notificationPermission: NotificationPermission;
  onToggle: () => void;
  onTimeChange: (time: string) => void;
  onRequestPermission: () => void;
}

export const ReminderSettings = ({
  enabled,
  time,
  notificationPermission,
  onToggle,
  onTimeChange,
  onRequestPermission,
}: ReminderSettingsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="px-3 py-1 rounded-full font-typewriter text-xs bg-secondary text-muted-foreground 
                     hover:bg-secondary/80 flex items-center gap-2"
        >
          <Bell size={14} />
          Reminder
        </button>
      </DialogTrigger>
      <DialogContent className="bg-paper border-muted">
        <DialogHeader>
          <DialogTitle className="font-handwritten text-2xl text-primary">
            Daily Reminder Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-primary" />
              <span className="font-typewriter text-sm">Enable Reminders</span>
            </div>
            <Switch checked={enabled} onCheckedChange={onToggle} />
          </div>

          {/* Notification Permission */}
          {notificationPermission !== 'granted' && enabled && (
            <div className="p-3 bg-accent/20 rounded-lg">
              <p className="font-typewriter text-xs text-muted-foreground mb-2">
                Browser notifications are not enabled
              </p>
              <button
                onClick={onRequestPermission}
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-typewriter"
              >
                Enable Notifications
              </button>
            </div>
          )}

          {/* Time Picker */}
          {enabled && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-primary" />
                <span className="font-typewriter text-sm">Reminder Time</span>
              </div>
              <input
                type="time"
                value={time || '20:00'}
                onChange={e => onTimeChange(e.target.value)}
                className="bg-secondary border border-muted rounded px-3 py-1 
                           font-typewriter text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          <p className="font-typewriter text-xs text-muted-foreground">
            You'll receive a reminder at the specified time if you have incomplete tasks.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
