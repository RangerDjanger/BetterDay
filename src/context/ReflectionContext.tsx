import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Reflection } from '../types';
import * as api from '../services/api';

const STORAGE_KEY = 'betterday-reflections';

interface ReflectionContextType {
  reflections: Reflection[];
  saveReflection: (r: Reflection) => void;
  getReflection: (date: string) => Reflection | undefined;
}

const ReflectionContext = createContext<ReflectionContextType>({
  reflections: [],
  saveReflection: () => {},
  getReflection: () => undefined,
});

export function ReflectionProvider({ children }: { children: ReactNode }) {
  const [reflections, setReflections] = useState<Reflection[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await api.fetchReflections();
        if (!cancelled) {
          setReflections(remote);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
        }
      } catch {
        if (!cancelled) {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) setReflections(JSON.parse(stored));
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));
  }, [reflections]);

  const saveReflection = useCallback((r: Reflection) => {
    setReflections(prev => {
      const idx = prev.findIndex(x => x.date === r.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = r;
        return next;
      }
      return [r, ...prev];
    });
    api.saveReflectionApi(r).catch(() => {});
  }, []);

  const getReflection = useCallback(
    (date: string) => reflections.find(r => r.date === date),
    [reflections],
  );

  return (
    <ReflectionContext.Provider value={{ reflections, saveReflection, getReflection }}>
      {children}
    </ReflectionContext.Provider>
  );
}

export function useReflections() {
  return useContext(ReflectionContext);
}
