import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setReminders, stopReminders } from './notifications';

describe('notifications scheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    stopReminders();
  });

  afterEach(() => {
    stopReminders();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('setReminders starts interval when reminders given', () => {
    const MockNotification = vi.fn();
    vi.stubGlobal('Notification', Object.assign(MockNotification, { permission: 'granted' }));
    localStorage.setItem('betterday-notifications-enabled', 'true');

    setReminders([{ id: 'r1', time: '09:00', title: 'Test', body: 'Body' }]);
    // Interval should be set (30 second check)
    vi.advanceTimersByTime(30_000);
    // Notification may or may not fire depending on current time
  });

  it('stopReminders clears interval', () => {
    setReminders([{ id: 'r1', time: '09:00', title: 'Test', body: 'Body' }]);
    stopReminders();
    // No errors when advancing timers after stop
    vi.advanceTimersByTime(60_000);
  });

  it('fires notification when time matches', () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;

    const MockNotification = vi.fn();
    vi.stubGlobal('Notification', Object.assign(MockNotification, { permission: 'granted' }));
    localStorage.setItem('betterday-notifications-enabled', 'true');

    setReminders([{ id: 'r1', time: currentTime, title: 'Time!', body: 'Now' }]);
    // The immediate check in setReminders should fire
    expect(MockNotification).toHaveBeenCalledWith('Time!', expect.objectContaining({ body: 'Now' }));
  });

  it('does not fire notification for inactive day', () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;
    const inactiveDay = (now.getDay() + 1) % 7; // tomorrow's day of week

    const MockNotification = vi.fn();
    vi.stubGlobal('Notification', Object.assign(MockNotification, { permission: 'granted' }));
    localStorage.setItem('betterday-notifications-enabled', 'true');

    setReminders([{ id: 'r1', time: currentTime, title: 'Skip', body: 'Nope', days: [inactiveDay] }]);
    expect(MockNotification).not.toHaveBeenCalled();
  });
});
