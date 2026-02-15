import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

function TestConsumer() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return <div>{user ? user.userDetails : 'No user'}</div>;
}

describe('AuthContext', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides dev user in dev mode', async () => {
    // In vitest, import.meta.env.DEV is true, so getUserInfo returns dev user
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => {
      expect(screen.getByText('Developer')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('useAuth returns context values', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});
