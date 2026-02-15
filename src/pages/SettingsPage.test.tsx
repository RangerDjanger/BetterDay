import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AllProviders } from '../test/AllProviders';
import SettingsPage from './SettingsPage';

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

describe('SettingsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Settings heading', async () => {
    render(<AllProviders><SettingsPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  it('renders coach personality selector', async () => {
    render(<AllProviders><SettingsPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText('Habit Coach')).toBeInTheDocument();
    });
  });

  it('renders sign out link', async () => {
    render(<AllProviders><SettingsPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText('Sign out')).toBeInTheDocument();
    });
  });

  it('renders clear data button', async () => {
    render(<AllProviders><SettingsPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText(/Clear all data/i)).toBeInTheDocument();
    });
  });
});
