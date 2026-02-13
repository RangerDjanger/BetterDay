import { useState, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface QuickReflectionProps {
  wentWell: string;
  toImprove: string;
  onWentWellChange: (val: string) => void;
  onToImproveChange: (val: string) => void;
}

type Field = 'wentWell' | 'toImprove';

function useSpeechToText(onResult: (text: string) => void) {
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const supported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const start = useCallback(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = 'en-AU';

    r.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
    };
    r.onend = () => setRecording(false);
    r.onerror = () => setRecording(false);

    r.start();
    setRecognition(r);
    setRecording(true);
  }, [supported, onResult]);

  const stop = useCallback(() => {
    recognition?.stop();
    setRecording(false);
  }, [recognition]);

  return { recording, start, stop, supported };
}

export default function QuickReflection({ wentWell, toImprove, onWentWellChange, onToImproveChange }: QuickReflectionProps) {
  const [activeField, setActiveField] = useState<Field | null>(null);

  const handleResult = useCallback((text: string) => {
    if (activeField === 'wentWell') {
      onWentWellChange(wentWell ? `${wentWell} ${text}` : text);
    } else if (activeField === 'toImprove') {
      onToImproveChange(toImprove ? `${toImprove} ${text}` : text);
    }
    setActiveField(null);
  }, [activeField, wentWell, toImprove, onWentWellChange, onToImproveChange]);

  const { recording, start, stop, supported } = useSpeechToText(handleResult);

  const toggleRecording = (field: Field) => {
    if (recording && activeField === field) {
      stop();
      setActiveField(null);
    } else {
      if (recording) stop();
      setActiveField(field);
      start();
    }
  };

  return (
    <div className="mt-4 bg-surface rounded-lg p-4 border border-border shadow">
      <p className="text-sm font-semibold text-text-primary mb-3">Daily Reflection</p>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-text-secondary">What went well?</label>
            {supported && (
              <button
                type="button"
                onClick={() => toggleRecording('wentWell')}
                className={`p-1 rounded-full transition-all ${
                  recording && activeField === 'wentWell'
                    ? 'text-red-400 bg-red-500/15 animate-pulse'
                    : 'text-text-muted hover:text-blue-soft hover:bg-blue-soft/10'
                }`}
                title={recording && activeField === 'wentWell' ? 'Stop recording' : 'Record voice'}
              >
                {recording && activeField === 'wentWell' ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
            )}
          </div>
          <textarea
            value={wentWell}
            onChange={e => onWentWellChange(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-soft focus:border-transparent resize-none placeholder:text-text-muted"
            placeholder="I'm proud that…"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-text-secondary">What could improve?</label>
            {supported && (
              <button
                type="button"
                onClick={() => toggleRecording('toImprove')}
                className={`p-1 rounded-full transition-all ${
                  recording && activeField === 'toImprove'
                    ? 'text-red-400 bg-red-500/15 animate-pulse'
                    : 'text-text-muted hover:text-blue-soft hover:bg-blue-soft/10'
                }`}
                title={recording && activeField === 'toImprove' ? 'Stop recording' : 'Record voice'}
              >
                {recording && activeField === 'toImprove' ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
            )}
          </div>
          <textarea
            value={toImprove}
            onChange={e => onToImproveChange(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-border bg-surface-light px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-soft focus:border-transparent resize-none placeholder:text-text-muted"
            placeholder="Tomorrow I'll try to…"
          />
        </div>
      </div>
    </div>
  );
}
