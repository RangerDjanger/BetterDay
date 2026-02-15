import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CoachProvider, useCoach } from './CoachContext';

function TestConsumer() {
  const { personality, setPersonality } = useCoach();
  return (
    <div>
      <span data-testid="personality">{personality}</span>
      <button onClick={() => setPersonality('comedian')}>Change</button>
    </div>
  );
}

describe('CoachContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to motivator personality', () => {
    render(<CoachProvider><TestConsumer /></CoachProvider>);
    expect(screen.getByTestId('personality').textContent).toBe('motivator');
  });

  it('loads personality from localStorage', () => {
    localStorage.setItem('betterday-coach', 'drill-sergeant');
    render(<CoachProvider><TestConsumer /></CoachProvider>);
    expect(screen.getByTestId('personality').textContent).toBe('drill-sergeant');
  });

  it('setPersonality updates state and localStorage', async () => {
    render(<CoachProvider><TestConsumer /></CoachProvider>);
    await act(async () => { screen.getByText('Change').click(); });
    expect(screen.getByTestId('personality').textContent).toBe('comedian');
    expect(localStorage.getItem('betterday-coach')).toBe('comedian');
  });
});
