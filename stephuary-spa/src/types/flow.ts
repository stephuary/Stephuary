export type FlowStep =
  | { id: "home" }
  | { id: "osc" }
  | { id: "club" }
  | { id: "grownSpaghetti" }
  | { id: "customBuild" }
  | { id: "accessRequest"; intent?: "os" }
  | { id: "operatorOS" }
  | { id: "explore" }
  | { id: "quiz"; index: number }
  | { id: "results" }
  | { id: "offer" };

export type AnswersMap = Record<string, string>;
