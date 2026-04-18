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
  lines: string[];
  matchedRuleId: string | null;
};

function pickBestRule(rules: ResultRule[], ctx: EvaluationContext): ResultRule | null {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);
  for (const rule of sorted) {
    if (ruleMatches(rule.match, ctx)) return rule;
  }
  return null;
}

function normalizeLines(id: SectionId, lines: string[]): string[] {
  if (id === "niche") return lines[0] ? [lines[0]] : [];
  if (id === "first") return lines.slice(0, 3);
  if (id === "money") return lines.slice(0, 5);
  return lines;
}

export function generateSectionOutputs(
  ctx: EvaluationContext,
): SectionOutput[] {
  return SECTION_IDS.map((id) => {
    const block = resultRules[id];
    const hit = pickBestRule(block.rules, ctx);
    const raw = hit ? hit.lines : block.defaults;
    return {
      id,
      title: block.title,
      lines: normalizeLines(id, raw),
      matchedRuleId: hit ? hit.id : null,
    };
  });
}
