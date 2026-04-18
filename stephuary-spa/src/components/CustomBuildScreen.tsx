import { customBuildPageCopy } from "../data/customBuildPageCopy";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onRequestAccess: () => void;
};

export function CustomBuildScreen({ animKey, onRequestAccess }: Props) {
  return (
    <ScreenShell animKey={animKey} className="eco-page eco-page--custom">
      <ScrollReveal className="eco-head-reveal">
        <h1 className="eco-page-headline">{customBuildPageCopy.headline}</h1>
        <p className="eco-page-sub">{customBuildPageCopy.sub}</p>
      </ScrollReveal>
      <ScrollReveal className="eco-cta-reveal">
        <div className="cta-row eco-page-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={onRequestAccess}>
            {customBuildPageCopy.cta}
          </button>
        </div>
      </ScrollReveal>
    </ScreenShell>
  );
}
