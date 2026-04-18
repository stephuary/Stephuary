import { useId, useState } from "react";
import { offerCopy, offerFrictionCopy, type OfferTierId } from "../data/siteCopy";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onComplete: (tierId: OfferTierId) => void;
};

export function OfferScreen({ animKey, onComplete }: Props) {
  const [showSecondary, setShowSecondary] = useState(false);
  const secondaryRegionId = useId();

  return (
    <ScreenShell animKey={animKey} className="offer-screen">
      <div className="offer-inner">
        <ScrollReveal className="offer-intro-reveal">
          <header className="offer-intro">
            <h2 className="offer-intro-headline">{offerCopy.intro.headline}</h2>
            <p className="offer-intro-bridge">{offerCopy.intro.bridge}</p>
            <p className="offer-intro-sub">{offerCopy.intro.sub}</p>
          </header>
        </ScrollReveal>

        <ScrollReveal className="offer-primary-reveal">
          <div className="offer-primary-wrap">
            <div className="offer-card offer-card--primary offer-card--primary-dominant">
              <span className="offer-card-price">{offerCopy.primary.price}</span>
              <span className="offer-card-title">{offerCopy.primary.title}</span>
              <p className="offer-card-line">{offerCopy.primary.line}</p>
              <p className="offer-card-urgency">{offerCopy.primary.urgency}</p>
              <ul className="offer-card-bullets offer-card-bullets--primary">
                {offerCopy.primary.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="offer-friction">{offerFrictionCopy}</p>
              <button
                type="button"
                className="btn btn-primary btn-block offer-primary-btn"
                onClick={() => onComplete(offerCopy.primary.id)}
              >
                {offerCopy.primary.cta}
              </button>
            </div>

            <button
              type="button"
              className="offer-see-full"
              aria-expanded={showSecondary}
              aria-controls={secondaryRegionId}
              onClick={() => setShowSecondary((v) => !v)}
            >
              {offerCopy.seeFullOptions}
            </button>
          </div>
        </ScrollReveal>

        <div
          id={secondaryRegionId}
          className={`offer-secondary ${showSecondary ? "offer-secondary--visible" : ""}`}
          role="region"
          aria-label="Additional paid options"
          aria-hidden={!showSecondary}
        >
          {offerCopy.secondary.map((tier) => (
            <ScrollReveal key={tier.id} className="offer-tier-reveal">
              <div className="offer-card offer-card--secondary">
                <span className="offer-card-price offer-card-price--sm">
                  {tier.price}
                </span>
                <span className="offer-card-title offer-card-title--sm">
                  {tier.title}
                </span>
                {"trustLine" in tier && tier.trustLine ? (
                  <p className="offer-card-trust">{tier.trustLine}</p>
                ) : null}
                {"opening" in tier && tier.opening ? (
                  <p className="offer-card-opening">{tier.opening}</p>
                ) : null}
                {"line" in tier && tier.line ? (
                  <p className="offer-card-line offer-card-line--sm">{tier.line}</p>
                ) : null}
                {"bullets" in tier && tier.bullets ? (
                  <ul className="offer-card-bullets">
                    {tier.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  onClick={() => onComplete(tier.id)}
                >
                  {tier.cta}
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
