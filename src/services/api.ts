import type { Habit, HabitLog, Reflection, MoodEntry } from '../types';

const isDev = import.meta.env.DEV;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

// In dev mode, skip API calls — contexts fall back to localStorage
function devGuard(): boolean {
  return isDev;
}

// --- Habits ---

export async function fetchHabits(): Promise<Habit[]> {
  if (devGuard()) throw new Error('dev-mode');
  return request<Habit[]>('/api/habits');
}

export async function createHabit(habit: Habit): Promise<Habit> {
  if (devGuard()) throw new Error('dev-mode');
  return request<Habit>('/api/habits', {
    method: 'POST',
    body: JSON.stringify(habit),
  });
}

export async function updateHabitApi(habit: Habit): Promise<Habit> {
  if (devGuard()) throw new Error('dev-mode');
  return request<Habit>(`/api/habits/${habit.id}`, {
    method: 'PUT',
    body: JSON.stringify(habit),
  });
}

export async function deleteHabitApi(id: string): Promise<void> {
  if (devGuard()) throw new Error('dev-mode');
  return request<void>(`/api/habits/${id}`, { method: 'DELETE' });
}

// --- Habit Logs ---

export async function fetchHabitLogs(habitId: string): Promise<HabitLog[]> {
  if (devGuard()) throw new Error('dev-mode');
  return request<HabitLog[]>(`/api/habits/${habitId}/logs`);
}

export async function logHabitApi(habitId: string, log: HabitLog): Promise<HabitLog> {
  if (devGuard()) throw new Error('dev-mode');
  return request<HabitLog>(`/api/habits/${habitId}/logs`, {
    method: 'POST',
    body: JSON.stringify(log),
  });
}

// --- Reflections ---

export async function fetchReflections(): Promise<Reflection[]> {
  if (devGuard()) throw new Error('dev-mode');
  return request<Reflection[]>('/api/reflections');
}

export async function saveReflectionApi(r: Reflection): Promise<Reflection> {
  if (devGuard()) throw new Error('dev-mode');
  return request<Reflection>('/api/reflections', {
    method: 'POST',
    body: JSON.stringify(r),
  });
}

// --- Mood ---

export async function fetchMoodEntries(): Promise<MoodEntry[]> {
  if (devGuard()) throw new Error('dev-mode');
  return request<MoodEntry[]>('/api/mood');
}

export async function saveMoodApi(entry: MoodEntry): Promise<MoodEntry> {
  if (devGuard()) throw new Error('dev-mode');
  return request<MoodEntry>('/api/mood', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}
