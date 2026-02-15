import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MoodCheckIn from './MoodCheckIn';

describe('MoodCheckIn', () => {
  it('renders morning and evening sections', () => {
    render(<MoodCheckIn morning={undefined} evening={undefined} onMorningChange={vi.fn()} onEveningChange={vi.fn()} />);
    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.getByText('Evening')).toBeInTheDocument();
  });

  it('renders 5 emoji buttons per section', () => {
    render(<MoodCheckIn morning={undefined} evening={undefined} onMorningChange={vi.fn()} onEveningChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(10); // 5 morning + 5 evening
  });

  it('calls onMorningChange when morning emoji clicked', () => {
    const onChange = vi.fn();
    render(<MoodCheckIn morning={undefined} evening={undefined} onMorningChange={onChange} onEveningChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // third emoji = mood 3
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onEveningChange when evening emoji clicked', () => {
    const onChange = vi.fn();
    render(<MoodCheckIn morning={undefined} evening={undefined} onMorningChange={vi.fn()} onEveningChange={onChange} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[8]); // 9th button = evening mood 4
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('highlights selected morning mood', () => {
    render(<MoodCheckIn morning={3} evening={undefined} onMorningChange={vi.fn()} onEveningChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[2].className).toContain('ring-2');
  });

  it('highlights selected evening mood', () => {
    render(<MoodCheckIn morning={undefined} evening={5} onMorningChange={vi.fn()} onEveningChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[9].className).toContain('ring-2');
  });
});
