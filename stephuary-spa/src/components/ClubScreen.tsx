import { clubPageCopy } from "../data/clubPageCopy";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onRequestAccess: () => void;
};

export function ClubScreen({ animKey, onRequestAccess }: Props) {
  return (
    <ScreenShell animKey={animKey} className="eco-page eco-page--club">
      <ScrollReveal className="eco-head-reveal">
        <h1 className="eco-page-headline">{clubPageCopy.headline}</h1>
        <p className="eco-page-sub">{clubPageCopy.sub}</p>
      </ScrollReveal>

      <ScrollReveal className="eco-block-reveal">
        <section className="eco-section">
          <h2 className="eco-section-title">{clubPageCopy.whoTitle}</h2>
          <p className="eco-section-line">{clubPageCopy.whoLine}</p>
          <ul className="eco-section-list">
            {clubPageCopy.whoBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal className="eco-block-reveal">
        <section className="eco-section">
          <h2 className="eco-section-title">{clubPageCopy.whatTitle}</h2>
          <p className="eco-section-line">{clubPageCopy.whatLine}</p>
          <ul className="eco-section-list">
            {clubPageCopy.whatBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal className="eco-filter-reveal">
        <p className="eco-filter-line">{clubPageCopy.filterLine}</p>
        <p className="eco-access-line">{clubPageCopy.accessLine}</p>
      </ScrollReveal>

      <ScrollReveal className="eco-cta-reveal">
        <div className="cta-row eco-page-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={onRequestAccess}>
            {clubPageCopy.cta}
          </button>
        </div>
      </ScrollReveal>
    </ScreenShell>
  );
}
