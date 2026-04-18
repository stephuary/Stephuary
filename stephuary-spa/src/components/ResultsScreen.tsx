import { useState, type FormEvent } from "react";
import { usePostActionMoment } from "../context/PostActionMomentContext";
import {
  resultsDecisionLanguage,
  resultsDecisionMomentCopy,
  resultsEmailCopy,
  resultsImpliedProof,
  resultsPatternAuthority,
  resultsShareCopy,
} from "../data/siteCopy";
import { ExclusionAuthorityBlock } from "./ExclusionAuthorityBlock";
import { useScrollRevealOnce } from "../hooks/useScrollRevealOnce";
import type { SectionOutput } from "../lib/outputGenerator";
import { ResultSection } from "./ResultSection";
import { ScreenShell } from "./ScreenShell";

type Props = {
  sections: SectionOutput[];
  primaryCta: { label: string; onClick: () => void };
  animKey: string;
};

export function ResultsScreen({ sections, primaryCta, animKey }: Props) {
  const triggerPostAction = usePostActionMoment();
  const [shareCopied, setShareCopied] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const decisionReveal = useScrollRevealOnce<HTMLDivElement>();
  const ctaReveal = useScrollRevealOnce<HTMLDivElement>();
  const d = resultsDecisionMomentCopy;

  async function copyShareLink() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    triggerPostAction();
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 2000);
  }

  function submitResultsEmail(e: FormEvent) {
    e.preventDefault();
    const trimmed = emailDraft.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
    triggerPostAction();
    setEmailSubmitted(true);
  }

  function renderReadoutSections() {
    if (sections.length === 0) return null;
    const ip = resultsImpliedProof;
    const impliedProofBlock = (
      <div className="results-implied-proof" role="note">
        <p className="results-implied-proof-line">{ip.line1}</p>
        <p className="results-implied-proof-line">{ip.line2}</p>
      </div>
    );
    if (sections.length === 1) {
      return (
        <>
          {impliedProofBlock}
          <ResultSection key={sections[0].id} section={sections[0]} />
        </>
      );
    }
    const split = Math.ceil(sections.length / 2);
    const first = sections.slice(0, split);
    const rest = sections.slice(split);
    return (
      <>
        {first.map((s) => (
          <ResultSection key={s.id} section={s} />
        ))}
        {impliedProofBlock}
        {rest.map((s) => (
          <ResultSection key={s.id} section={s} />
        ))}
      </>
    );
  }

  return (
    <ScreenShell animKey={animKey} className="results-screen">
      <header className="results-header results-header--enter">
        <h1 className="results-title">Your readout</h1>
        <div className="results-pattern-authority" role="note">
          <p className="results-pattern-authority-line">{resultsPatternAuthority.line1}</p>
          <p className="results-pattern-authority-line results-pattern-authority-line--secondary">
            {resultsPatternAuthority.line2}
          </p>
          <p className="results-pattern-authority-line results-pattern-authority-line--secondary">
            {resultsPatternAuthority.line3}
          </p>
        </div>
      </header>
      <div className="results-body">{renderReadoutSections()}</div>
      <div
        ref={decisionReveal.ref}
        className={`results-decision scroll-reveal ${decisionReveal.inView ? "scroll-reveal--in" : ""}`.trim()}
        role="region"
        aria-label="Decision"
      >
        <div className="results-decision-open">
          {d.openLines.map((line) => (
            <p key={line} className="results-decision-open-line">
              {line}
            </p>
          ))}
        </div>
        <div className="results-decision-same">
          {d.sameLines.map((line) => (
            <p key={line} className="results-decision-same-line">
              {line}
            </p>
          ))}
        </div>
        <p className="results-decision-or">{d.pivotLabel}</p>
        <p className="results-decision-pivot">{d.pivotAction}</p>
      </div>
      <div className="results-email-capture" role="region" aria-label="Email">
        <p className="results-email-prompt">{resultsEmailCopy.prompt}</p>
        {emailSubmitted ? (
          <p className="results-email-followup" role="status">
            {resultsEmailCopy.followUp}
          </p>
        ) : (
          <form className="results-email-form" onSubmit={submitResultsEmail}>
            <input
              className="results-email-input"
              type="email"
              name="results_email"
              autoComplete="email"
              placeholder="Email"
              aria-label="Email"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary btn-block results-email-send">
              {resultsEmailCopy.send}
            </button>
          </form>
        )}
      </div>
      <div
        ref={ctaReveal.ref}
        className={`results-decision-cta-wrap scroll-reveal ${ctaReveal.inView ? "scroll-reveal--in" : ""}`.trim()}
      >
        <div className="results-decision-language" role="note">
          <p className="results-decision-language-line">{resultsDecisionLanguage.beforeCtaLine1}</p>
          <p className="results-decision-language-line">{resultsDecisionLanguage.beforeCtaLine2}</p>
        </div>
        <div className="cta-row results-decision-cta-row">
          <button type="button" className="btn btn-primary btn-block" onClick={primaryCta.onClick}>
            {primaryCta.label}
          </button>
        </div>
        <div className="results-decision-cta-sub" role="note">
          {d.ctaFilterLines.map((line) => (
            <p key={line} className="results-decision-cta-sub-line">
              {line}
            </p>
          ))}
        </div>
        <ExclusionAuthorityBlock className="exclusion-authority--results" />
      </div>
      <div className="results-share" role="region" aria-label="Share">
        <p className="results-share-prompt">{resultsShareCopy.prompt}</p>
        <button type="button" className="btn btn-secondary btn-block results-share-btn" onClick={() => void copyShareLink()}>
          {shareCopied ? resultsShareCopy.copied : resultsShareCopy.cta}
        </button>
        <p className="results-end-decision" role="note">
          {resultsDecisionLanguage.endOfResults}
        </p>
      </div>
    </ScreenShell>
  );
}
