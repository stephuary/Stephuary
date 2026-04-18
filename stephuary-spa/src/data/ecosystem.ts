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
    descriptor: "Advisory when revenue and ops are on the line.",
    action: "install_intake",
    cta: "→ Install intake",
  },
  {
    id: "club",
    title: ".5% Club",
    descriptor: "Private matching when the public ladder isn’t the shape.",
    action: "install_intake",
    cta: "→ Install intake",
  },
  {
    id: "grownSpaghetti",
    title: "Grown Spaghetti",
    descriptor: "Essays on systems, work, and building without noise.",
    action: "read_substack",
    cta: "Read Substack",
  },
  {
    id: "customBuild",
    title: "Custom Build",
    descriptor: "Installed on your business, not templated.",
    action: "install_intake",
    cta: "→ Install intake",
  },
];

export const SUBSTACK_PLACEHOLDER_HREF = "https://substack.com";
