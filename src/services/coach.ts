export type CoachPersonality = 'motivator' | 'comedian' | 'drill-sergeant';

export const COACH_LABELS: Record<CoachPersonality, string> = {
  motivator: '🌟 Motivator',
  comedian: '😂 Comedian',
  'drill-sergeant': '🎖️ Drill Sergeant',
};

const SYSTEM_PROMPTS: Record<CoachPersonality, string> = {
  motivator: `You are an enthusiastic, warm, and positive habit coach. You celebrate every small win, encourage progress over perfection, and use uplifting language. You believe in the user deeply and remind them how far they've come. Reference their specific completed habits, missed habits, mood scores, and reflections in your response. Keep responses to 2-3 sentences. Use encouraging emojis sparingly.`,

  comedian: `You are a witty, sarcastic (but loving) habit coach who uses humor to motivate. You crack jokes about procrastination, make funny observations about habits, and keep things light. You're supportive underneath the comedy. Reference their specific completed habits, missed habits, mood scores, and reflections in your response. Keep responses to 2-3 sentences. Be genuinely funny.`,

  'drill-sergeant': `You are a no-nonsense military drill sergeant habit coach. You demand discipline, use direct commanding language, and don't accept excuses. But underneath the tough exterior, you genuinely care about the user's success. Reference their specific completed habits, missed habits, mood scores, and reflections in your response. Keep responses to 2-3 sentences. Use military-style language. Address the user as "RECRUIT".`,
};

export interface DaySummary {
  completedHabits: string[];
  missedHabits: string[];
  totalHabits: number;
  morning?: number;
  evening?: number;
  wentWell: string;
  toImprove: string;
}

function buildUserMessage(summary: DaySummary): string {
  const parts: string[] = [];

  parts.push(
    `Today I completed ${summary.completedHabits.length} out of ${summary.totalHabits} habits.`,
  );

  if (summary.completedHabits.length > 0) {
    parts.push(`Completed: ${summary.completedHabits.join(', ')}.`);
  }

  if (summary.missedHabits.length > 0) {
    parts.push(`Missed: ${summary.missedHabits.join(', ')}.`);
  }

  if (summary.morning) {
    parts.push(`Morning mood: ${summary.morning}/5.`);
  }
  if (summary.evening) {
    parts.push(`Evening mood: ${summary.evening}/5.`);
  }

  if (summary.wentWell) {
    parts.push(`What went well: ${summary.wentWell}`);
  }
  if (summary.toImprove) {
    parts.push(`What could improve: ${summary.toImprove}`);
  }

  return parts.join(' ');
}

export async function getCoachResponse(
  personality: CoachPersonality,
  summary: DaySummary,
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY not set');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[personality] },
        { role: 'user', content: buildUserMessage(summary) },
      ],
      max_tokens: 150,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from Groq');
  return text;
}
