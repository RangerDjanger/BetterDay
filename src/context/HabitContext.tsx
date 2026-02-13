import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Habit, HabitLog } from '../types';
import { seedHabits } from '../data/seedHabits';

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
  // First launch — seed defaults
  localStorage.setItem(HABITS_KEY, JSON.stringify(seedHabits));
  return seedHabits;
}

function loadLogs(): HabitLog[] {
  const stored = localStorage.getItem(LOGS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);

  useEffect(() => {
    setHabits(loadHabits());
    setLogs(loadLogs());
  }, []);

  useEffect(() => {
    if (habits.length) localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }, [logs]);

  const toggleHabit = useCallback((habitId: string, date: string) => {
    setLogs(prev => {
      const existing = prev.find(l => l.habitId === habitId && l.date === date);
      if (existing) {
        return existing.completed
          ? prev.filter(l => !(l.habitId === habitId && l.date === date))
          : prev.map(l =>
              l.habitId === habitId && l.date === date
                ? { ...l, completed: true }
                : l,
            );
      }
      return [...prev, { habitId, date, completed: true }];
    });
  }, []);

  const isCompleted = useCallback(
    (habitId: string, date: string) =>
      logs.some(l => l.habitId === habitId && l.date === date && l.completed),
    [logs],
  );

  const addHabit = useCallback((habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  }, []);

  const updateHabit = useCallback((habit: Habit) => {
    setHabits(prev => prev.map(h => (h.id === habit.id ? habit : h)));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const archiveHabit = useCallback((id: string) => {
    setHabits(prev => prev.map(h => (h.id === id ? { ...h, archived: !h.archived } : h)));
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
