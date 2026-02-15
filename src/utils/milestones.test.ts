import { describe, it, expect, beforeEach } from 'vitest';
import type { HabitLog } from '../types';
import { getMilestonesForHabit, checkNewMilestone } from './milestones';

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function makeLogs(habitId: string, count: number): HabitLog[] {
  return Array.from({ length: count }, (_, i) => ({
    habitId,
    date: dateStr(i),
    completed: true,
  }));
}

describe('milestones', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getMilestonesForHabit', () => {
    it('returns all milestones as not achieved with no logs', () => {
      const result = getMilestonesForHabit('h1', [], []);
      expect(result).toHaveLength(4);
      expect(result.every(m => !m.achieved)).toBe(true);
    });

    it('marks 7-day milestone as achieved with 7+ day streak', () => {
      const logs = makeLogs('h1', 8);
      const result = getMilestonesForHabit('h1', [], logs);
      const sevenDay = result.find(m => m.days === 7);
      expect(sevenDay?.achieved).toBe(true);
    });

    it('marks multiple milestones as achieved', () => {
      const logs = makeLogs('h1', 22);
      const result = getMilestonesForHabit('h1', [], logs);
      expect(result.find(m => m.days === 7)?.achieved).toBe(true);
      expect(result.find(m => m.days === 14)?.achieved).toBe(true);
      expect(result.find(m => m.days === 21)?.achieved).toBe(true);
      expect(result.find(m => m.days === 30)?.achieved).toBe(false);
    });
  });

  describe('checkNewMilestone', () => {
    it('returns null with no streak', () => {
      expect(checkNewMilestone('h1', [], [])).toBeNull();
    });

    it('returns milestone label when threshold first reached', () => {
      const logs = makeLogs('h1', 8);
      const result = checkNewMilestone('h1', [], logs);
      expect(result).toContain('1 Week');
    });

    it('does not return same milestone twice', () => {
      const logs = makeLogs('h1', 8);
      checkNewMilestone('h1', [], logs); // first call
      const result = checkNewMilestone('h1', [], logs); // second call
      expect(result).toBeNull();
    });

    it('returns next milestone when streak grows', () => {
      const logs7 = makeLogs('h1', 8);
      checkNewMilestone('h1', [], logs7); // triggers 7-day

      const logs14 = makeLogs('h1', 15);
      const result = checkNewMilestone('h1', [], logs14);
      expect(result).toContain('2 Weeks');
    });
  });
});
