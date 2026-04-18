import { useEffect, useRef, useState } from "react";
import {
  highTicketGateCopy,
  offerCopy,
  offerHighTicketShadow,
  offerPostFixUpsell,
  offerPostPathUpsell,
  offerPostPricingAccess,
  offerScrollNudge,
  offerScopeInlineCopy,
  offerScopePrimaryLabel,
  offerSeeDetailsCta,
  offerTierLead,
  operatorOSGateCopy,
  resultsScaleCopy,
  type OfferTierId,
} from "../data/siteCopy";
import type { RecommendedTier } from "../lib/recommendedTier";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  recommendedTier: RecommendedTier;
  showOperatorOSGate: boolean;
  showHighTicketAccess: boolean;
  signalCta: () => void;
  onRequestOperatorOS: () => void;
  onRequestCustomBuild: () => void;
  onRequestOsc: () => void;
  onPostOfferAccess: () => void;
  onComplete: (tierId: OfferTierId) => void;
};

function tierMatchesOffer(tier: RecommendedTier, offer: "path" | "fix" | "breakdown"): boolean {
  if (tier === "entry" && offer === "path") return true;
  if (tier === "focused" && offer === "fix") return true;
  if (tier === "full" && offer === "breakdown") return true;
  return false;
}

function OfferScopeInline({
  pendingTier,
  primaryLabel,
  onKeepFocused,
  onLookAcross,
  onFixOne,
}: {
  pendingTier: OfferTierId;
  primaryLabel: string;
  onKeepFocused: () => void;
  onLookAcross: () => void;
  onFixOne: () => void;
}) {
  const showFixOne = pendingTier === "path";
  const showLookAcross = pendingTier !== "breakdown";

  return (
    <div className="offer-scope-inline" role="group" aria-label="Choose how to proceed">
      <h3 className="offer-scope-inline-title">{offerScopeInlineCopy.header}</h3>
      <div className="offer-scope-inline-actions">
        <button type="button" className="btn btn-primary btn-block" onClick={onKeepFocused}>
          {primaryLabel}
        </button>
        {showLookAcross ? (
          <button type="button" className="btn btn-secondary btn-block" onClick={onLookAcross}>
            {offerScopeInlineCopy.lookAcross}
          </button>
        ) : null}
        {showFixOne ? (
          <button type="button" className="btn btn-secondary btn-block" onClick={onFixOne}>
            {offerScopeInlineCopy.fixOne}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function OfferScreen({
  animKey,
  recommendedTier,
  showOperatorOSGate,
  showHighTicketAccess,
  signalCta,
  onRequestOperatorOS,
  onRequestCustomBuild,
  onRequestOsc,
  onPostOfferAccess,
  onComplete,
}: Props) {
  const [expandedTier, setExpandedTier] = useState<OfferTierId | null>(null);
  const [postUpsell, setPostUpsell] = useState<null | "path" | "fix">(null);
  const [hasClickedOffer, setHasClickedOffer] = useState(false);
  const [scrollNudgeVisible, setScrollNudgeVisible] = useState(false);

  const pathRef = useRef<HTMLDivElement>(null);
  const fixRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const scrollSentinelRef = useRef<HTMLDivElement>(null);

  const recPath = tierMatchesOffer(recommendedTier, "path");
  const recFix = tierMatchesOffer(recommendedTier, "fix");
  const recFull = tierMatchesOffer(recommendedTier, "breakdown");

  const showScrollNudgeHighlight = scrollNudgeVisible && !hasClickedOffer;

  useEffect(() => {
    const target =
      recommendedTier === "entry"
        ? pathRef.current
        : recommendedTier === "focused"
          ? fixRef.current
          : fullRef.current;
    if (!target) return;
    const t = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
    return () => window.clearTimeout(t);
  }, [recommendedTier]);

  useEffect(() => {
    const el = scrollSentinelRef.current;
    if (!el || hasClickedOffer) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setScrollNudgeVisible(true);
      },
      { root: null, rootMargin: "0px 0px -40px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasClickedOffer]);

  const tierLead = offerTierLead[recommendedTier];

  function expandTier(tierId: OfferTierId) {
    signalCta();
    setExpandedTier(tierId);
    setHasClickedOffer(true);
  }

  function handleKeepFocused() {
    signalCta();
    if (!expandedTier) return;
    if (expandedTier === "breakdown") {
      onComplete("breakdown");
      setExpandedTier(null);
      return;
    }
    if (expandedTier === "fix") {
      setPostUpsell("fix");
      setExpandedTier(null);
      return;
    }
    if (expandedTier === "path") {
      setPostUpsell("path");
      setExpandedTier(null);
    }
  }

  function handleLookAcross() {
    signalCta();
    setExpandedTier(null);
    onComplete("breakdown");
  }

  function handleFixOne() {
    signalCta();
    setExpandedTier(null);
    onComplete("fix");
  }

  const nudgeCls = showScrollNudgeHighlight ? " offer-card--scroll-nudge" : "";

  const offerTiers = [offerCopy.primary, ...offerCopy.secondary] as const;

  function tierCardRef(id: OfferTierId) {
    if (id === "path") return pathRef;
    if (id === "fix") return fixRef;
    return fullRef;
  }

  function tierRecommended(id: OfferTierId) {
    if (id === "path") return recPath;
    if (id === "fix") return recFix;
    return recFull;
  }

  return (
    <ScreenShell animKey={animKey} className="offer-screen">
      <div className="offer-inner">
        <ScrollReveal className="offer-intro-reveal">
          <header className="offer-intro">
            <h2 className="offer-intro-headline">{offerCopy.intro.headline}</h2>
            <p className="offer-intro-bridge">{offerCopy.intro.bridge}</p>
            <p className="offer-intro-sub offer-intro-sub--dynamic">{tierLead}</p>
          </header>
        </ScrollReveal>

        {showOperatorOSGate || showHighTicketAccess ? (
          <ScrollReveal className="offer-scale-hint-reveal">
            <p className="offer-scale-hint" role="note">
              {resultsScaleCopy}
            </p>
          </ScrollReveal>
        ) : null}

        {showOperatorOSGate ? (
          <ScrollReveal className="offer-operator-os-gate-reveal">
            <div className="offer-operator-os-gate" role="region" aria-label="Operator system">
              <p className="offer-operator-os-gate-header">{operatorOSGateCopy.header}</p>
              <p className="offer-operator-os-gate-sub">{operatorOSGateCopy.sub}</p>
              <button
                type="button"
                className="btn btn-secondary btn-block offer-operator-os-gate-btn"
                onClick={() => {
                  signalCta();
                  onRequestOperatorOS();
                }}
              >
                {operatorOSGateCopy.cta}
              </button>
            </div>
          </ScrollReveal>
        ) : null}

        {showHighTicketAccess ? (
          <div className="offer-high-ticket-gate" role="region" aria-label="Additional access">
            <p className="offer-high-ticket-gate-header">{highTicketGateCopy.header}</p>
            <p className="offer-high-ticket-gate-sub">{highTicketGateCopy.sub}</p>
            <div className="offer-high-ticket-gate-row">
              <span className="offer-high-ticket-gate-label">{highTicketGateCopy.customLabel}</span>
              <button
                type="button"
                className="btn btn-secondary btn-block offer-high-ticket-btn"
                onClick={() => {
                  signalCta();
                  onRequestCustomBuild();
                }}
                aria-label="Apply for custom build"
              >
                {highTicketGateCopy.cta}
              </button>
            </div>
            <div className="offer-high-ticket-gate-row">
              <span className="offer-high-ticket-gate-label">{highTicketGateCopy.oscLabel}</span>
              <button
                type="button"
                className="btn btn-secondary btn-block offer-high-ticket-btn"
                onClick={() => {
                  signalCta();
                  onRequestOsc();
                }}
                aria-label="Apply for Only Sometimes Club"
              >
                {highTicketGateCopy.cta}
              </button>
            </div>
          </div>
        ) : null}

        {postUpsell === "path" ? (
          <div className="offer-post-upsell offer-post-upsell--path" role="region" aria-label="Optional upgrade">
            <p className="offer-post-upsell-line">{offerPostPathUpsell.line1}</p>
            <p className="offer-post-upsell-line">{offerPostPathUpsell.line2}</p>
            <div className="offer-post-upsell-actions">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => {
                  signalCta();
                  onComplete("fix");
                }}
              >
                {offerPostPathUpsell.ctaUpgrade}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => {
                  signalCta();
                  onComplete("path");
                }}
              >
                {offerPostPathUpsell.ctaContinue}
              </button>
            </div>
          </div>
        ) : postUpsell === "fix" ? (
          <div className="offer-post-upsell offer-post-upsell--fix" role="region" aria-label="Optional upgrade">
            <p className="offer-post-upsell-line">{offerPostFixUpsell.line1}</p>
            <div className="offer-post-upsell-actions">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => {
                  signalCta();
                  onComplete("breakdown");
                }}
              >
                {offerPostFixUpsell.ctaUpgrade}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => {
                  signalCta();
                  onComplete("fix");
                }}
              >
                {offerPostFixUpsell.ctaContinue}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="offer-tier-stack">
              {offerTiers.map((tier) => {
                const recommended = tierRecommended(tier.id);
                const tierExpanded = expandedTier === tier.id;
                const secNudge = recommended && showScrollNudgeHighlight ? nudgeCls : "";
                const cardClass = `offer-card offer-card--tier ${
                  recommended ? "offer-card--recommended" : "offer-card--deemphasized"
                }${secNudge}`.trim();
                const process = "process" in tier ? tier.process : undefined;

                return (
                  <ScrollReveal key={tier.id} className="offer-tier-reveal">
                    <div ref={tierCardRef(tier.id)} className={cardClass}>
                      {recommended ? (
                        <span className="offer-recommended-pill offer-recommended-pill--secondary">
                          Recommended for you
                        </span>
                      ) : null}
                      <h3 className="offer-card-summary-title">{tier.title}</h3>
                      <p className="offer-card-summary-tagline">{tier.collapsedTagline}</p>

                      {tierExpanded ? (
                        <div className="offer-card-expanded" id={`offer-expanded-${tier.id}`}>
                          <div className="offer-card-body">
                            {tier.bodyLines.map((line, i) =>
                              line.trim() === "" ? (
                                <div key={`${tier.id}-gap-${i}`} className="offer-body-gap" aria-hidden />
                              ) : (
                                <p key={`${tier.id}-line-${i}`} className="offer-body-line">
                                  {line}
                                </p>
                              ),
                            )}
                          </div>

                          <p className="offer-what-heading">{offerCopy.whatYouGetHeading}</p>
                          <ul className="offer-card-bullets offer-card-bullets--compact">
                            {tier.whatYouGet.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>

                          {process ? (
                            <div className="offer-process" role="group" aria-label="Process">
                              <p className="offer-process-intro">{process.intro}</p>
                              <ul className="offer-process-areas">
                                {process.areas.map((a) => (
                                  <li key={a}>{a}</li>
                                ))}
                              </ul>
                              <p className="offer-process-closing">{process.closing}</p>
                            </div>
                          ) : null}

                          <p className="offer-card-price offer-card-price--reveal" aria-live="polite">
                            {tier.price}
                          </p>

                          {tier.subtextLines.map((line, i) => (
                            <p key={`${tier.id}-sub-${i}`} className="offer-card-subtext">
                              {line}
                            </p>
                          ))}

                          <OfferScopeInline
                            pendingTier={tier.id}
                            primaryLabel={offerScopePrimaryLabel[tier.id]}
                            onKeepFocused={handleKeepFocused}
                            onLookAcross={handleLookAcross}
                            onFixOne={handleFixOne}
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={`btn btn-block offer-tier-details-btn ${
                            recommended ? "btn-secondary" : "btn-secondary offer-cta--deemp"
                          }`.trim()}
                          onClick={() => expandTier(tier.id)}
                          aria-expanded={tierExpanded}
                        >
                          {offerSeeDetailsCta}
                        </button>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            <div ref={scrollSentinelRef} className="offer-scroll-sentinel" aria-hidden />
          </>
        )}

        <p
          className={`offer-scroll-nudge ${scrollNudgeVisible && !hasClickedOffer ? "offer-scroll-nudge--visible" : ""}`.trim()}
          role="note"
        >
          <span className="offer-scroll-nudge-line">{offerScrollNudge.line1}</span>
          <span className="offer-scroll-nudge-line">{offerScrollNudge.line2}</span>
        </p>

        <p className="offer-high-ticket-shadow">{offerHighTicketShadow}</p>

        <div className="offer-post-pricing-access">
          <p className="offer-post-pricing-line">{offerPostPricingAccess.line}</p>
          <button
            type="button"
            className="btn btn-secondary btn-block offer-post-pricing-btn"
            onClick={() => {
              onPostOfferAccess();
            }}
          >
            {offerPostPricingAccess.cta}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
