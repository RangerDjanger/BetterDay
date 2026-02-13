const emojis = ['😢', '😕', '😐', '🙂', '😊'];

interface MoodCheckInProps {
  morning: number | undefined;
  evening: number | undefined;
  onMorningChange: (val: number) => void;
  onEveningChange: (val: number) => void;
}

export default function MoodCheckIn({ morning, evening, onMorningChange, onEveningChange }: MoodCheckInProps) {
  return (
    <div className="mt-4 bg-surface rounded-lg p-4 border border-border shadow">
      <p className="text-sm font-semibold text-text-primary mb-3">How are you feeling?</p>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-text-secondary mb-1">Morning</p>
          <div className="flex gap-2">
            {emojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => onMorningChange(i + 1)}
                className={`text-2xl p-1.5 rounded-lg transition-all ${
                  morning === i + 1
                    ? 'bg-blue-soft/20 ring-2 ring-blue-soft scale-110 shadow-sm'
                    : 'hover:bg-surface-light hover:scale-105'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-text-secondary mb-1">Evening</p>
          <div className="flex gap-2">
            {emojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => onEveningChange(i + 1)}
                className={`text-2xl p-1.5 rounded-lg transition-all ${
                  evening === i + 1
                    ? 'bg-green-gentle/20 ring-2 ring-green-gentle scale-110 shadow-sm'
                    : 'hover:bg-surface-light hover:scale-105'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
