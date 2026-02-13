import type { Habit } from '../types';

const allDays = [0, 1, 2, 3, 4, 5, 6];
const weekdays = [1, 2, 3, 4, 5];
const weekends = [0, 6];

export const seedHabits: Habit[] = [
  // 📵 Device Free
  {
    id: 'seed-device-free-before-work',
    name: 'Device Free Before Work',
    description: 'No phone or screens before leaving for work',
    category: '📵 Device Free',
    createdAt: new Date().toISOString(),
    activeDays: weekdays,
    archived: false,
  },
  {
    id: 'seed-device-free-after-work',
    name: 'Device Free After Work',
    description: 'Put the phone away when you get home',
    category: '📵 Device Free',
    createdAt: new Date().toISOString(),
    activeDays: weekdays,
    archived: false,
  },
  {
    id: 'seed-device-free-weekend',
    name: 'Device Free Weekend',
    description: 'Stay off devices and be present with family',
    category: '📵 Device Free',
    createdAt: new Date().toISOString(),
    activeDays: weekends,
    archived: false,
  },

  // 🏠 Presence & Connection
  {
    id: 'seed-device-free-dinner',
    name: 'Device-Free Dinner',
    description: 'No devices at the dinner table',
    category: '🏠 Presence & Connection',
    createdAt: new Date().toISOString(),
    activeDays: allDays,
    archived: false,
  },
  {
    id: 'seed-1on1-with-child',
    name: '10-Minute 1-on-1 with Each Child',
    description: 'Dedicated one-on-one time with each child',
    category: '🏠 Presence & Connection',
    createdAt: new Date().toISOString(),
    activeDays: allDays,
    archived: false,
  },
  {
    id: 'seed-eye-contact-conversation',
    name: 'Eye Contact Conversation',
    description: 'Have a meaningful face-to-face conversation',
    category: '🏠 Presence & Connection',
    createdAt: new Date().toISOString(),
    activeDays: allDays,
    archived: false,
  },
  {
    id: 'seed-family-activity',
    name: 'Family Activity',
    description: 'Do something fun together as a family',
    category: '🏠 Presence & Connection',
    createdAt: new Date().toISOString(),
    activeDays: weekends,
    archived: false,
  },
  {
    id: 'seed-active-listening',
    name: 'Active Listening Moment',
    description: 'Fully listen without interrupting or checking your phone',
    category: '🏠 Presence & Connection',
    createdAt: new Date().toISOString(),
    activeDays: allDays,
    archived: false,
  },

  // 😌 Kindness & Calm
  {
    id: 'seed-morning-calm',
    name: 'Morning Calm Routine',
    description: '5 minutes of breathing or meditation to start the day',
    category: '😌 Kindness & Calm',
    createdAt: new Date().toISOString(),
    activeDays: allDays,
    archived: false,
  },
  {
    id: 'seed-no-raised-voice',
    name: 'No Raised Voice Day',
    description: 'Stay calm and patient all day — no yelling',
    category: '😌 Kindness & Calm',
    createdAt: new Date().toISOString(),
    activeDays: allDays,
    archived: false,
  },
];
