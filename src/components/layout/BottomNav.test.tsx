import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from './BottomNav';

describe('BottomNav', () => {
  const renderNav = () => render(<MemoryRouter><BottomNav /></MemoryRouter>);

  it('renders Today tab', () => {
    renderNav();
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('renders Reports tab', () => {
    renderNav();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('renders Settings tab', () => {
    renderNav();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders nav element', () => {
    renderNav();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
