import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HabitProvider } from '../../context/HabitContext';
import HabitForm from './HabitForm';

vi.mock('../../services/api', () => ({
  fetchHabits: vi.fn().mockRejectedValue(new Error('dev-mode')),
  fetchHabitLogs: vi.fn().mockRejectedValue(new Error('dev-mode')),
  logHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  createHabit: vi.fn().mockRejectedValue(new Error('dev-mode')),
  updateHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  deleteHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
}));

function renderForm(path = '/add') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <HabitProvider>
        <Routes>
          <Route path="/add" element={<HabitForm />} />
          <Route path="/habit/:id/edit" element={<HabitForm />} />
          <Route path="*" element={<div>Navigated away</div>} />
        </Routes>
      </HabitProvider>
    </MemoryRouter>
  );
}

describe('HabitForm', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('betterday-habits', JSON.stringify([]));
  });

  it('renders Add Habit title for new habit', async () => {
    renderForm();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add Habit' })).toBeInTheDocument();
    });
  });

  it('renders form fields', async () => {
    renderForm();
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Morning Meditation/i)).toBeInTheDocument();
    });
  });

  it('renders day toggle buttons', async () => {
    renderForm();
    await waitFor(() => {
      expect(screen.getByText('Sun')).toBeInTheDocument();
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Sat')).toBeInTheDocument();
    });
  });

  it('renders cancel button', async () => {
    renderForm();
    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('does not submit with empty name', async () => {
    renderForm();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add Habit' })).toBeInTheDocument();
    });
    // The name field is required via HTML attribute, clicking submit with empty won't navigate
    const submitBtns = screen.getAllByText('Add Habit');
    const submitBtn = submitBtns.find(el => el.tagName === 'BUTTON');
    if (submitBtn) fireEvent.click(submitBtn);
    // Should still be on the form
    expect(screen.getByRole('heading', { name: 'Add Habit' })).toBeInTheDocument();
  });
});
