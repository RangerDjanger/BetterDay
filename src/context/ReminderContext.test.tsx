import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { HabitProvider } from './HabitContext';
import { ReminderProvider, useReminders } from './ReminderContext';

vi.mock('../services/api', () => ({
  fetchHabits: vi.fn().mockRejectedValue(new Error('dev-mode')),
  fetchHabitLogs: vi.fn().mockRejectedValue(new Error('dev-mode')),
  logHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  createHabit: vi.fn().mockRejectedValue(new Error('dev-mode')),
  updateHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
  deleteHabitApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
}));

function TestConsumer() {
  const { settings, supported, updateSettings } = useReminders();
  return (
    <div>
      <span data-testid="enabled">{String(settings.enabled)}</span>
      <span data-testid="morning">{settings.morningTime}</span>
      <span data-testid="evening">{settings.eveningTime}</span>
      <span data-testid="supported">{String(supported)}</span>
      <button onClick={() => updateSettings({ morningTime: '08:00' })}>Update</button>
    </div>
  );
}

describe('ReminderContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('Notification', { permission: 'default' });
  });

  it('provides default settings', async () => {
    render(
      <HabitProvider>
        <ReminderProvider><TestConsumer /></ReminderProvider>
      </HabitProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('enabled').textContent).toBe('false');
      expect(screen.getByTestId('morning').textContent).toBe('07:00');
      expect(screen.getByTestId('evening').textContent).toBe('21:00');
    });
  });

  it('loads settings from localStorage', async () => {
    localStorage.setItem('betterday-reminders', JSON.stringify({
      enabled: true,
      morningTime: '06:30',
      eveningTime: '22:00',
    }));
    render(
      <HabitProvider>
        <ReminderProvider><TestConsumer /></ReminderProvider>
      </HabitProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('morning').textContent).toBe('06:30');
      expect(screen.getByTestId('evening').textContent).toBe('22:00');
    });
  });

  it('updateSettings updates the morning time', async () => {
    render(
      <HabitProvider>
        <ReminderProvider><TestConsumer /></ReminderProvider>
      </HabitProvider>
    );
    await waitFor(() => expect(screen.getByTestId('morning').textContent).toBe('07:00'));

    await act(async () => { screen.getByText('Update').click(); });
    expect(screen.getByTestId('morning').textContent).toBe('08:00');
  });
});
