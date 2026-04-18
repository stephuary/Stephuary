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
  steps?: string[];
  matchedRuleId: string | null;
};

function pickBestRule(rules: ResultRule[], ctx: EvaluationContext): ResultRule | null {
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);
  for (const rule of sorted) {
    if (ruleMatches(rule.match, ctx)) return rule;
  }
  return null;
}

function buildNicheStructured(raw: string[]): Pick<
  SectionOutput,
  "insights" | "consequence" | "instruction"
> {
  const lines = raw.map((s) => (typeof s === "string" ? s.trim() : "")).filter((s) => s.length > 0);
  if (lines.length >= 4) {
    return {
      insights: [lines[0], lines[1]].filter(Boolean),
      consequence: lines[2],
      instruction: lines[3],
    };
  }
  if (lines.length === 3) {
    return { insights: [lines[0]], consequence: lines[1], instruction: lines[2] };
  }
  if (lines.length === 2) {
    return { insights: [lines[0]], consequence: "", instruction: lines[1] };
  }
  return { insights: lines[0] ? [lines[0]] : [], consequence: "", instruction: "" };
}

function buildStructured(
  id: SectionId,
  raw: string[],
): Pick<SectionOutput, "insights" | "consequence" | "instruction" | "steps"> {
  const lines = raw.map((s) => (typeof s === "string" ? s.trim() : "")).filter((s) => s.length > 0);

  if (id === "first") {
    return {
      insights: [lines[0], lines[1]].filter(Boolean),
      consequence: lines[2] ?? "",
      instruction: "",
      steps: lines.slice(3),
    };
  }

  return {
    insights: [lines[0], lines[1]].filter(Boolean),
    consequence: lines[2] ?? "",
    instruction: lines[3] ?? "",
  };
}

export function generateSectionOutputs(ctx: EvaluationContext): SectionOutput[] {
  return SECTION_IDS.map((id) => {
    const block = resultRules[id];
    const hit = pickBestRule(block.rules, ctx);
    const raw = hit ? hit.lines : block.defaults;
    const structured =
      id === "niche"
        ? buildNicheStructured(raw)
        : buildStructured(id, raw);
    return {
      id,
      title: block.title,
      ...structured,
      matchedRuleId: hit ? hit.id : null,
    };
  });
}
