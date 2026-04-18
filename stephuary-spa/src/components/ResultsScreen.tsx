import { useState } from "react";
import { usePostActionMoment } from "../context/PostActionMomentContext";
import {
  resultsAuthorityCopy,
  resultsBridgeCopy,
  resultsScaleCopy,
  resultsShareCopy,
  resultsStakesCopy,
  resultsTransitionCopy,
} from "../data/siteCopy";
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
  const bridgeReveal = useScrollRevealOnce<HTMLDivElement>();
  const ctaReveal = useScrollRevealOnce<HTMLDivElement>();

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

  return (
    <ScreenShell animKey={animKey} className="results-screen">
      <header className="results-header results-header--enter">
        <p className="results-transition" role="note">
          {resultsTransitionCopy}
        </p>
        <h1 className="results-title">Your readout</h1>
      </header>
      <div className="results-body">
        {sections.map((s) => (
          <ResultSection key={s.id} section={s} />
        ))}
      </div>
      <p className="results-stakes" role="note">
        {resultsStakesCopy}
      </p>
      <p className="results-authority" role="note">
        {resultsAuthorityCopy}
      </p>
      <p className="results-scale" role="note">
        {resultsScaleCopy}
      </p>
      <div
        ref={bridgeReveal.ref}
        className={`results-bridge scroll-reveal ${bridgeReveal.inView ? "scroll-reveal--in" : ""}`.trim()}
      >
        <p className="results-bridge-line">{resultsBridgeCopy.line1}</p>
        <p className="results-bridge-line results-bridge-line--emph">
          {resultsBridgeCopy.line2}
        </p>
      </div>
      <div
        ref={ctaReveal.ref}
        className={`cta-row results-cta-reveal scroll-reveal ${ctaReveal.inView ? "scroll-reveal--in" : ""}`.trim()}
      >
        <button type="button" className="btn btn-primary btn-block" onClick={primaryCta.onClick}>
          {primaryCta.label}
        </button>
      </div>
      <div className="results-share" role="region" aria-label="Share">
        <p className="results-share-prompt">{resultsShareCopy.prompt}</p>
        <button type="button" className="btn btn-secondary btn-block results-share-btn" onClick={() => void copyShareLink()}>
          {shareCopied ? resultsShareCopy.copied : resultsShareCopy.cta}
        </button>
      </div>
    </ScreenShell>
  );
}
