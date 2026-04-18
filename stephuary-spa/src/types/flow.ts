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
  /** Full-screen pause after Q5 (index 4), before Q6. */
  | { id: "realizationMoment" }
  | { id: "results" }
  | { id: "offer" };

export type AnswersMap = Record<string, string>;
