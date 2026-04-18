export type FlowStep =
  | { id: "entry" }
  | { id: "quiz"; index: number }
  | { id: "results" }
  | { id: "offer" };

export type AnswersMap = Record<string, string>;
