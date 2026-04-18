import { ALL_QUESTIONS, findOption } from "../data/questions";
import type { AnswersMap } from "../types/flow";
import { clampScore, emptyScores, type ScoreProfile } from "./scoreKeys";

export type EvaluationContext = {
  tags: string[];
  scores: ScoreProfile;
};

function uniqueTags(tags: string[]): string[] {
  return [...new Set(tags)];
}

/**
 * Aggregates tags and score deltas from answered questions.
 * Scores start at 50 per dimension, then deltas are applied and clamped 0–100.
 */
export function buildEvaluationContext(answers: AnswersMap): EvaluationContext {
  const tags: string[] = [];
  const scores = emptyScores();

  for (const q of ALL_QUESTIONS) {
    const optionId = answers[q.id];
    if (!optionId) continue;

    const opt = findOption(q, optionId);
    if (!opt) continue;

    tags.push(...opt.tags);
    for (const [k, delta] of Object.entries(opt.scoreDelta)) {
      const key = k as keyof ScoreProfile;
      if (typeof delta === "number") scores[key] += delta;
    }
  }

  for (const k of Object.keys(scores) as (keyof ScoreProfile)[]) {
    scores[k] = clampScore(50 + (scores[k] as number));
  }

  return {
    tags: uniqueTags(tags),
    scores,
  };
}
