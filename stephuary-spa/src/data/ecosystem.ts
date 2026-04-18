/** Shared ecosystem routes — cards + nav (not diagnostic output). */

export type EcosystemRouteId =
  | "osc"
  | "club"
  | "grownSpaghetti"
  | "customBuild";

export type EcosystemCardAction = "install_intake" | "read_substack";

export type EcosystemCard = {
  id: EcosystemRouteId;
  title: string;
  descriptor: string;
  action: EcosystemCardAction;
  cta: string;
};

export const ecosystemCards: EcosystemCard[] = [
  {
    id: "osc",
    title: "Only Sometimes Club",
    descriptor: "Advisory when money and ops are on the line.",
    action: "install_intake",
    cta: "Request access",
  },
  {
    id: "club",
    title: ".5% Club",
    descriptor: "Private matching when you need a named intro, not a funnel.",
    action: "install_intake",
    cta: "Request access",
  },
  {
    id: "grownSpaghetti",
    title: "Grown Spaghetti",
    descriptor: "Essays on work, money, and how people actually operate.",
    action: "read_substack",
    cta: "Read Substack",
  },
  {
    id: "customBuild",
    title: "Custom Build",
    descriptor: "I rebuild how your expertise makes you revenue.",
    action: "install_intake",
    cta: "Request access",
  },
];

export const SUBSTACK_PLACEHOLDER_HREF = "https://substack.com";
