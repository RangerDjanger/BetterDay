import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { MoodEntry } from '../types';
import * as api from '../services/api';

const STORAGE_KEY = 'betterday-mood';

interface MoodContextType {
  moods: MoodEntry[];
  saveMood: (entry: MoodEntry) => void;
  getMood: (date: string) => MoodEntry | undefined;
}

const MoodContext = createContext<MoodContextType>({
  moods: [],
  saveMood: () => {},
  getMood: () => undefined,
});

export function MoodProvider({ children }: { children: ReactNode }) {
  const [moods, setMoods] = useState<MoodEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await api.fetchMoodEntries();
        if (!cancelled) {
          setMoods(remote);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
        }
      } catch {
        if (!cancelled) {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) setMoods(JSON.parse(stored));
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));
  }, [moods]);

  const saveMood = useCallback((entry: MoodEntry) => {
    setMoods(prev => {
      const idx = prev.findIndex(m => m.date === entry.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...entry };
        return next;
      }
      return [entry, ...prev];
    });
    api.saveMoodApi(entry).catch(() => {});
  }, []);

  const getMood = useCallback(
    (date: string) => moods.find(m => m.date === date),
    [moods],
  );

  return (
    <MoodContext.Provider value={{ moods, saveMood, getMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  return useContext(MoodContext);
}
