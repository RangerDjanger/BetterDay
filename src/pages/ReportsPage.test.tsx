import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AllProviders } from '../test/AllProviders';
import ReportsPage from './ReportsPage';

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

describe('ReportsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Reports heading', async () => {
    render(<AllProviders><ReportsPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });
  });

  it('renders empty state when no data', async () => {
    render(<AllProviders><ReportsPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText(/No data yet/)).toBeInTheDocument();
    });
  });
});
