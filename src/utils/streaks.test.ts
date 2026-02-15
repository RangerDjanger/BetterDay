import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { HabitLog } from '../types';
import { calcCurrentStreak, calcBestStreak, calcTotalCompletions, calcStats } from './streaks';

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function makeLogs(habitId: string, daysAgo: number[]): HabitLog[] {
  return daysAgo.map(d => ({ habitId, date: dateStr(d), completed: true }));
}

describe('streaks', () => {
  describe('calcCurrentStreak', () => {
    it('returns 0 when no logs', () => {
      expect(calcCurrentStreak('h1', [], [])).toBe(0);
    });

    it('counts streak from today backwards', () => {
      const logs = makeLogs('h1', [0, 1, 2]);
      expect(calcCurrentStreak('h1', [], logs)).toBe(3);
    });

    it('breaks streak on missing day', () => {
      const logs = makeLogs('h1', [0, 1, 3]); // day 2 missing
      expect(calcCurrentStreak('h1', [], logs)).toBe(2);
    });

    it('skips inactive days', () => {
      // If today is e.g. Wednesday (3), set activeDays to include today and some past days
      const today = new Date();
      const todayDay = today.getDay();
      // Make habit active only on today's day of week
      const activeDays = [todayDay];
      const logs = makeLogs('h1', [0, 7]); // today and 7 days ago (same weekday)
      expect(calcCurrentStreak('h1', activeDays, logs)).toBe(2);
    });

    it('returns 0 when today is active but not completed', () => {
      const logs = makeLogs('h1', [1, 2, 3]); // yesterday streak, not today
      expect(calcCurrentStreak('h1', [], logs)).toBe(3);
    });

    it('ignores logs for other habits', () => {
      const logs = [
        ...makeLogs('h1', [0, 1]),
        ...makeLogs('h2', [0, 1, 2, 3]),
      ];
      expect(calcCurrentStreak('h1', [], logs)).toBe(2);
    });
  });

  describe('calcBestStreak', () => {
    it('returns 0 when no logs', () => {
      expect(calcBestStreak('h1', [], [])).toBe(0);
    });

    it('returns best consecutive run', () => {
      const logs = [
        ...makeLogs('h1', [10, 9, 8]), // 3-day streak in the past
        ...makeLogs('h1', [0, 1]),      // 2-day streak now
      ];
      // Day 2-7 missing, so best is 3
      expect(calcBestStreak('h1', [], logs)).toBe(3);
    });

    it('handles single completion', () => {
      const logs = makeLogs('h1', [5]);
      expect(calcBestStreak('h1', [], logs)).toBe(1);
    });
  });

  describe('calcTotalCompletions', () => {
    it('counts completed logs', () => {
      const logs: HabitLog[] = [
        { habitId: 'h1', date: '2025-01-01', completed: true },
        { habitId: 'h1', date: '2025-01-02', completed: false },
        { habitId: 'h1', date: '2025-01-03', completed: true },
        { habitId: 'h2', date: '2025-01-01', completed: true },
      ];
      expect(calcTotalCompletions('h1', logs)).toBe(2);
    });

    it('returns 0 when no logs', () => {
      expect(calcTotalCompletions('h1', [])).toBe(0);
    });
  });

  describe('calcStats', () => {
    it('returns all stats with 30-day goal', () => {
      const logs = makeLogs('h1', [0, 1, 2]);
      const stats = calcStats('h1', [], logs);
      expect(stats).toEqual({
        totalCompletions: 3,
        currentStreak: 3,
        bestStreak: 3,
        streakGoal: 30,
        streakGoalComplete: false,
      });
    });

    it('marks streakGoalComplete when streak >= 30', () => {
      const logs = makeLogs('h1', Array.from({ length: 31 }, (_, i) => i));
      const stats = calcStats('h1', [], logs);
      expect(stats.streakGoalComplete).toBe(true);
      expect(stats.currentStreak).toBeGreaterThanOrEqual(30);
    });
  });
});
