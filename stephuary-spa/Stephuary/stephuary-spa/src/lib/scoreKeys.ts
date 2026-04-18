export const SCORE_KEYS = [
  "clarity",
  "focus",
  "demand",
  "monetization",
  "leverage",
] as const;

export type ScoreKey = (typeof SCORE_KEYS)[number];

export type ScoreProfile = Record<ScoreKey, number>;

export function emptyScores(): ScoreProfile {
  return {
    clarity: 0,
    focus: 0,
    demand: 0,
    monetization: 0,
    leverage: 0,
  };
}

export function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}
