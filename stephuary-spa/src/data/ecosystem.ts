/** Shared ecosystem routes — cards + nav (not diagnostic output). */

export type EcosystemRouteId =
  | "osc"
  | "club"
  | "grownSpaghetti"
  | "customBuild";

export type EcosystemCard = {
  id: EcosystemRouteId;
  title: string;
  descriptor: string;
  cta: "Request Access" | "Read Substack";
};

export const ecosystemCards: EcosystemCard[] = [
  {
    id: "osc",
    title: "Only Sometimes Club",
    descriptor: "Advisory access when the work is business-critical.",
    cta: "Request Access",
  },
  {
    id: "club",
    title: ".5% Club",
    descriptor: "Private matching when a public path is not the right shape.",
    cta: "Request Access",
  },
  {
    id: "grownSpaghetti",
    title: "Grown Spaghetti",
    descriptor: "Essays and ongoing thinking on work, systems, and building differently.",
    cta: "Read Substack",
  },
  {
    id: "customBuild",
    title: "Custom Build",
    descriptor: "When this needs to be applied to your business, not templated.",
    cta: "Request Access",
  },
];

export const SUBSTACK_PLACEHOLDER_HREF = "https://substack.com";
