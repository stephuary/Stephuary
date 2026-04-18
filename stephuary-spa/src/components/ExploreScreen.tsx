import { exploreCopy } from "../data/siteCopy";
import { EcosystemCards } from "./EcosystemCards";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onRequestAccess: () => void;
  onReadSubstack: () => void;
  onHome: () => void;
};

export function ExploreScreen({
  animKey,
  onRequestAccess,
  onReadSubstack,
  onHome,
}: Props) {
  return (
    <ScreenShell animKey={animKey} className="explore-screen">
      <div className="explore-inner">
        <button type="button" className="explore-home-link" onClick={onHome}>
          Home
        </button>
        <ScrollReveal className="explore-title-reveal">
          <h2 className="explore-title">{exploreCopy.title}</h2>
        </ScrollReveal>
        <EcosystemCards onRequestAccess={onRequestAccess} onReadSubstack={onReadSubstack} />
      </div>
    </ScreenShell>
  );
}
