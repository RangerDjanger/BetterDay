import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HabitProvider } from '../context/HabitContext';
import HabitDetailPage from './HabitDetailPage';

vi.mock('../services/api', () => ({
  fetchHabits: vi.fn().mockRejectedValue(new Error('dev-mode')),
  fetchHabitLogs: vi.fn().mockRejectedValue(new Error('dev-mode')),
  logHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  createHabit: vi.fn().mockRejectedValue(new Error('dev-mode')),
  updateHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  deleteHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
}));

describe('HabitDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('betterday-habits', JSON.stringify([
      { id: 'h1', name: 'Test Habit', description: 'A test', category: 'Test', createdAt: '2025-01-01', activeDays: [], archived: false },
    ]));
  });

  it('renders habit name', async () => {
    render(
      <MemoryRouter initialEntries={['/habit/h1']}>
        <HabitProvider>
          <Routes>
            <Route path="/habit/:id" element={<HabitDetailPage />} />
          </Routes>
        </HabitProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Test Habit')).toBeInTheDocument();
    });
  });

  it('renders stats cards', async () => {
    render(
      <MemoryRouter initialEntries={['/habit/h1']}>
        <HabitProvider>
          <Routes>
            <Route path="/habit/:id" element={<HabitDetailPage />} />
          </Routes>
        </HabitProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Current Streak/i)).toBeInTheDocument();
      expect(screen.getByText(/Best Streak/i)).toBeInTheDocument();
      expect(screen.getByText(/Total/i)).toBeInTheDocument();
    });
  });

  it('shows "not found" for missing habit', async () => {
    render(
      <MemoryRouter initialEntries={['/habit/nonexistent']}>
        <HabitProvider>
          <Routes>
            <Route path="/habit/:id" element={<HabitDetailPage />} />
          </Routes>
        </HabitProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });
});
