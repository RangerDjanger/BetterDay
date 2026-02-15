import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ReflectionProvider, useReflections } from './ReflectionContext';

vi.mock('../services/api', () => ({
  fetchReflections: vi.fn().mockRejectedValue(new Error('dev-mode')),
  saveReflectionApi: vi.fn().mockRejectedValue(new Error('dev-mode')),
}));

function TestConsumer() {
  const { reflections, saveReflection, getReflection } = useReflections();
  const today = getReflection('2025-06-01');
  return (
    <div>
      <span data-testid="count">{reflections.length}</span>
      <span data-testid="well">{today?.wentWell ?? 'none'}</span>
      <button onClick={() => saveReflection({ date: '2025-06-01', wentWell: 'Good', toImprove: 'Sleep' })}>Save</button>
    </div>
  );
}

describe('ReflectionContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides empty reflections initially', async () => {
    render(<ReflectionProvider><TestConsumer /></ReflectionProvider>);
    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('0');
    });
  });

  it('saveReflection adds a reflection', async () => {
    render(<ReflectionProvider><TestConsumer /></ReflectionProvider>);
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('0'));

    await act(async () => { screen.getByText('Save').click(); });
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('well').textContent).toBe('Good');
  });

  it('persists reflections to localStorage', async () => {
    render(<ReflectionProvider><TestConsumer /></ReflectionProvider>);
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('0'));

    await act(async () => { screen.getByText('Save').click(); });
    expect(screen.getByTestId('count').textContent).toBe('1');

    const stored = JSON.parse(localStorage.getItem('betterday-reflections') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].wentWell).toBe('Good');
  });

  it('saveReflection replaces entry for same date', async () => {
    render(<ReflectionProvider><TestConsumer /></ReflectionProvider>);
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('0'));

    await act(async () => { screen.getByText('Save').click(); });
    await act(async () => { screen.getByText('Save').click(); });
    expect(screen.getByTestId('count').textContent).toBe('1');
  });
});
