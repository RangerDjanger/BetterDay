import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AllProviders } from '../test/AllProviders';
import ManageHabitsPage from './ManageHabitsPage';

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

describe('ManageHabitsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Manage Habits heading', async () => {
    render(<AllProviders><ManageHabitsPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText('Manage Habits')).toBeInTheDocument();
    });
  });

  it('renders Add Habit link', async () => {
    render(<AllProviders><ManageHabitsPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument();
    });
  });

  it('shows habits from seed data', async () => {
    render(<AllProviders><ManageHabitsPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText('Device Free Before Work')).toBeInTheDocument();
    });
  });
});
