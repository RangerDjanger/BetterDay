import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('renders the app name', () => {
    render(<LoginPage />);
    expect(screen.getByText('BetterDay')).toBeInTheDocument();
  });

  it('renders the sign-in button', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign in with Microsoft')).toBeInTheDocument();
  });

  it('sign-in link points to AAD login', () => {
    render(<LoginPage />);
    const link = screen.getByText('Sign in with Microsoft');
    expect(link).toHaveAttribute('href', '/.auth/login/aad');
  });

  it('renders the tagline', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Track your habits/)).toBeInTheDocument();
  });
});
