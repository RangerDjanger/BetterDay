import { describe, it, expect } from 'vitest';
import { seedHabits } from './seedHabits';

describe('seedHabits', () => {
  it('contains 10 default habits', () => {
    expect(seedHabits).toHaveLength(10);
  });

  it('all habits have required fields', () => {
    for (const h of seedHabits) {
      expect(h.id).toBeTruthy();
      expect(h.name).toBeTruthy();
      expect(h.category).toBeTruthy();
      expect(h.createdAt).toBeTruthy();
      expect(h.archived).toBe(false);
      expect(Array.isArray(h.activeDays)).toBe(true);
    }
  });

  it('has habits in 3 categories', () => {
    const categories = new Set(seedHabits.map(h => h.category));
    expect(categories.size).toBe(3);
  });

  it('ids start with seed-', () => {
    seedHabits.forEach(h => expect(h.id).toMatch(/^seed-/));
  });
});
