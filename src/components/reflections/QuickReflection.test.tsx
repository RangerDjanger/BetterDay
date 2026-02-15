import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickReflection from './QuickReflection';

describe('QuickReflection', () => {
  it('renders both text areas', () => {
    render(<QuickReflection wentWell="" toImprove="" onWentWellChange={vi.fn()} onToImproveChange={vi.fn()} />);
    expect(screen.getByPlaceholderText(/proud that/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tomorrow/i)).toBeInTheDocument();
  });

  it('displays provided values', () => {
    render(<QuickReflection wentWell="Good focus" toImprove="Sleep more" onWentWellChange={vi.fn()} onToImproveChange={vi.fn()} />);
    expect(screen.getByDisplayValue('Good focus')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sleep more')).toBeInTheDocument();
  });

  it('calls onWentWellChange on input', () => {
    const onChange = vi.fn();
    render(<QuickReflection wentWell="" toImprove="" onWentWellChange={onChange} onToImproveChange={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/proud that/i), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('calls onToImproveChange on input', () => {
    const onChange = vi.fn();
    render(<QuickReflection wentWell="" toImprove="" onWentWellChange={vi.fn()} onToImproveChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText(/Tomorrow/i), { target: { value: 'more' } });
    expect(onChange).toHaveBeenCalledWith('more');
  });
});
