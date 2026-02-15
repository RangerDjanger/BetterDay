import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { HabitProvider, useHabits } from './HabitContext';

vi.mock('../services/api', () => ({
  fetchHabits: vi.fn().mockRejectedValue(new Error('dev-mode')),
  fetchHabitLogs: vi.fn().mockRejectedValue(new Error('dev-mode')),
  logHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  createHabit: vi.fn().mockRejectedValue(new Error('dev-mode')),
  updateHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  deleteHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
}));

function TestConsumer() {
  const { habits, logs, toggleHabit, isCompleted, addHabit, updateHabit, deleteHabit, archiveHabit } = useHabits();
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div>
      <span data-testid="count">{habits.length}</span>
      <span data-testid="logs">{logs.length}</span>
      <span data-testid="completed">{String(isCompleted('test-1', today))}</span>
      <button onClick={() => toggleHabit('test-1', today)}>Toggle</button>
      <button onClick={() => addHabit({
        id: 'new-1', name: 'Test', createdAt: new Date().toISOString(),
        activeDays: [], archived: false,
      })}>Add</button>
      <button onClick={() => updateHabit({
        id: 'new-1', name: 'Updated', createdAt: new Date().toISOString(),
        activeDays: [1, 3], archived: false,
      })}>Update</button>
      <button onClick={() => deleteHabit('new-1')}>Delete</button>
      <button onClick={() => archiveHabit('new-1')}>Archive</button>
    </div>
  );
}

describe('HabitContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads seed habits when no localStorage', async () => {
    render(<HabitProvider><TestConsumer /></HabitProvider>);
    await waitFor(() => {
      expect(Number(screen.getByTestId('count').textContent)).toBeGreaterThan(0);
    });
  });

  it('loads habits from localStorage', async () => {
    localStorage.setItem('betterday-habits', JSON.stringify([
      { id: 'h1', name: 'Existing', createdAt: '', activeDays: [], archived: false },
    ]));
    render(<HabitProvider><TestConsumer /></HabitProvider>);
    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('1');
    });
  });

  it('addHabit adds a habit', async () => {
    localStorage.setItem('betterday-habits', JSON.stringify([]));
    render(<HabitProvider><TestConsumer /></HabitProvider>);
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('0'));

    await act(async () => { screen.getByText('Add').click(); });
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('deleteHabit removes a habit', async () => {
    localStorage.setItem('betterday-habits', JSON.stringify([]));
    render(<HabitProvider><TestConsumer /></HabitProvider>);
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('0'));

    await act(async () => { screen.getByText('Add').click(); });
    expect(screen.getByTestId('count').textContent).toBe('1');

    await act(async () => { screen.getByText('Delete').click(); });
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('toggleHabit creates a log entry', async () => {
    render(<HabitProvider><TestConsumer /></HabitProvider>);
    await waitFor(() => expect(screen.getByTestId('count').textContent).not.toBe(''));

    await act(async () => { screen.getByText('Toggle').click(); });
    expect(screen.getByTestId('logs').textContent).toBe('1');
    expect(screen.getByTestId('completed').textContent).toBe('true');
  });

  it('toggleHabit twice removes the log', async () => {
    render(<HabitProvider><TestConsumer /></HabitProvider>);
    await waitFor(() => expect(screen.getByTestId('count').textContent).not.toBe(''));

    await act(async () => { screen.getByText('Toggle').click(); });
    expect(screen.getByTestId('completed').textContent).toBe('true');

    await act(async () => { screen.getByText('Toggle').click(); });
    expect(screen.getByTestId('completed').textContent).toBe('false');
  });

  it('archiveHabit toggles archived flag', async () => {
    localStorage.setItem('betterday-habits', JSON.stringify([]));
    render(<HabitProvider><TestConsumer /></HabitProvider>);
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('0'));

    await act(async () => { screen.getByText('Add').click(); });
    await act(async () => { screen.getByText('Archive').click(); });
    // Habit is still in the list but archived
    expect(screen.getByTestId('count').textContent).toBe('1');
  });
});
