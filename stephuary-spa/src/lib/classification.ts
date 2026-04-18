import type { EvaluationContext } from "./scoring";

export type ClassificationId = "split_focus" | "throughput" | "offer_misalignment";

const LABELS: Record<ClassificationId, string> = {
  split_focus: "Too many priorities",
  throughput: "Work backed up",
  offer_misalignment: "Offer and buyer don't match",
};

function weightSplit(ctx: EvaluationContext): number {
  const { tags, scores } = ctx;
  const h = (t: string) => tags.includes(t);
  let w = 0;
  if (scores.focus < 46) w += 2;
  if (scores.clarity < 46 && (h("pitch:list") || h("niche:wide") || h("position:internal"))) w += 2;
  if (
    h("audience:split") ||
    h("mode:split") ||
    h("work:split") ||
    h("focus:divided") ||
    h("focus:fragmented") ||
    h("pivot:often")
  )
    w += 3;
  if (h("plan:vague")) w += 1;
  return w;
}

function weightThroughput(ctx: EvaluationContext): number {
  const { tags, scores } = ctx;
  const h = (t: string) => tags.includes(t);
  let w = 0;
  if (scores.leverage < 46) w += 2;
  if (h("ship:delayed") || h("time:comms_heavy") || h("skill:labor") || h("ops:heavy")) w += 3;
  if (h("time:meetings_packed") || h("time:chaos") || h("slow:consume")) w += 2;
  if (h("work:delivery") && h("demand:proven")) w += 1;
  return w;
}

function weightOffer(ctx: EvaluationContext): number {
  const { tags, scores } = ctx;
  const h = (t: string) => tags.includes(t);
  let w = 0;
  if (scores.monetization < 46 || scores.clarity < 44) w += 2;
  if (h("offer:stacked") || h("offer:price_wrong") || h("offer:mismatch") || h("offer:launch_weak")) w += 2;
  if (h("pitch:list") || h("think:price_avoid") || h("niche:draft")) w += 2;
  if (h("position:internal")) w += 1;
  return w;
}

/** Returns 1–3 labels, strongest first, from diagnostic signals. */
export function resolveClassificationLabels(ctx: EvaluationContext): string[] {
  const w: Record<ClassificationId, number> = {
    split_focus: weightSplit(ctx),
    throughput: weightThroughput(ctx),
    offer_misalignment: weightOffer(ctx),
  };
  const ids = (Object.keys(w) as ClassificationId[]).sort((a, b) => w[b] - w[a]);
  const positive = ids.filter((id) => w[id] > 0);
  const ordered = positive.length > 0 ? positive : [ids[0]];
  return ordered.slice(0, 3).map((id) => LABELS[id]);
}
