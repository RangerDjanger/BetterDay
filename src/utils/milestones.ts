import type { HabitLog } from '../types';
import { calcCurrentStreak } from './streaks';

export interface MilestoneCheck {
  days: number;
  label: string;
  achieved: boolean;
}

const thresholds = [
  { days: 7, label: '1 Week Strong! 💪' },
  { days: 14, label: '2 Weeks — Habit Forming! 🌱' },
  { days: 21, label: '3 Weeks — It\'s a Habit Now! 🧠' },
  { days: 30, label: 'Date Night Unlocked! 🎉' },
];

const MILESTONES_KEY = 'betterday-milestones';

interface StoredMilestones {
  [habitId: string]: number[]; // achieved threshold days
}

function loadMilestones(): StoredMilestones {
  const stored = localStorage.getItem(MILESTONES_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveMilestones(m: StoredMilestones) {
  localStorage.setItem(MILESTONES_KEY, JSON.stringify(m));
}

export function getMilestonesForHabit(
  habitId: string,
  activeDays: number[],
  logs: HabitLog[],
): MilestoneCheck[] {
  const bestOrCurrent = calcCurrentStreak(habitId, activeDays, logs);
  const stored = loadMilestones();
  const achieved = new Set(stored[habitId] || []);

  // Also check historically — if best streak ever passed a threshold, mark it
  return thresholds.map(t => ({
    ...t,
    achieved: achieved.has(t.days) || bestOrCurrent >= t.days,
  }));
}

/** Check if a new milestone was just hit. Returns the milestone label or null. */
export function checkNewMilestone(
  habitId: string,
  activeDays: number[],
  logs: HabitLog[],
): string | null {
  const streak = calcCurrentStreak(habitId, activeDays, logs);
  const stored = loadMilestones();
  const achieved = stored[habitId] || [];

  for (const t of thresholds) {
    if (streak >= t.days && !achieved.includes(t.days)) {
      stored[habitId] = [...achieved, t.days];
      saveMilestones(stored);
      return t.label;
    }
  }
  return null;
}
