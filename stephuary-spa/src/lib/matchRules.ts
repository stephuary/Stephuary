import type { RuleMatch } from "../data/resultRules";
import type { EvaluationContext } from "./scoring";
import type { ScoreKey } from "./scoreKeys";

function hasTag(tagSet: Set<string>, tag: string): boolean {
  return tagSet.has(tag);
}

export function ruleMatches(
  match: RuleMatch,
  ctx: EvaluationContext,
): boolean {
  const tagSet = new Set(ctx.tags);

  if (match.allTags) {
    for (const t of match.allTags) {
      if (!hasTag(tagSet, t)) return false;
    }
  }

  if (match.anyTags && match.anyTags.length > 0) {
    if (!match.anyTags.some((t) => hasTag(tagSet, t))) return false;
  }

  if (match.minTagHits) {
    const hits = match.minTagHits.tags.filter((t) => hasTag(tagSet, t)).length;
    if (hits < match.minTagHits.count) return false;
  }

  if (match.minScore) {
    for (const [k, v] of Object.entries(match.minScore)) {
      const key = k as ScoreKey;
      if (ctx.scores[key] < v) return false;
    }
  }

  if (match.maxScore) {
    for (const [k, v] of Object.entries(match.maxScore)) {
      const key = k as ScoreKey;
      if (ctx.scores[key] > v) return false;
    }
  }

  return true;
}
