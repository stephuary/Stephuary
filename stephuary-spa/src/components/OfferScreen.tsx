import { useState } from "react";
import {
  highTicketSectionLabels,
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

function renderWhatChanges(tier: (typeof offerInstallTiers)[number]) {
  if ("whatChangesParagraphs" in tier && tier.whatChangesParagraphs?.length) {
    return (
      <div className="tier-change-paragraphs">
        {tier.whatChangesParagraphs.map((p) => (
          <p key={p} className="tier-outcome tier-outcome--para">
            {p}
          </p>
        ))}
      </div>
    );
  }
  if ("whatChanges" in tier && tier.whatChanges) {
    return <p className="tier-outcome">{tier.whatChanges}</p>;
  }
  return null;
}

export function OfferScreen({
  animKey,
  recommendedTier,
  signalCta,
  onPaidIntake,
  onRequestCustomBuild,
}: Props) {
  const [expandedId, setExpandedId] = useState<OfferTierId | null>(null);

  function handleTier(id: OfferTierId) {
    signalCta();
    if (id === "breakdown") {
      onRequestCustomBuild();
    } else {
      onPaidIntake();
    }
  }

  function toggleTier(id: OfferTierId) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const L = offerSectionLabels;
  const HT = highTicketSectionLabels;

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
            const isHigh = tier.id === "breakdown";
            const isOpen = expandedId === tier.id;
            const panelId = `offer-panel-${tier.id}`;

            return (
              <ScrollReveal key={tier.id} className="install-tier-reveal">
                <article
                  className={`install-card install-card--accordion screen-copy-panel ${rec ? "install-card--recommended" : ""} ${isOpen ? "install-card--open" : ""}`.trim()}
                >
                  {rec ? <span className="install-rec-pill">Matches your answers</span> : null}

                  <button
                    type="button"
                    className="install-card-toggle"
                    id={`offer-toggle-${tier.id}`}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleTier(tier.id)}
                  >
                    <span className="install-card-chevron" aria-hidden />
                    <span className="install-card-toggle-main">
                      {"headlineLead" in tier && tier.headlineLead ? (
                        <p className="install-card-eyebrow install-card-eyebrow--toggle">{tier.headlineLead}</p>
                      ) : null}
                      <span className="install-card-title install-card-title--headline">{tier.headline}</span>
                      <span className="install-card-collapsed-outcome">{tier.collapsedOutcome}</span>
                      <span className="install-card-price install-card-price--toggle">{tier.price}</span>
                    </span>
                  </button>

                  <div className="install-card-cta">
                    <button
                      type="button"
                      className={`btn btn-block ${rec ? "btn-primary" : "btn-secondary"}`.trim()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTier(tier.id);
                      }}
                    >
                      {tier.cta}
                    </button>
                  </div>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={`offer-toggle-${tier.id}`}
                    className="install-card-expand"
                    data-open={isOpen}
                  >
                    <div className="install-card-expand-inner">
                      {"pickOneOptions" in tier && tier.pickOneOptions?.length ? (
                        <>
                          <p className="tier-section-label tier-section-label--pick">
                            {"pickOneIntro" in tier && tier.pickOneIntro ? tier.pickOneIntro : "Choose one:"}
                          </p>
                          <ul className="tier-bullet-list tier-bullet-list--pick">
                            {tier.pickOneOptions.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}

                      {isHigh && "whatIDo" in tier && tier.whatIDo ? (
                        <>
                          <p className="tier-section-label tier-section-label--nested">{HT.whatIDo}</p>
                          <ul className="tier-bullet-list">
                            {tier.whatIDo.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}

                      <p className="tier-section-label">{isHigh ? HT.whatYouGet : L.whatYouGet}</p>
                      <ul className="tier-bullet-list">
                        {tier.whatYouGet.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>

                      <p className="tier-section-label">{isHigh ? HT.whatChanges : L.whatChanges}</p>
                      {renderWhatChanges(tier)}

                      {"whatYouDontGet" in tier && tier.whatYouDontGet?.length ? (
                        <>
                          <p className="tier-section-label">{L.whatYouDontGet}</p>
                          <ul className="tier-bullet-list tier-bullet-list--dont">
                            {tier.whatYouDontGet.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}

                      <p className="tier-section-label">{isHigh ? HT.timeline : L.time}</p>
                      <p className="tier-time">{tier.time}</p>

                      {isHigh && "whoFor" in tier && tier.whoFor ? (
                        <>
                          <p className="tier-section-label tier-section-label--nested">{HT.whoFor}</p>
                          <ul className="tier-bullet-list tier-bullet-list--who">
                            {tier.whoFor.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}

                      {isHigh && "afterApply" in tier && tier.afterApply ? (
                        <div className="tier-after-apply">
                          <p className="tier-section-label tier-section-label--nested">{HT.afterApply}</p>
                          <ol className="tier-after-apply-list">
                            <li>
                              <strong>{HT.reviewStep}.</strong> {tier.afterApply.review}
                            </li>
                            <li>
                              <strong>{HT.decisionStep}.</strong> {tier.afterApply.decision}
                            </li>
                            <li>
                              <strong>{HT.nextStep}.</strong> {tier.afterApply.nextAction}
                            </li>
                          </ol>
                        </div>
                      ) : null}
                    </div>
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
