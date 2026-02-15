import { describe, it, expect, vi, afterEach } from 'vitest';
import { COACH_LABELS, getCoachResponse } from './coach';
import type { DaySummary } from './coach';

describe('coach service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('COACH_LABELS', () => {
    it('has labels for all personalities', () => {
      expect(COACH_LABELS.motivator).toContain('Motivator');
      expect(COACH_LABELS.comedian).toContain('Comedian');
      expect(COACH_LABELS['drill-sergeant']).toContain('Drill Sergeant');
    });
  });

  describe('getCoachResponse', () => {
    const summary: DaySummary = {
      completedHabits: ['Meditate'],
      missedHabits: ['Exercise'],
      totalHabits: 2,
      morning: 4,
      evening: 3,
      wentWell: 'Good focus',
      toImprove: 'More sleep',
    };

    it('throws when VITE_GROQ_API_KEY is not set', async () => {
      vi.stubEnv('VITE_GROQ_API_KEY', '');
      await expect(getCoachResponse('motivator', summary)).rejects.toThrow('VITE_GROQ_API_KEY not set');
    });

    it('calls Groq API and returns response text', async () => {
      vi.stubEnv('VITE_GROQ_API_KEY', 'test-key');
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Great job recruit!' } }],
        }),
      }));
      const result = await getCoachResponse('drill-sergeant', summary);
      expect(result).toBe('Great job recruit!');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.groq.com/openai/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
        }),
      );
    });

    it('throws on API error', async () => {
      vi.stubEnv('VITE_GROQ_API_KEY', 'test-key');
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal error'),
      }));
      await expect(getCoachResponse('motivator', summary)).rejects.toThrow('Groq API error: 500');
    });

    it('throws on empty response', async () => {
      vi.stubEnv('VITE_GROQ_API_KEY', 'test-key');
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ choices: [] }),
      }));
      await expect(getCoachResponse('comedian', summary)).rejects.toThrow('Empty response from Groq');
    });
  });
});
