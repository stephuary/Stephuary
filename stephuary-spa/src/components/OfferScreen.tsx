import { useEffect, useId, useRef, useState } from "react";
import {
  highTicketGateCopy,
  offerCopy,
  offerDecisionShortcut,
  offerFrictionCopy,
  offerHighTicketShadow,
  offerInvisibleAnchor,
  offerMomentumCopy,
  offerPostFixUpsell,
  offerPostPathUpsell,
  offerPostPricingAccess,
  offerScrollNudge,
  offerScopeInlineCopy,
  offerBeforeOptionsCopy,
  offerSeeDetailsCta,
  offerTierLead,
  offerValueAnchor,
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
  onKeepFocused,
  onLookAcross,
  onFixOne,
}: {
  pendingTier: OfferTierId;
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
          {offerScopeInlineCopy.keepFocused}
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
  const [showSecondary, setShowSecondary] = useState(() => recommendedTier !== "entry");
  const [expandedTier, setExpandedTier] = useState<OfferTierId | null>(null);
  const [postUpsell, setPostUpsell] = useState<null | "path" | "fix">(null);
  const [hasClickedOffer, setHasClickedOffer] = useState(false);
  const [scrollNudgeVisible, setScrollNudgeVisible] = useState(false);

  const secondaryRegionId = useId();
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
  }, [recommendedTier, showSecondary]);

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
  const primaryCardClass = `offer-card offer-card--primary ${
    recPath ? "offer-card--primary-dominant offer-card--recommended" : "offer-card--deemphasized"
  }${recPath ? nudgeCls : ""}`.trim();

  const pathExpanded = expandedTier === "path";

  return (
    <ScreenShell animKey={animKey} className="offer-screen">
      <div className="offer-inner">
        <ScrollReveal className="offer-value-anchor-reveal">
          <div className="offer-value-anchor" role="note">
            <p className="offer-value-anchor-line">{offerValueAnchor.line1}</p>
            <p className="offer-value-anchor-line">{offerValueAnchor.line2}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="offer-momentum-reveal">
          <div className="offer-momentum" role="note">
            <p className="offer-momentum-line">{offerMomentumCopy.line1}</p>
            <p className="offer-momentum-line">{offerMomentumCopy.line2}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="offer-invisible-anchor-reveal">
          <p className="offer-invisible-anchor">{offerInvisibleAnchor}</p>
        </ScrollReveal>

        <ScrollReveal className="offer-intro-reveal">
          <header className="offer-intro">
            <h2 className="offer-intro-headline">{offerCopy.intro.headline}</h2>
            <p className="offer-intro-bridge">{offerCopy.intro.bridge}</p>
            <p className="offer-intro-sub offer-intro-sub--dynamic">{tierLead}</p>
          </header>
        </ScrollReveal>

        <ScrollReveal className="offer-anchor-reveal">
          <div className="offer-anchor" role="note">
            <p className="offer-anchor-line">{offerCopy.anchor.line1}</p>
            <p className="offer-anchor-line">{offerCopy.anchor.line2}</p>
            <p className="offer-anchor-line offer-anchor-line--emph">{offerCopy.anchor.line3}</p>
          </div>
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
            <ScrollReveal className="offer-before-options-reveal">
              <div className="offer-before-options" role="note">
                <p className="offer-before-options-line">{offerBeforeOptionsCopy.line1}</p>
                <p className="offer-before-options-line offer-before-options-line--emph">
                  {offerBeforeOptionsCopy.line2}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal className="offer-primary-reveal">
              <div className="offer-primary-wrap">
                <div ref={pathRef} className={primaryCardClass}>
                  {recPath ? <span className="offer-recommended-pill">Recommended for you</span> : null}
                  <span className="offer-card-label">{offerCopy.primary.label}</span>
                  <span className="offer-card-title">{offerCopy.primary.title}</span>
                  <p className="offer-card-outcome">{offerCopy.primary.collapsedOutcome}</p>
                  <p className="offer-card-teaser">{offerCopy.primary.collapsedTeaser}</p>

                  {pathExpanded ? (
                    <>
                      <span className="offer-card-price">{offerCopy.primary.price}</span>
                      <p className="offer-card-time-compress">{offerDecisionShortcut.entry}</p>
                      <p className="offer-card-eyebrow-sub">{offerCopy.primary.subline}</p>
                      <p className="offer-card-line">{offerCopy.primary.line}</p>
                      <p className="offer-card-urgency">{offerCopy.primary.urgency}</p>
                      <ul className="offer-card-bullets offer-card-bullets--primary">
                        {offerCopy.primary.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                      <p className="offer-friction">{offerFrictionCopy}</p>
                      <p className="offer-card-decision-guide">{offerCopy.primary.decisionGuide}</p>
                      <OfferScopeInline
                        pendingTier="path"
                        onKeepFocused={handleKeepFocused}
                        onLookAcross={handleLookAcross}
                        onFixOne={handleFixOne}
                      />
                      <p className="offer-card-social-cue">{offerCopy.primary.socialCue}</p>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={`btn btn-block offer-primary-btn ${recPath ? "btn-primary" : "btn-secondary offer-cta--deemp"}`.trim()}
                      onClick={() => expandTier("path")}
                      aria-expanded={pathExpanded}
                    >
                      {offerSeeDetailsCta}
                    </button>
                  )}
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
              {offerCopy.secondary.map((tier) => {
                const isFix = tier.id === "fix";
                const recommended = isFix ? recFix : recFull;
                const cardRef = isFix ? fixRef : fullRef;
                const shortcutKey = isFix ? "focused" : "full";
                const secNudge = recommended && showScrollNudgeHighlight ? nudgeCls : "";
                const tierExpanded = expandedTier === tier.id;
                return (
                  <ScrollReveal key={tier.id} className="offer-tier-reveal">
                    <div
                      ref={cardRef}
                      className={`offer-card offer-card--secondary ${
                        recommended ? "offer-card--recommended" : "offer-card--deemphasized"
                      }${secNudge}`.trim()}
                    >
                      {recommended ? (
                        <span className="offer-recommended-pill offer-recommended-pill--secondary">
                          Recommended for you
                        </span>
                      ) : null}
                      {"label" in tier && tier.label ? (
                        <span className="offer-card-label offer-card-label--secondary">{tier.label}</span>
                      ) : null}
                      <span className="offer-card-title offer-card-title--sm">{tier.title}</span>
                      <p className="offer-card-outcome offer-card-outcome--sm">{tier.collapsedOutcome}</p>
                      <p className="offer-card-teaser offer-card-teaser--sm">{tier.collapsedTeaser}</p>

                      {tierExpanded ? (
                        <>
                          <span className="offer-card-price offer-card-price--sm">{tier.price}</span>
                          <p className="offer-card-time-compress offer-card-time-compress--sm">
                            {offerDecisionShortcut[shortcutKey]}
                          </p>
                          {"trustLine" in tier && tier.trustLine ? (
                            <p className="offer-card-trust">{tier.trustLine}</p>
                          ) : null}
                          {"opening" in tier && tier.opening ? (
                            <p className="offer-card-opening">{tier.opening}</p>
                          ) : null}
                          {"lines" in tier && tier.lines
                            ? tier.lines.map((line) => (
                                <p key={line} className="offer-card-opening offer-card-opening--tight">
                                  {line}
                                </p>
                              ))
                            : null}
                          {"line" in tier && tier.line ? (
                            <p className="offer-card-line offer-card-line--sm">{tier.line}</p>
                          ) : null}
                          {"timeSave" in tier && tier.timeSave ? (
                            <p className="offer-card-line offer-card-line--sm">{tier.timeSave}</p>
                          ) : null}
                          {"bullets" in tier && tier.bullets && tier.bullets.length > 0 ? (
                            <ul className="offer-card-bullets">
                              {tier.bullets.map((b) => (
                                <li key={b}>{b}</li>
                              ))}
                            </ul>
                          ) : null}
                          {"decisionGuide" in tier && tier.decisionGuide ? (
                            <p className="offer-card-decision-guide offer-card-decision-guide--secondary">
                              {tier.decisionGuide}
                            </p>
                          ) : null}
                          <OfferScopeInline
                            pendingTier={tier.id}
                            onKeepFocused={handleKeepFocused}
                            onLookAcross={handleLookAcross}
                            onFixOne={handleFixOne}
                          />
                        </>
                      ) : (
                        <button
                          type="button"
                          className={`btn btn-block ${recommended ? "btn-secondary" : "btn-secondary offer-cta--deemp"}`.trim()}
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
