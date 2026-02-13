import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CoachPersonality } from '../services/coach';

const STORAGE_KEY = 'betterday-coach';

interface CoachContextType {
  personality: CoachPersonality;
  setPersonality: (p: CoachPersonality) => void;
}

const CoachContext = createContext<CoachContextType>({
  personality: 'motivator',
  setPersonality: () => {},
});

export function CoachProvider({ children }: { children: ReactNode }) {
  const [personality, setPersonalityState] = useState<CoachPersonality>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as CoachPersonality) || 'motivator';
  });

  const setPersonality = useCallback((p: CoachPersonality) => {
    setPersonalityState(p);
    localStorage.setItem(STORAGE_KEY, p);
  }, []);

  return (
    <CoachContext.Provider value={{ personality, setPersonality }}>
      {children}
    </CoachContext.Provider>
  );
}

export function useCoach() {
  return useContext(CoachContext);
}
