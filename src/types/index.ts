export interface Habit {
  id: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;
  reminderTime?: string;
  activeDays: number[];
  archived: boolean;
}

export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface Reflection {
  date: string;
  wentWell: string;
  toImprove: string;
}

export interface MoodEntry {
  date: string;
  morning?: number;
  evening?: number;
}

export interface Milestone {
  days: number;
  label: string;
  achieved: boolean;
}

export interface HabitStats {
  totalCompletions: number;
  currentStreak: number;
  bestStreak: number;
  streakGoal: number;
  streakGoalComplete: boolean;
}

export interface UserInfo {
  userId: string;
  userDetails: string;
  identityProvider: string;
  userRoles: string[];
}
