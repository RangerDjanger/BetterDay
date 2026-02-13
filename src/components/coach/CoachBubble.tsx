import { useState } from 'react';
import { MessageCircle, X, Loader2 } from 'lucide-react';
import type { CoachPersonality } from '../../services/coach';
import { COACH_LABELS } from '../../services/coach';

interface CoachBubbleProps {
  message: string | null;
  personality: CoachPersonality;
  loading: boolean;
}

export default function CoachBubble({ message, personality, loading }: CoachBubbleProps) {
  const [open, setOpen] = useState(false);

  // Auto-open when a new message arrives
  if (message && !open && !loading) {
    setOpen(true);
  }

  if (!message && !loading) return null;

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 w-80 max-w-[calc(100vw-2rem)] bg-surface border border-border rounded-lg shadow-xl z-50 animate-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-text-primary">
              {COACH_LABELS[personality]}
            </p>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full text-text-muted hover:text-text-secondary hover:bg-surface-light transition-all"
            >
              <X size={16} />
            </button>
          </div>
          <div className="px-4 py-3">
            {loading ? (
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>Thinking…</span>
              </div>
            ) : (
              <p className="text-sm text-text-primary leading-relaxed">{message}</p>
            )}
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-24 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50 transition-all ${
          open
            ? 'scale-0 pointer-events-none'
            : 'bg-blue-soft text-white hover:bg-blue-soft-dark active:scale-95'
        } ${loading ? 'animate-pulse' : ''}`}
      >
        <MessageCircle size={22} />
        {(message || loading) && !open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-gentle rounded-full border-2 border-gray-warm" />
        )}
      </button>
    </>
  );
}
