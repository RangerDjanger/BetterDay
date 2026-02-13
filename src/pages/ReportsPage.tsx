import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useHabits } from '../context/HabitContext';
import { useMood } from '../context/MoodContext';
import { calcStats } from '../utils/streaks';

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function ReportsPage() {
  const { habits, logs } = useHabits();
  const { moods } = useMood();

  const activeHabits = habits.filter(h => !h.archived);

  // --- Completion Rate (last 30 days) ---
  const completionData: { date: string; pct: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = toDateStr(d);
    const dayHabits = activeHabits.filter(
      h => h.activeDays.length === 0 || h.activeDays.includes(d.getDay()),
    );
    if (dayHabits.length === 0) continue;
    const done = dayHabits.filter(h =>
      logs.some(l => l.habitId === h.id && l.date === ds && l.completed),
    ).length;
    completionData.push({ date: ds.slice(5), pct: Math.round((done / dayHabits.length) * 100) });
  }

  // --- Streak Progress ---
  const streakData = activeHabits.map(h => {
    const s = calcStats(h.id, h.activeDays, logs);
    return { name: h.name.length > 18 ? h.name.slice(0, 16) + '…' : h.name, current: s.currentStreak, goal: s.streakGoal };
  });

  // --- Category Breakdown ---
  const categories = [...new Set(activeHabits.map(h => h.category || 'Uncategorised'))];
  const categoryData = categories.map(cat => {
    const catHabits = activeHabits.filter(h => (h.category || 'Uncategorised') === cat);
    const total = catHabits.length * 30;
    const done = catHabits.reduce(
      (sum, h) => sum + logs.filter(l => l.habitId === h.id && l.completed).length,
      0,
    );
    return { category: cat.replace(/^.{1,2}\s/, ''), pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  });

  // --- Mood Trend ---
  const moodData = [...moods]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map(m => ({
      date: m.date.slice(5),
      morning: m.morning ?? null,
      evening: m.evening ?? null,
    }));

  // --- Consistency Score ---
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = toDateStr(d);
    const dayHabits = activeHabits.filter(
      h => h.activeDays.length === 0 || h.activeDays.includes(d.getDay()),
    );
    const done = dayHabits.filter(h =>
      logs.some(l => l.habitId === h.id && l.date === ds && l.completed),
    ).length;
    last7.push({ total: dayHabits.length, done });
  }
  const totalPossible = last7.reduce((s, d) => s + d.total, 0);
  const totalDone = last7.reduce((s, d) => s + d.done, 0);
  const consistency = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  const hasData = logs.length > 0;

  if (!hasData && moods.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-blue-soft-dark">Reports</h1>
        <p className="text-gray-400 text-sm mt-1">Your progress at a glance</p>
        <div className="mt-6 text-center text-gray-400 py-12">
          <p className="text-lg">No data yet</p>
          <p className="text-sm mt-1">Complete some habits to see your stats</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-soft-dark">Reports</h1>
      <p className="text-gray-400 text-sm mt-1">Your progress at a glance</p>

      {/* Consistency Score */}
      <div className="mt-6 bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
        <p className="text-5xl font-bold text-blue-soft">{consistency}%</p>
        <p className="text-sm text-gray-400 mt-1">7-Day Consistency</p>
      </div>

      {/* Completion Rate */}
      {completionData.length > 0 && (
        <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-3">Daily Completion Rate</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="pct" stroke="#6B9BD2" fill="#6B9BD2" fillOpacity={0.2} name="%" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Streak Progress */}
      {streakData.length > 0 && (
        <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-3">Streak Progress (vs 30-Day Goal)</p>
          <ResponsiveContainer width="100%" height={Math.max(120, streakData.length * 32)}>
            <BarChart data={streakData} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" domain={[0, 30]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
              <Tooltip />
              <Bar dataKey="current" fill="#7CB69D" radius={[0, 4, 4, 0]} name="Days" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-3">Category Breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="pct" fill="#6B9BD2" radius={[4, 4, 0, 0]} name="%" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Mood Trend */}
      {moodData.length > 0 && (
        <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-3">Mood Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="morning" stroke="#6B9BD2" name="Morning" connectNulls />
              <Line type="monotone" dataKey="evening" stroke="#7CB69D" name="Evening" connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
