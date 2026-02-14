import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useHabits } from './HabitContext';
import {
  requestPermission,
  isSupported,
  isEnabled as notifEnabled,
  setEnabled as setNotifEnabled,
  setReminders,
  stopReminders,
} from '../services/notifications';

const STORAGE_KEY = 'betterday-reminders';

interface ReminderSettings {
  enabled: boolean;
  morningTime: string;
  eveningTime: string;
}

interface ReminderContextType {
  settings: ReminderSettings;
  supported: boolean;
  updateSettings: (s: Partial<ReminderSettings>) => void;
  enable: () => Promise<boolean>;
}

const defaults: ReminderSettings = {
  enabled: false,
  morningTime: '07:00',
  eveningTime: '21:00',
};

const ReminderContext = createContext<ReminderContextType>({
  settings: defaults,
  supported: false,
  updateSettings: () => {},
  enable: async () => false,
});

export function ReminderProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  });

  const { habits } = useHabits();
  const supported = isSupported();

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Schedule/unschedule reminders when settings or habits change
  useEffect(() => {
    if (!settings.enabled || !notifEnabled()) {
      stopReminders();
      return;
    }

    const now = new Date();
    const dayOfWeek = now.getDay();
    const todaysHabits = habits.filter(
      h => !h.archived && (h.activeDays.length === 0 || h.activeDays.includes(dayOfWeek)),
    );

    const habitNames = todaysHabits.map(h => h.name);
    const reminders = [];

    // Morning reminder
    reminders.push({
      id: 'morning',
      time: settings.morningTime,
      title: '🌅 Good morning!',
      body: habitNames.length > 0
        ? `You have ${habitNames.length} habits today: ${habitNames.join(', ')}`
        : 'No habits scheduled today — enjoy your day!',
    });

    // Evening reminder
    reminders.push({
      id: 'evening',
      time: settings.eveningTime,
      title: '🌙 Evening check-in',
      body: 'How did today go? Open BetterDay to log your habits and reflect.',
    });

    // Per-habit reminders
    for (const h of todaysHabits) {
      if (h.reminderTime) {
        reminders.push({
          id: `habit-${h.id}`,
          time: h.reminderTime,
          title: `⏰ ${h.name}`,
          body: h.description || 'Time to complete this habit!',
          days: h.activeDays.length > 0 ? h.activeDays : undefined,
        });
      }
    }

    setReminders(reminders);

    return () => stopReminders();
  }, [settings, habits]);

  const updateSettings = useCallback((partial: Partial<ReminderSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const enable = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      setNotifEnabled(true);
      setSettings(prev => ({ ...prev, enabled: true }));
    }
    return granted;
  }, []);

  return (
    <ReminderContext.Provider value={{ settings, supported, updateSettings, enable }}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders() {
  return useContext(ReminderContext);
}
