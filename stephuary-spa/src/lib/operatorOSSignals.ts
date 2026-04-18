import type { EvaluationContext } from "./scoring";

/**
 * Surfaces the Operator OS gate when answers suggest senior experience,
 * operational context, ownership, and multi-layer complexity.
 */
export function shouldShowOperatorOSGate(ctx: EvaluationContext): boolean {
  const { tags, scores } = ctx;
  const has = (t: string) => tags.includes(t);

  let signals = 0;

  if (has("tenure:senior")) signals += 1;
  if (has("buyer:metric") || has("mode:sales_ops")) signals += 1;
  if (has("audience:split") || has("offer:stacked") || has("work:split")) signals += 1;
  if (has("brand:unified") || has("ops:buffer")) signals += 1;
  if (has("skill:advice") && has("delivery:you")) signals += 1;
  if (scores.clarity >= 52 && scores.leverage >= 54) signals += 1;

  return signals >= 3;
}
