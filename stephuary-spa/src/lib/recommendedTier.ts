import type { EvaluationContext } from "./scoring";

/** Maps diagnostic signals to the offer tier to emphasize in the UI. */
export type RecommendedTier = "entry" | "focused" | "full";

/**
 * entry → $34: scattered focus / no clear packaged offer
 * focused → $197: one dominant issue is identifiable
 * full → $750: multiple breakdowns / unclear direction
 */
export function resolveRecommendedTier(ctx: EvaluationContext): RecommendedTier {
  const { tags, scores } = ctx;
  const has = (t: string) => tags.includes(t);

  // Full: tangled picture — low scores and/or multiple competing structural issues
  if (
    (scores.clarity <= 44 && scores.focus <= 44) ||
    (has("audience:split") && (has("offer:stacked") || has("work:split"))) ||
    (has("plan:vague") && has("niche:wide")) ||
    (has("mode:split") && scores.focus <= 48) ||
    (has("pitch:list") && has("niche:draft") && scores.clarity <= 46)
  ) {
    return "full";
  }

  // Focused: enough clarity to name the problem — execution, price, or scope is the bottleneck
  if (
    scores.clarity >= 47 &&
    (has("ship:delayed") ||
      has("think:price_avoid") ||
      has("offer:price_wrong") ||
      has("slow:panic_yes") ||
      has("skill:labor")) &&
    !has("audience:split")
  ) {
    return "focused";
  }

  return "entry";
}
