import { oscPageCopy } from "../data/oscPageCopy";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onRequestAccess: () => void;
};

export function OscScreen({ animKey, onRequestAccess }: Props) {
  return (
    <ScreenShell animKey={animKey} className="eco-page eco-page--osc">
      <ScrollReveal className="eco-head-reveal">
        <h1 className="eco-page-headline">{oscPageCopy.headline}</h1>
        <p className="eco-page-sub">{oscPageCopy.sub}</p>
      </ScrollReveal>
      <ScrollReveal className="eco-cta-reveal">
        <div className="cta-row eco-page-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={onRequestAccess}>
            {oscPageCopy.cta}
          </button>
        </div>
      </ScrollReveal>
    </ScreenShell>
  );
}
