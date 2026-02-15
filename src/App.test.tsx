import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

vi.mock('./services/api', () => ({
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

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the app and shows Today page in dev mode', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument();
    });
  });

  it('renders bottom navigation', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
