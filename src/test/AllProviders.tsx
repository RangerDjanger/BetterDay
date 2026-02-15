import React from 'react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { HabitProvider } from '../context/HabitContext';
import { MoodProvider } from '../context/MoodContext';
import { ReflectionProvider } from '../context/ReflectionContext';
import { CoachProvider } from '../context/CoachContext';
import { ReminderProvider } from '../context/ReminderContext';

export function AllProviders({ children, initialEntries = ['/'] }: { children: ReactNode; initialEntries?: string[] }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <HabitProvider>
          <ReflectionProvider>
            <MoodProvider>
              <CoachProvider>
                <ReminderProvider>
                  {children}
                </ReminderProvider>
              </CoachProvider>
            </MoodProvider>
          </ReflectionProvider>
        </HabitProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
