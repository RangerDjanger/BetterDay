import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { calcStats } from '../utils/streaks';
import { getMilestonesForHabit } from '../utils/milestones';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HabitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { habits, logs, isCompleted } = useHabits();

  const habit = habits.find(h => h.id === id);
  if (!habit) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Habit not found</p>
        <button onClick={() => navigate('/')} className="text-blue-soft mt-2 underline">Go back</button>
      </div>
    );
  }

  const stats = calcStats(habit.id, habit.activeDays, logs);
  const goalPct = Math.min(100, Math.round((stats.currentStreak / stats.streakGoal) * 100));

  // Last 30 days calendar
  const cells: { date: string; active: boolean; done: boolean }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const active = habit.activeDays.length === 0 || habit.activeDays.includes(d.getDay());
    cells.push({ date: ds, active, done: isCompleted(habit.id, ds) });
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-blue-soft text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-blue-soft-dark">{habit.name}</h1>
      {habit.description && <p className="text-gray-400 text-sm mt-1">{habit.description}</p>}
      {habit.category && <p className="text-xs text-gray-500 mt-1">{habit.category}</p>}

      <div className="flex gap-1 mt-3">
        {dayLabels.map((label, i) => (
          <span
            key={i}
            className={`px-2 py-1 rounded text-xs font-medium ${
              habit.activeDays.length === 0 || habit.activeDays.includes(i)
                ? 'bg-blue-soft text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center shadow-sm">
          <p className="text-2xl font-bold text-orange-500">🔥 {stats.currentStreak}</p>
          <p className="text-xs text-gray-400 mt-1">Current Streak</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-soft">⭐ {stats.bestStreak}</p>
          <p className="text-xs text-gray-400 mt-1">Best Streak</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-gentle">{stats.totalCompletions}</p>
          <p className="text-xs text-gray-400 mt-1">Total Done</p>
        </div>
      </div>

      {/* 30-Day Goal Progress */}
      <div className="mt-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700">30-Day Goal</p>
          <p className="text-sm text-gray-400">
            {stats.currentStreak} / {stats.streakGoal}
          </p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${stats.streakGoalComplete ? 'bg-green-500' : 'bg-blue-soft'}`}
            style={{ width: `${goalPct}%` }}
          />
        </div>
        {stats.streakGoalComplete && (
          <p className="text-sm text-green-600 font-medium mt-2 text-center">
            🎉 Goal Complete! Date Night Unlocked!
          </p>
        )}
      </div>

      {/* 30-Day Calendar */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Last 30 Days</p>
        <div className="grid grid-cols-7 gap-1">
          {cells.map(cell => (
            <div
              key={cell.date}
              title={cell.date}
              className={`aspect-square rounded-md flex items-center justify-center text-xs ${
                !cell.active
                  ? 'bg-gray-50 text-gray-300'
                  : cell.done
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {new Date(cell.date).getDate()}
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Milestones</p>
        <div className="space-y-2">
          {getMilestonesForHabit(habit.id, habit.activeDays, logs).map(m => (
            <div
              key={m.days}
              className={`rounded-xl p-3 border text-sm flex items-center justify-between ${
                m.achieved
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-gray-50 border-gray-100 text-gray-400'
              }`}
            >
              <span>{m.label}</span>
              <span className="text-xs">{m.days} days</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
