import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Habit, HabitLog } from '../types';
import { seedHabits } from '../data/seedHabits';
import * as api from '../services/api';

const HABITS_KEY = 'betterday-habits';
const LOGS_KEY = 'betterday-logs';

interface HabitContextType {
  habits: Habit[];
  logs: HabitLog[];
  toggleHabit: (habitId: string, date: string) => void;
  isCompleted: (habitId: string, date: string) => boolean;
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  archiveHabit: (id: string) => void;
}

const HabitContext = createContext<HabitContextType>({
  habits: [],
  logs: [],
  toggleHabit: () => {},
  isCompleted: () => false,
  addHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
  archiveHabit: () => {},
});

function loadHabits(): Habit[] {
  const stored = localStorage.getItem(HABITS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(HABITS_KEY, JSON.stringify(seedHabits));
  return seedHabits;
}

function loadLogs(): HabitLog[] {
  const stored = localStorage.getItem(LOGS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function cacheHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

function cacheLogs(logs: HabitLog[]) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);

  // Load: try API first, fall back to localStorage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await api.fetchHabits();
        if (!cancelled) {
          const h = remote.length ? remote : loadHabits();
          setHabits(h);
          cacheHabits(h);
        }
      } catch {
        if (!cancelled) setHabits(loadHabits());
      }

      // Load logs for all habits
      try {
        const localHabits = loadHabits();
        const allLogs: HabitLog[] = [];
        for (const h of localHabits) {
          try {
            const hLogs = await api.fetchHabitLogs(h.id);
            allLogs.push(...hLogs);
          } catch { /* skip */ }
        }
        if (!cancelled && allLogs.length) {
          setLogs(allLogs);
          cacheLogs(allLogs);
        } else if (!cancelled) {
          setLogs(loadLogs());
        }
      } catch {
        if (!cancelled) setLogs(loadLogs());
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Cache to localStorage on change
  useEffect(() => { if (habits.length) cacheHabits(habits); }, [habits]);
  useEffect(() => { cacheLogs(logs); }, [logs]);

  const toggleHabit = useCallback((habitId: string, date: string) => {
    setLogs(prev => {
      const existing = prev.find(l => l.habitId === habitId && l.date === date);
      const newCompleted = !existing?.completed;
      const log: HabitLog = { habitId, date, completed: newCompleted };

      // Fire-and-forget API call
      api.logHabitApi(habitId, log).catch(() => {});

      if (existing) {
        return newCompleted
          ? prev.map(l =>
              l.habitId === habitId && l.date === date ? { ...l, completed: true } : l,
            )
          : prev.filter(l => !(l.habitId === habitId && l.date === date));
      }
      return [...prev, log];
    });
  }, []);

  const isCompleted = useCallback(
    (habitId: string, date: string) =>
      logs.some(l => l.habitId === habitId && l.date === date && l.completed),
    [logs],
  );

  const addHabit = useCallback((habit: Habit) => {
    setHabits(prev => [...prev, habit]);
    api.createHabit(habit).catch(() => {});
  }, []);

  const updateHabit = useCallback((habit: Habit) => {
    setHabits(prev => prev.map(h => (h.id === habit.id ? habit : h)));
    api.updateHabitApi(habit).catch(() => {});
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    api.deleteHabitApi(id).catch(() => {});
  }, []);

  const archiveHabit = useCallback((id: string) => {
    setHabits(prev => {
      const updated = prev.map(h => (h.id === id ? { ...h, archived: !h.archived } : h));
      const habit = updated.find(h => h.id === id);
      if (habit) api.updateHabitApi(habit).catch(() => {});
      return updated;
    });
  }, []);

  return (
    <HabitContext.Provider value={{ habits, logs, toggleHabit, isCompleted, addHabit, updateHabit, deleteHabit, archiveHabit }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  return useContext(HabitContext);
}
