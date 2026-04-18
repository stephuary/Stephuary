import {
  offerInstallTiers,
  offerSectionLabels,
  offerTransitionCopy,
  type OfferTierId,
} from "../data/siteCopy";
import type { RecommendedTier } from "../lib/recommendedTier";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  recommendedTier: RecommendedTier;
  signalCta: () => void;
  onPaidIntake: () => void;
  onRequestCustomBuild: () => void;
};

function tierMatchesRecommended(id: OfferTierId, r: RecommendedTier): boolean {
  if (r === "entry" && id === "path") return true;
  if (r === "focused" && id === "fix") return true;
  if (r === "full" && id === "breakdown") return true;
  return false;
}

export function OfferScreen({
  animKey,
  recommendedTier,
  signalCta,
  onPaidIntake,
  onRequestCustomBuild,
}: Props) {
  function handleTier(id: OfferTierId) {
    signalCta();
    if (id === "breakdown") {
      onRequestCustomBuild();
    } else {
      onPaidIntake();
    }
  }

  const L = offerSectionLabels;

  return (
    <ScreenShell animKey={animKey} className="offer-screen">
      <div className="offer-inner offer-inner--install">
        <ScrollReveal className="offer-transition-reveal">
          <header className="offer-transition screen-copy-panel">
            <h2 className="offer-transition-headline">{offerTransitionCopy.headline}</h2>
            <p className="offer-transition-sub">{offerTransitionCopy.subtext}</p>
          </header>
        </ScrollReveal>

        <div className="install-tier-stack">
          {offerInstallTiers.map((tier) => {
            const rec = tierMatchesRecommended(tier.id, recommendedTier);
            return (
              <ScrollReveal key={tier.id} className="install-tier-reveal">
                <article
                  className={`install-card screen-copy-panel ${rec ? "install-card--recommended" : ""}`.trim()}
                >
                  {rec ? <span className="install-rec-pill">Matches your answers</span> : null}
                  <h3 className="install-card-title install-card-title--headline">{tier.headline}</h3>

                  <p className="tier-section-label">{L.whatYouGet}</p>
                  <ul className="tier-bullet-list">
                    {tier.whatYouGet.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <p className="tier-section-label">{L.whatChanges}</p>
                  <p className="tier-outcome">{tier.whatChanges}</p>

                  <p className="tier-section-label">{L.time}</p>
                  <p className="tier-time">{tier.time}</p>

                  <p className="install-card-price">{tier.price}</p>
                  <div className="cta-row install-card-cta">
                    <button
                      type="button"
                      className={`btn btn-block ${rec ? "btn-primary" : "btn-secondary"}`.trim()}
                      onClick={() => handleTier(tier.id)}
                    >
                      {tier.cta}
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
