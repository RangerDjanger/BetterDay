import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('auth service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  describe('getUserInfo - prod mode', () => {
    it('returns null when /.auth/me fails', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
      // Dynamic import so import.meta.env.DEV=false takes effect
      vi.stubEnv('DEV', false as unknown as string);
      const { getUserInfo } = await import('./auth');
      const user = await getUserInfo();
      expect(user).toBeNull();
    });

    it('returns null when clientPrincipal is null', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ clientPrincipal: null }),
      }));
      vi.stubEnv('DEV', false as unknown as string);
      const { getUserInfo } = await import('./auth');
      const user = await getUserInfo();
      expect(user).toBeNull();
    });

    it('returns user info from /.auth/me', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
          clientPrincipal: {
            userId: 'abc123',
            userDetails: 'test@live.com',
            identityProvider: 'aad',
            userRoles: ['authenticated', 'anonymous'],
          },
        }),
      }));
      vi.stubEnv('DEV', false as unknown as string);
      const { getUserInfo } = await import('./auth');
      const user = await getUserInfo();
      expect(user).toEqual({
        userId: 'abc123',
        userDetails: 'test@live.com',
        identityProvider: 'aad',
        userRoles: ['authenticated', 'anonymous'],
      });
    });
  });

  describe('loginUrl', () => {
    it('returns AAD login path', async () => {
      const { loginUrl } = await import('./auth');
      expect(loginUrl()).toBe('/.auth/login/aad');
    });
  });

  describe('logoutUrl', () => {
    it('returns logout path', async () => {
      const { logoutUrl } = await import('./auth');
      expect(logoutUrl()).toBe('/.auth/logout');
    });
  });
});
