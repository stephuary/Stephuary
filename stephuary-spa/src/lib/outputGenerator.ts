import {
  type ResultRule,
  resultRules,
  SECTION_IDS,
  type SectionId,
} from "../data/resultRules";
import { ruleMatches } from "./matchRules";
import type { EvaluationContext } from "./scoring";

export type SectionOutput = {
  id: SectionId;
  title: string;
  insights: string[];
  consequence: string;
  instruction: string;
  matchedRuleId: string | null;
};

function pickBestRule(rules: ResultRule[], ctx: EvaluationContext): ResultRule | null {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);
  for (const rule of sorted) {
    if (ruleMatches(rule.match, ctx)) return rule;
  }
  return null;
}

/** Each block is up to 3 observation lines (pattern recognition, not advice). */
function buildThreeLines(raw: string[]): Pick<
  SectionOutput,
  "insights" | "consequence" | "instruction"
> {
  const lines = raw.map((s) => (typeof s === "string" ? s.trim() : "")).filter((s) => s.length > 0);
  const obs = lines.slice(0, 3);
  return {
    insights: obs,
    consequence: "",
    instruction: "",
  };
}

export function generateSectionOutputs(ctx: EvaluationContext): SectionOutput[] {
  return SECTION_IDS.map((id) => {
    const block = resultRules[id];
    const hit = pickBestRule(block.rules, ctx);
    const raw = hit ? hit.lines : block.defaults;
    return {
      id,
      title: block.title,
      ...buildThreeLines(raw),
      matchedRuleId: hit ? hit.id : null,
    };
  });
}
