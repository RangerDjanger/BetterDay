import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('api service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  describe('dev mode guard', () => {
    it('throws dev-mode error for all endpoints in dev', async () => {
      // DEV is true by default in vitest
      const api = await import('./api');
      await expect(api.fetchHabits()).rejects.toThrow('dev-mode');
      await expect(api.createHabit({} as any)).rejects.toThrow('dev-mode');
      await expect(api.updateHabitApi({} as any)).rejects.toThrow('dev-mode');
      await expect(api.deleteHabitApi('x')).rejects.toThrow('dev-mode');
      await expect(api.fetchHabitLogs('x')).rejects.toThrow('dev-mode');
      await expect(api.logHabitApi('x', {} as any)).rejects.toThrow('dev-mode');
      await expect(api.fetchReflections()).rejects.toThrow('dev-mode');
      await expect(api.saveReflectionApi({} as any)).rejects.toThrow('dev-mode');
      await expect(api.fetchMoodEntries()).rejects.toThrow('dev-mode');
      await expect(api.saveMoodApi({} as any)).rejects.toThrow('dev-mode');
    });
  });

  describe('production mode', () => {
    beforeEach(() => {
      vi.stubEnv('DEV', false as unknown as string);
    });

    it('fetchHabits calls GET /api/habits', async () => {
      const mockHabits = [{ id: '1', name: 'Test' }];
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockHabits),
      }));
      const api = await import('./api');
      const result = await api.fetchHabits();
      expect(result).toEqual(mockHabits);
      expect(fetch).toHaveBeenCalledWith('/api/habits', expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }));
    });

    it('createHabit calls POST /api/habits', async () => {
      const habit = { id: '1', name: 'New', createdAt: '', activeDays: [] as number[], archived: false };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve(habit),
      }));
      const api = await import('./api');
      const result = await api.createHabit(habit);
      expect(result).toEqual(habit);
      expect(fetch).toHaveBeenCalledWith('/api/habits', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(habit),
      }));
    });

    it('deleteHabitApi calls DELETE /api/habits/{id}', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: () => Promise.resolve(undefined),
      }));
      const api = await import('./api');
      await api.deleteHabitApi('abc');
      expect(fetch).toHaveBeenCalledWith('/api/habits/abc', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    it('throws on non-ok response', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      }));
      const api = await import('./api');
      await expect(api.fetchHabits()).rejects.toThrow('API 401: Unauthorized');
    });

    it('logHabitApi calls POST /api/habits/{id}/logs', async () => {
      const log = { habitId: 'h1', date: '2026-02-15', completed: true };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(log),
      }));
      const api = await import('./api');
      const result = await api.logHabitApi('h1', log);
      expect(result).toEqual(log);
      expect(fetch).toHaveBeenCalledWith('/api/habits/h1/logs', expect.objectContaining({
        method: 'POST',
      }));
    });

    it('saveMoodApi calls POST /api/mood', async () => {
      const entry = { date: '2026-02-15', morning: 4 };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(entry),
      }));
      const api = await import('./api');
      const result = await api.saveMoodApi(entry);
      expect(result).toEqual(entry);
      expect(fetch).toHaveBeenCalledWith('/api/mood', expect.objectContaining({
        method: 'POST',
      }));
    });

    it('saveReflectionApi calls POST /api/reflections', async () => {
      const r = { date: '2026-02-15', wentWell: 'good', toImprove: 'more' };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(r),
      }));
      const api = await import('./api');
      const result = await api.saveReflectionApi(r);
      expect(result).toEqual(r);
      expect(fetch).toHaveBeenCalledWith('/api/reflections', expect.objectContaining({
        method: 'POST',
      }));
    });
  });
});
