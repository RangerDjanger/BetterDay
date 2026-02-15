import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { AllProviders } from '../test/AllProviders';
import ReflectPage from './ReflectPage';

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

describe('ReflectPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Reflect heading', async () => {
    render(<AllProviders><ReflectPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText('Reflect')).toBeInTheDocument();
    });
  });

  it('renders went well and to improve textareas', async () => {
    render(<AllProviders><ReflectPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/proud that/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Tomorrow/i)).toBeInTheDocument();
    });
  });

  it('renders save button', async () => {
    render(<AllProviders><ReflectPage /></AllProviders>);
    await waitFor(() => {
      expect(screen.getByText(/Save/i)).toBeInTheDocument();
    });
  });
});
