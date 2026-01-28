import { useEffect, useCallback, useState } from 'react';
import { toast } from 'sonner';

interface UseReminderProps {
  enabled: boolean;
  reminderTime: string | undefined;
  hasIncompleteTasks: boolean;
  onRequestPermission?: () => void;
}

export const useReminder = ({
  enabled,
  reminderTime,
  hasIncompleteTasks,
}: UseReminderProps) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );
  const [showBadge, setShowBadge] = useState(false);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      toast.error('Notifications not supported in this browser');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
        return true;
      } else {
        toast.error('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if (notificationPermission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: 'daily-reminder',
        });
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  }, [notificationPermission]);

  // Check if it's time for reminder
  useEffect(() => {
    if (!enabled || !reminderTime) return;

    const checkTime = () => {
      const now = new Date();
      const [hours, minutes] = reminderTime.split(':').map(Number);
      
      if (now.getHours() === hours && now.getMinutes() === minutes) {
        if (hasIncompleteTasks) {
          sendNotification(
            'Daily Challenge Reminder',
            "Don't forget to complete your daily tasks!"
          );
          setShowBadge(true);
        }
      }
    };

    // Check immediately and then every minute
    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, [enabled, reminderTime, hasIncompleteTasks, sendNotification]);

  // Update badge based on incomplete tasks
  useEffect(() => {
    if (hasIncompleteTasks && enabled) {
      setShowBadge(true);
    } else {
      setShowBadge(false);
    }
  }, [hasIncompleteTasks, enabled]);

  const dismissBadge = useCallback(() => {
    setShowBadge(false);
  }, []);

  return {
    notificationPermission,
    requestPermission,
    sendNotification,
    showBadge,
    dismissBadge,
  };
};
