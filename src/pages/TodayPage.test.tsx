import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AllProviders } from '../test/AllProviders';
import TodayPage from './TodayPage';

vi.mock('../services/api', () => ({
  fetchHabits: vi.fn().mockRejectedValue(new Error('dev-mode')),
  fetchHabitLogs: vi.fn().mockRejectedValue(new Error('dev-mode')),
  fetchMoodEntries: vi.fn().mockRejectedValue(new Error('dev-mode')),
  fetchReflections: vi.fn().mockRejectedValue(new Error('dev-mode')),
  logHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  saveMoodApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  saveReflectionApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  createHabit: vi.fn().mockRejectedValue(new Error('dev-mode')),
  updateHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  deleteHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
}));

describe('TodayPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Today heading', async () => {
    render(<AllProviders><TodayPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  it('renders mood check-in section', async () => {
    render(<AllProviders><TodayPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText(/How are you feeling/)).toBeInTheDocument();
    });
  });

  it('renders save daily entry button', async () => {
    render(<AllProviders><TodayPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText(/Save Daily Entry/)).toBeInTheDocument();
    });
  });

  it('shows habit cards when habits exist', async () => {
    localStorage.setItem('betterday-habits', JSON.stringify([
      { id: 'h1', name: 'Test Habit', createdAt: new Date().toISOString(), activeDays: [], archived: false, category: 'Test' },
    ]));
    render(<AllProviders><TodayPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText('Test Habit')).toBeInTheDocument();
    });
  });
});
