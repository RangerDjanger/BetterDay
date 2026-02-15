import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestPermission, sendNotification, isSupported, isEnabled, setEnabled } from './notifications';

describe('notifications service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('requestPermission', () => {
    it('returns true when permission granted', async () => {
      vi.stubGlobal('Notification', { permission: 'default', requestPermission: vi.fn().mockResolvedValue('granted') });
      const result = await requestPermission();
      expect(result).toBe(true);
    });

    it('returns true when already granted', async () => {
      vi.stubGlobal('Notification', { permission: 'granted', requestPermission: vi.fn() });
      const result = await requestPermission();
      expect(result).toBe(true);
    });

    it('returns false when denied', async () => {
      vi.stubGlobal('Notification', { permission: 'denied', requestPermission: vi.fn() });
      const result = await requestPermission();
      expect(result).toBe(false);
    });
  });

  describe('isSupported', () => {
    it('returns true when Notification API exists', () => {
      vi.stubGlobal('Notification', { permission: 'default' });
      expect(isSupported()).toBe(true);
    });
  });

  describe('isEnabled / setEnabled', () => {
    it('returns false by default', () => {
      vi.stubGlobal('Notification', { permission: 'granted' });
      expect(isEnabled()).toBe(false);
    });

    it('returns true after setEnabled(true) with permission granted', () => {
      vi.stubGlobal('Notification', { permission: 'granted' });
      setEnabled(true);
      expect(isEnabled()).toBe(true);
    });

    it('returns false after setEnabled(false)', () => {
      vi.stubGlobal('Notification', { permission: 'granted' });
      setEnabled(true);
      setEnabled(false);
      expect(isEnabled()).toBe(false);
    });
  });

  describe('sendNotification', () => {
    it('creates a Notification when enabled', () => {
      const MockNotification = vi.fn();
      vi.stubGlobal('Notification', Object.assign(MockNotification, { permission: 'granted' }));
      setEnabled(true);
      sendNotification('Test Title', 'Test Body');
      expect(MockNotification).toHaveBeenCalledWith('Test Title', expect.objectContaining({ body: 'Test Body' }));
    });

    it('does not create a Notification when not enabled', () => {
      const MockNotification = vi.fn();
      vi.stubGlobal('Notification', Object.assign(MockNotification, { permission: 'granted' }));
      sendNotification('Test', 'Body');
      expect(MockNotification).not.toHaveBeenCalled();
    });
  });
});
