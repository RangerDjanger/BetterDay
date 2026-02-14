import { useAuth } from '../context/AuthContext';
import { useCoach } from '../context/CoachContext';
import { useReminders } from '../context/ReminderContext';
import { logoutUrl } from '../services/auth';
import { COACH_LABELS } from '../services/coach';
import type { CoachPersonality } from '../services/coach';
import { Bell, BellOff } from 'lucide-react';

const personalities = Object.entries(COACH_LABELS) as [CoachPersonality, string][];

export default function SettingsPage() {
  const { user } = useAuth();
  const { personality, setPersonality } = useCoach();
  const { settings, supported, updateSettings, enable } = useReminders();

  const handleToggleReminders = async () => {
    if (settings.enabled) {
      updateSettings({ enabled: false });
    } else {
      const granted = await enable();
      if (!granted) {
        alert('Notification permission was denied. Please enable it in your browser settings.');
      }
    }
  };

  const clearData = () => {
    if (window.confirm('Clear all data? This will remove all habits, logs, reflections, and mood entries.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      <p className="text-text-muted text-sm mt-1">Manage your account</p>

      <div className="mt-6 space-y-4">
        <div className="bg-surface rounded-lg p-4 border border-border shadow">
          <p className="text-sm text-text-muted">Signed in as</p>
          <p className="font-medium text-text-primary">{user?.userDetails ?? 'Dev Mode'}</p>
        </div>

        <div className="bg-surface rounded-lg p-4 border border-border shadow">
          <p className="text-sm font-semibold text-text-primary mb-3">Habit Coach</p>
          <p className="text-xs text-text-muted mb-3">Choose your coach's personality</p>
          <div className="space-y-2">
            {personalities.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPersonality(key)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
                  personality === key
                    ? 'bg-blue-soft/15 border-blue-soft text-blue-soft-light ring-1 ring-blue-soft'
                    : 'bg-surface-light border-border text-text-secondary hover:border-text-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {supported && (
          <div className="bg-surface rounded-lg p-4 border border-border shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-text-primary">Reminders</p>
              <button
                onClick={handleToggleReminders}
                className={`p-2 rounded-lg transition-all ${
                  settings.enabled
                    ? 'text-green-gentle bg-green-gentle/10'
                    : 'text-text-muted bg-surface-light'
                }`}
                title={settings.enabled ? 'Disable reminders' : 'Enable reminders'}
              >
                {settings.enabled ? <Bell size={18} /> : <BellOff size={18} />}
              </button>
            </div>
            <p className="text-xs text-text-muted mb-3">
              Stay on track with gentle nudges. Get a morning heads-up of today's habits, an evening prompt to log your progress, and optional per-habit reminders throughout the day.
            </p>


            {settings.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">
                    🌅 Morning reminder
                  </label>
                  <p className="text-xs text-text-muted mb-1.5">Lists your habits for the day</p>
                  <input
                    type="time"
                    value={settings.morningTime}
                    onChange={e => updateSettings({ morningTime: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-soft focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1">
                    🌙 Evening check-in
                  </label>
                  <p className="text-xs text-text-muted mb-1.5">Reminds you to log habits and reflect</p>
                  <input
                    type="time"
                    value={settings.eveningTime}
                    onChange={e => updateSettings({ eveningTime: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-soft focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-text-muted mt-1">
                  💡 You can also set a reminder for each individual habit when adding or editing it — great for habits tied to a specific time of day.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-surface rounded-lg p-4 border border-border shadow">
          <p className="text-sm text-text-muted">Version</p>
          <p className="font-medium text-text-primary">0.1.0 — Phase 0 POC</p>
        </div>

        <button
          onClick={clearData}
          className="block w-full text-center bg-orange-500/10 text-orange-400 font-medium py-3 rounded-lg border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
        >
          Clear All Data
        </button>

        <a
          href={logoutUrl()}
          className="block w-full text-center bg-red-500/10 text-red-400 font-medium py-3 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors"
        >
          Sign out
        </a>
      </div>
    </div>
  );
}
