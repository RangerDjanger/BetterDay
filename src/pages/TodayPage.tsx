import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { useMood } from '../context/MoodContext';
import { useReflections } from '../context/ReflectionContext';
import { useCoach } from '../context/CoachContext';
import { calcCurrentStreak } from '../utils/streaks';
import { checkNewMilestone } from '../utils/milestones';
import { getCoachResponse } from '../services/coach';
import MoodCheckIn from '../components/mood/MoodCheckIn';
import QuickReflection from '../components/reflections/QuickReflection';
import CoachBubble from '../components/coach/CoachBubble';

export default function TodayPage() {
  const { habits, logs, toggleHabit, isCompleted } = useHabits();
  const { getMood, saveMood } = useMood();
  const { getReflection, saveReflection } = useReflections();
  const { personality } = useCoach();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const dateStr = now.toISOString().slice(0, 10);

  const today = now.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const todaysHabits = habits.filter(
    h => !h.archived && (h.activeDays.length === 0 || h.activeDays.includes(dayOfWeek)),
  );

  const grouped = todaysHabits.reduce<Record<string, typeof todaysHabits>>((acc, h) => {
    const cat = h.category || 'Uncategorised';
    (acc[cat] ??= []).push(h);
    return acc;
  }, {});

  const completedCount = todaysHabits.filter(h => isCompleted(h.id, dateStr)).length;
  const todayMood = getMood(dateStr);
  const todayReflection = getReflection(dateStr);

  const [morning, setMorning] = useState<number | undefined>(todayMood?.morning);
  const [evening, setEvening] = useState<number | undefined>(todayMood?.evening);
  const [wentWell, setWentWell] = useState(todayReflection?.wentWell || '');
  const [toImprove, setToImprove] = useState(todayReflection?.toImprove || '');
  const [saved, setSaved] = useState(false);
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);

  const hasEntry = morning !== undefined || evening !== undefined || wentWell.trim() || toImprove.trim();

  const handleSaveEntry = () => {
    if (morning !== undefined || evening !== undefined) {
      saveMood({ date: dateStr, morning, evening });
    }
    if (wentWell.trim() || toImprove.trim()) {
      saveReflection({ date: dateStr, wentWell, toImprove });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Trigger coach response
    const completedHabits = todaysHabits
      .filter(h => isCompleted(h.id, dateStr))
      .map(h => h.name);
    const missedHabits = todaysHabits
      .filter(h => !isCompleted(h.id, dateStr))
      .map(h => h.name);

    setCoachLoading(true);
    getCoachResponse(
      personality,
      {
        completedHabits,
        missedHabits,
        totalHabits: todaysHabits.length,
        morning,
        evening,
        wentWell,
        toImprove,
      },
    )
      .then(msg => setCoachMessage(msg))
      .catch((err) => {
        console.error('Coach error:', err);
        setCoachMessage(`⚠️ Coach unavailable: ${err?.message || 'Unknown error'}`);
      })
      .finally(() => setCoachLoading(false));
  };

  const [lastToggled, setLastToggled] = useState<string | null>(null);

  const handleToggle = (habitId: string) => {
    if (!isCompleted(habitId, dateStr)) {
      // Will be completed after toggle — check milestone via effect
      setLastToggled(habitId);
    }
    toggleHabit(habitId, dateStr);
  };

  useEffect(() => {
    if (!lastToggled) return;
    const habit = habits.find(h => h.id === lastToggled);
    if (!habit) return;
    const milestone = checkNewMilestone(lastToggled, habit.activeDays, logs);
    if (milestone) {
      setToast(milestone);
      setTimeout(() => setToast(null), 3000);
    }
    setLastToggled(null);
  }, [logs, lastToggled, habits]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Today</h1>
          <p className="text-text-secondary text-sm mt-0.5">{today}</p>
        </div>
        <button
          onClick={() => navigate('/manage')}
          className="p-2 rounded-lg text-text-muted hover:bg-surface-light hover:text-text-secondary transition-all"
          title="Manage Habits"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <MoodCheckIn
        morning={morning}
        evening={evening}
        onMorningChange={setMorning}
        onEveningChange={setEvening}
      />

      {todaysHabits.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm font-semibold text-text-secondary">Habits</p>
            <p className="text-sm font-bold text-green-gentle">
              {completedCount}/{todaysHabits.length}
            </p>
          </div>
          <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
            <div
              className="h-full bg-green-gentle rounded-full transition-all duration-500"
              style={{ width: `${todaysHabits.length ? (completedCount / todaysHabits.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {todaysHabits.length === 0 ? (
        <div className="mt-6 text-center text-text-muted py-12">
          <p className="text-lg">No habits for today</p>
          <p className="text-sm mt-1">Enjoy your day off!</p>
        </div>
      ) : (
        <div className="mt-3 space-y-6">
          {Object.entries(grouped).map(([category, catHabits]) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
                {category}
              </h2>
              <div className="space-y-2">
                {catHabits.map(habit => {
                  const done = isCompleted(habit.id, dateStr);
                  const streak = calcCurrentStreak(habit.id, habit.activeDays, logs);
                  return (
                    <div
                      key={habit.id}
                      className={`rounded-lg p-4 shadow transition-all ${
                        done
                          ? 'bg-green-gentle/10 border border-green-gentle/30'
                          : 'bg-surface border border-border hover:shadow-md hover:border-blue-soft/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          className="flex-1 text-left mr-3"
                          onClick={() => navigate(`/habit/${habit.id}`)}
                        >
                          <p className={`font-semibold ${done ? 'text-green-gentle line-through' : 'text-text-primary'}`}>
                            {habit.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {habit.description && (
                              <p className="text-xs text-text-muted">{habit.description}</p>
                            )}
                          </div>
                          {streak > 0 && (
                            <p className="text-xs text-orange-500 font-medium mt-1">
                              🔥 {streak} day{streak !== 1 ? 's' : ''}
                            </p>
                          )}
                        </button>
                        <button
                          onClick={() => handleToggle(habit.id)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            done
                              ? 'bg-green-gentle border-green-gentle text-white shadow-sm'
                              : 'border-text-muted hover:border-green-gentle hover:scale-110'
                          }`}
                        >
                          {done && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <QuickReflection
        wentWell={wentWell}
        toImprove={toImprove}
        onWentWellChange={setWentWell}
        onToImproveChange={setToImprove}
      />

      <button
        onClick={handleSaveEntry}
        disabled={!hasEntry}
        className="mt-5 w-full bg-blue-soft text-white py-3 rounded-lg font-semibold hover:bg-blue-soft-dark active:scale-[0.98] transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {saved ? '✓ Saved!' : 'Save Daily Entry'}
      </button>

      {/* Milestone Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-gentle-dark text-white px-6 py-3 rounded-lg shadow-lg text-sm font-semibold animate-bounce z-50">
          {toast}
        </div>
      )}

      <CoachBubble
        message={coachMessage}
        personality={personality}
        loading={coachLoading}
      />
    </div>
  );
}
