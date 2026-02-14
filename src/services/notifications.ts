const PERMISSION_KEY = 'betterday-notifications-enabled';

export async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function isSupported(): boolean {
  return 'Notification' in window;
}

export function isEnabled(): boolean {
  return Notification.permission === 'granted' && localStorage.getItem(PERMISSION_KEY) === 'true';
}

export function setEnabled(val: boolean): void {
  localStorage.setItem(PERMISSION_KEY, String(val));
}

export function sendNotification(title: string, body: string, tag?: string): void {
  if (!isEnabled()) return;
  new Notification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: tag ?? title,
  });
}

// Scheduler that checks every minute if a notification is due
type ScheduledReminder = {
  id: string;
  time: string; // HH:mm
  title: string;
  body: string;
  days?: number[]; // 0=Sun..6=Sat, empty = every day
};

let activeReminders: ScheduledReminder[] = [];
let intervalId: ReturnType<typeof setInterval> | null = null;
let lastFiredKey = '';

export function setReminders(reminders: ScheduledReminder[]): void {
  activeReminders = reminders;

  if (reminders.length > 0 && !intervalId) {
    intervalId = setInterval(checkReminders, 30_000);
    checkReminders(); // check immediately
  } else if (reminders.length === 0 && intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function checkReminders(): void {
  if (!isEnabled()) return;

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hh}:${mm}`;
  const currentDay = now.getDay();
  const dateStr = now.toISOString().slice(0, 10);

  for (const r of activeReminders) {
    if (r.time !== currentTime) continue;

    // Check if active today
    if (r.days && r.days.length > 0 && !r.days.includes(currentDay)) continue;

    // Prevent double-firing within the same minute
    const key = `${r.id}-${dateStr}-${currentTime}`;
    if (key === lastFiredKey) continue;
    lastFiredKey = key;

    sendNotification(r.title, r.body, r.id);
  }
}

export function stopReminders(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  activeReminders = [];
}
