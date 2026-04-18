import { offerInstallTiers, offerTransitionCopy, type OfferTierId } from "../data/siteCopy";
import type { RecommendedTier } from "../lib/recommendedTier";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  recommendedTier: RecommendedTier;
  signalCta: () => void;
  onInstallIntake: () => void;
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
  onInstallIntake,
  onRequestCustomBuild,
}: Props) {
  function handleTier(id: OfferTierId) {
    signalCta();
    if (id === "breakdown") {
      onRequestCustomBuild();
    } else {
      onInstallIntake();
    }
  }

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
                  {rec ? <span className="install-rec-pill">Fits diagnostic</span> : null}
                  <h3 className="install-card-title">{tier.title}</h3>
                  <div className="install-card-body">
                    {tier.bodyLines.map((line, i) =>
                      line === "" ? (
                        <div key={`g-${tier.id}-${i}`} className="install-body-gap" aria-hidden />
                      ) : (
                        <p key={`l-${tier.id}-${i}`} className="install-body-line">
                          {line}
                        </p>
                      ),
                    )}
                  </div>
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
