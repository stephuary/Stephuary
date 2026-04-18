import type { EvaluationContext } from "./scoring";

/**
 * Surfaces optional high-ticket access (custom build / OSC) when answers suggest
 * experience, operator context, multiple paths, or structural complexity.
 */
export function shouldShowHighTicketAccess(ctx: EvaluationContext): boolean {
  const { tags, scores } = ctx;
  const has = (t: string) => tags.includes(t);

  let signals = 0;

  if (has("tenure:senior")) signals += 1;
  if (has("buyer:metric") || has("mode:sales_ops")) signals += 1;
  if (has("audience:split") || has("offer:stacked") || has("work:split")) signals += 1;
  if (has("plan:vague") && has("niche:wide")) signals += 1;
  if (scores.clarity <= 46 && scores.focus <= 46) signals += 1;
  if (has("pitch:list") && (has("skill:advice") || has("niche:draft"))) signals += 1;

  return signals >= 2;
}
