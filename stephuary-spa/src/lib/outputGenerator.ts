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

/** Each block is exactly 3 lines: statement → consequence → action. */
function buildThreeLines(raw: string[]): Pick<
  SectionOutput,
  "insights" | "consequence" | "instruction"
> {
  const lines = raw.map((s) => (typeof s === "string" ? s.trim() : "")).filter((s) => s.length > 0);
  return {
    insights: lines[0] ? [lines[0]] : [],
    consequence: lines[1] ?? "",
    instruction: lines[2] ?? "",
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
