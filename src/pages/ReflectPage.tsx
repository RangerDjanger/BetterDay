import { useState } from 'react';
import { useReflections } from '../context/ReflectionContext';

export default function ReflectPage() {
  const { reflections, saveReflection, getReflection } = useReflections();
  const dateStr = new Date().toISOString().slice(0, 10);
  const todayReflection = getReflection(dateStr);

  const [wentWell, setWentWell] = useState(todayReflection?.wentWell || '');
  const [toImprove, setToImprove] = useState(todayReflection?.toImprove || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveReflection({ date: dateStr, wentWell, toImprove });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const past = reflections
    .filter(r => r.date !== dateStr)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-soft-dark">Reflect</h1>
      <p className="text-gray-400 text-sm mt-1">Daily reflection journal</p>

      <div className="mt-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What went well today?
          </label>
          <textarea
            value={wentWell}
            onChange={e => setWentWell(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-soft resize-none"
            placeholder="I'm proud that…"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What could improve?
          </label>
          <textarea
            value={toImprove}
            onChange={e => setToImprove(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-soft resize-none"
            placeholder="Tomorrow I'll try to…"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-soft text-white py-2.5 rounded-lg font-medium hover:bg-blue-soft-dark transition"
        >
          {saved ? '✓ Saved!' : 'Save Reflection'}
        </button>
      </div>

      {past.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Past Reflections
          </h2>
          <div className="space-y-3">
            {past.map(r => (
              <div key={r.date} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(r.date + 'T00:00').toLocaleDateString('en-AU', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
                {r.wentWell && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-green-gentle">Went well</p>
                    <p className="text-sm text-gray-700">{r.wentWell}</p>
                  </div>
                )}
                {r.toImprove && (
                  <div>
                    <p className="text-xs font-medium text-orange-400">To improve</p>
                    <p className="text-sm text-gray-700">{r.toImprove}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
