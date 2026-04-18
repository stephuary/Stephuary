import { useEffect, useRef, useState } from "react";
import {
  resultsDecisionMomentCopy,
  resultsReadoutCopy,
  resultsShareCopy,
} from "../data/siteCopy";
import { copyTextToClipboard } from "../lib/copyToClipboard";
import { useScrollRevealOnce } from "../hooks/useScrollRevealOnce";
import { ScreenShell } from "./ScreenShell";

type Props = {
  primaryCta: { label: string; onClick: () => void };
  animKey: string;
};

export function ResultsScreen({ primaryCta, animKey }: Props) {
  const decisionReveal = useScrollRevealOnce<HTMLDivElement>();
  const ctaReveal = useScrollRevealOnce<HTMLDivElement>();
  const d = resultsDecisionMomentCopy;
  const r = resultsReadoutCopy;
  const share = resultsShareCopy;

  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied">("idle");
  const copyResetRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current);
    };
  }, []);

  async function handleCopyLink() {
    const ok = await copyTextToClipboard(window.location.href);
    if (!ok) return;
    setCopyFeedback("copied");
    if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current);
    copyResetRef.current = window.setTimeout(() => {
      copyResetRef.current = null;
      setCopyFeedback("idle");
    }, 4500);
  }

  return (
    <ScreenShell animKey={animKey} className="results-screen">
      <header className="results-header results-header--enter">
        <p className="results-ownership-line" role="note">
          {r.ownershipLine}
        </p>
        <h1 className="results-title">{r.pageTitle}</h1>
        <div className="results-pattern-authority" role="note">
          <p className="results-pattern-authority-line">{r.authority.line1}</p>
          <p className="results-pattern-authority-line results-pattern-authority-line--secondary">
            {r.authority.line2}
          </p>
        </div>
        <p className="results-recognition-line" role="note">
          {r.recognitionLine}
        </p>
      </header>
      <div className="results-body results-body--static">
        {r.sections.map((section) => (
          <article key={section.id} className="results-readout-section">
            <h2 className="results-readout-title">{section.title}</h2>
            <div className="results-readout-prose">
              {section.paragraphs.map((p, i) => (
                <p key={`${section.id}-${i}`} className="results-readout-p">
                  {p}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="results-post-readout">
        <p className="results-social-proof-line" role="note">
          {r.socialProofLine}
        </p>
        <p className="results-send-easier-line" role="note">
          {r.sendEasierLine}
        </p>
        <div className="results-share">
          <p className="results-share-prompt">{share.prompt}</p>
          <div className="results-share-row">
            <button type="button" className="results-share-link" onClick={() => void handleCopyLink()}>
              <span className="results-share-link-arrow" aria-hidden>
                →
              </span>
              {share.cta}
            </button>
          </div>
          <div className="results-share-feedback" aria-live="polite">
            {copyFeedback === "copied" ? (
              <>
                <p className="results-share-copied">{share.copied}</p>
                <p className="results-share-send-nudge">{share.sendNudge}</p>
              </>
            ) : null}
          </div>
        </div>
      </div>
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
      <div
        ref={ctaReveal.ref}
        className={`results-decision-cta-wrap scroll-reveal ${ctaReveal.inView ? "scroll-reveal--in" : ""}`.trim()}
      >
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
      </div>
    </ScreenShell>
  );
}
