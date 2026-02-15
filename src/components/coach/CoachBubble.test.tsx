import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CoachBubble from './CoachBubble';

describe('CoachBubble', () => {
  it('renders nothing when no message and not loading', () => {
    const { container } = render(<CoachBubble message={null} personality="motivator" loading={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders toggle button when loading', () => {
    render(<CoachBubble message={null} personality="motivator" loading={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('shows chat panel when clicked', () => {
    render(<CoachBubble message={null} personality="motivator" loading={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Thinking/)).toBeInTheDocument();
  });

  it('auto-opens and shows message', () => {
    render(<CoachBubble message="Great work!" personality="comedian" loading={false} />);
    expect(screen.getByText('Great work!')).toBeInTheDocument();
  });

  it('shows personality label in panel', () => {
    render(<CoachBubble message="Hello" personality="drill-sergeant" loading={false} />);
    expect(screen.getByText(/Drill Sergeant/)).toBeInTheDocument();
  });
});
