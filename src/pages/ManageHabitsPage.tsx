import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Archive } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function ManageHabitsPage() {
  const { habits, deleteHabit, archiveHabit } = useHabits();
  const navigate = useNavigate();

  const active = habits.filter(h => !h.archived);
  const archived = habits.filter(h => h.archived);

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteHabit(id);
    }
  };

  const renderHabitRow = (h: typeof habits[0]) => (
    <div
      key={h.id}
      className={`bg-white rounded-xl p-4 border border-gray-100 shadow-sm ${h.archived ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{h.name}</p>
          {h.category && <p className="text-xs text-gray-400 mt-0.5">{h.category}</p>}
          <div className="flex gap-0.5 mt-2">
            {dayLabels.map((label, i) => (
              <span
                key={i}
                className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                  h.activeDays.length === 0 || h.activeDays.includes(i)
                    ? 'bg-blue-soft text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => navigate(`/habit/${h.id}/edit`)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-soft transition"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => archiveHabit(h.id)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-orange-500 transition"
            title={h.archived ? 'Unarchive' : 'Archive'}
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            onClick={() => confirmDelete(h.id, h.name)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-soft-dark">Manage Habits</h1>
        <button
          onClick={() => navigate('/add')}
          className="flex items-center gap-1 bg-blue-soft text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-soft-dark transition"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {active.length === 0 && archived.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p className="text-lg">No habits yet</p>
          <p className="text-sm mt-1">Tap "Add" to create your first habit</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {active.map(renderHabitRow)}
          </div>

          {archived.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mt-8 mb-2">
                Archived
              </h2>
              <div className="space-y-2">
                {archived.map(renderHabitRow)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
