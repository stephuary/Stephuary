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
    descriptor:
      "For businesses that need sharper positioning, better conversion, and a stronger customer experience.",
    cta: "Request Access",
  },
  {
    id: "club",
    title: ".5% Club",
    descriptor:
      "Private access for people already building who need the right connection, not more options.",
    cta: "Request Access",
  },
  {
    id: "grownSpaghetti",
    title: "Grown Spaghetti",
    descriptor:
      "Essays, ideas, and ongoing thinking on work, systems, culture, and building differently.",
    cta: "Read Substack",
  },
  {
    id: "customBuild",
    title: "Custom Build",
    descriptor:
      "For people who need this built around their business, thinking, and workflow.",
    cta: "Request Access",
  },
];

export const SUBSTACK_PLACEHOLDER_HREF = "https://substack.com";
