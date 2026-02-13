import type { HabitLog, HabitStats } from '../types';

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isActiveDay(date: Date, activeDays: number[]): boolean {
  return activeDays.length === 0 || activeDays.includes(date.getDay());
}

function wasCompleted(habitId: string, date: string, logs: HabitLog[]): boolean {
  return logs.some(l => l.habitId === habitId && l.date === date && l.completed);
}

export function calcCurrentStreak(
  habitId: string,
  activeDays: number[],
  logs: HabitLog[],
): number {
  let streak = 0;
  let d = new Date();

  // If today is an active day and completed, count it
  if (isActiveDay(d, activeDays) && wasCompleted(habitId, toDateStr(d), logs)) {
    streak++;
  } else if (isActiveDay(d, activeDays)) {
    // Today is active but not completed — streak hasn't started yet today, check from yesterday
  }

  // Walk backwards from yesterday
  d = addDays(d, -1);
  for (let i = 0; i < 365; i++) {
    if (isActiveDay(d, activeDays)) {
      if (wasCompleted(habitId, toDateStr(d), logs)) {
        streak++;
      } else {
        break;
      }
    }
    d = addDays(d, -1);
  }

  return streak;
}

export function calcBestStreak(
  habitId: string,
  activeDays: number[],
  logs: HabitLog[],
): number {
  const habitLogs = logs
    .filter(l => l.habitId === habitId && l.completed)
    .map(l => l.date)
    .sort();

  if (habitLogs.length === 0) return 0;

  // Find date range
  const earliest = new Date(habitLogs[0]);
  const latest = new Date();
  const completedSet = new Set(habitLogs);

  let best = 0;
  let current = 0;

  for (let d = new Date(earliest); d <= latest; d = addDays(d, 1)) {
    if (!isActiveDay(d, activeDays)) continue;
    if (completedSet.has(toDateStr(d))) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }

  return best;
}

export function calcTotalCompletions(habitId: string, logs: HabitLog[]): number {
  return logs.filter(l => l.habitId === habitId && l.completed).length;
}

export function calcStats(
  habitId: string,
  activeDays: number[],
  logs: HabitLog[],
): HabitStats {
  const currentStreak = calcCurrentStreak(habitId, activeDays, logs);
  const bestStreak = calcBestStreak(habitId, activeDays, logs);
  const totalCompletions = calcTotalCompletions(habitId, logs);
  const streakGoal = 30;

  return {
    totalCompletions,
    currentStreak,
    bestStreak,
    streakGoal,
    streakGoalComplete: currentStreak >= streakGoal,
  };
}
