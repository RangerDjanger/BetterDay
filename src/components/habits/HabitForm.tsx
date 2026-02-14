import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Habit } from '../../types';
import { useHabits } from '../../context/HabitContext';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const defaultCategories = ['📵 Device Free', '🏠 Presence & Connection', '😌 Kindness & Calm'];

export default function HabitForm() {
  const { habits, addHabit, updateHabit } = useHabits();
  const navigate = useNavigate();
  const { id } = useParams();

  const existing = id ? habits.find(h => h.id === id) : null;

  const [name, setName] = useState(existing?.name || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [category, setCategory] = useState(existing?.category || defaultCategories[0]);
  const [activeDays, setActiveDays] = useState<number[]>(existing?.activeDays ?? [0, 1, 2, 3, 4, 5, 6]);
  const [reminderTime, setReminderTime] = useState(existing?.reminderTime || '');

  const toggleDay = (day: number) => {
    setActiveDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort(),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const habit: Habit = {
      id: existing?.id || `habit-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      createdAt: existing?.createdAt || new Date().toISOString(),
      reminderTime: reminderTime || undefined,
      activeDays,
      archived: existing?.archived || false,
    };

    if (existing) {
      updateHabit(habit);
    } else {
      addHabit(habit);
    }
    navigate(-1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        {existing ? 'Edit Habit' : 'Add Habit'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-soft focus:border-transparent placeholder:text-text-muted"
            placeholder="e.g. Morning Meditation"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-soft focus:border-transparent placeholder:text-text-muted"
            placeholder="Optional description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-soft focus:border-transparent"
          >
            {defaultCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Active Days</label>
          <div className="flex gap-1">
            {dayLabels.map((label, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleDay(i)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${
                  activeDays.includes(i)
                    ? 'bg-blue-soft text-white'
                    : 'bg-surface-light text-text-muted hover:bg-surface-light/80 border border-border'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Reminder Time</label>
          <p className="text-xs text-text-muted mb-1.5">Get a notification when it's time for this habit</p>
          <input
            type="time"
            value={reminderTime}
            onChange={e => setReminderTime(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-soft focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-soft text-white py-2.5 rounded-lg font-medium hover:bg-blue-soft-dark transition"
          >
            {existing ? 'Save Changes' : 'Add Habit'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-surface-light text-text-secondary py-2.5 rounded-lg font-medium border border-border hover:bg-surface-light/80 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
