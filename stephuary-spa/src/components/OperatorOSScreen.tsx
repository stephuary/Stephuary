import { operatorOSPageCopy } from "../data/operatorOSPageCopy";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onRequestAccess: () => void;
};

export function OperatorOSScreen({ animKey, onRequestAccess }: Props) {
  return (
    <ScreenShell animKey={animKey} className="operator-os-screen">
      <ScrollReveal className="operator-os-head-reveal">
        <h1 className="operator-os-headline">{operatorOSPageCopy.headline}</h1>
        <p className="operator-os-sub">{operatorOSPageCopy.sub}</p>
      </ScrollReveal>

      <ScrollReveal className="operator-os-block-reveal">
        <section className="operator-os-section">
          <h2 className="operator-os-section-title">{operatorOSPageCopy.whatTitle}</h2>
          <ul className="operator-os-list">
            {operatorOSPageCopy.whatBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal className="operator-os-block-reveal">
        <section className="operator-os-section">
          <h2 className="operator-os-section-title">{operatorOSPageCopy.whereTitle}</h2>
          <ul className="operator-os-list">
            {operatorOSPageCopy.whereBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal className="operator-os-block-reveal">
        <section className="operator-os-section operator-os-section--change">
          <h2 className="operator-os-section-title">{operatorOSPageCopy.changeTitle}</h2>
          <p className="operator-os-change-lead">{operatorOSPageCopy.changeLead}</p>
          <p className="operator-os-change-emphasis">{operatorOSPageCopy.changeEmphasis}</p>
        </section>
      </ScrollReveal>

      <ScrollReveal className="operator-os-cta-reveal">
        <div className="cta-row operator-os-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={onRequestAccess}>
            {operatorOSPageCopy.cta}
          </button>
        </div>
      </ScrollReveal>
    </ScreenShell>
  );
}
