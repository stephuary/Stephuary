import { useEffect, useRef, useState } from "react";
import {
  resultsDecisionMomentCopy,
  resultsReadoutCopy,
  resultsReadoutCopyShared,
  resultsShareCopy,
} from "../data/siteCopy";
import { copyTextToClipboard } from "../lib/copyToClipboard";
import { buildShareablePageUrl } from "../lib/shareEntry";
import { useScrollRevealOnce } from "../hooks/useScrollRevealOnce";
import { ScreenShell } from "./ScreenShell";

type Props = {
  primaryCta: { label: string; onClick: () => void };
  animKey: string;
  /** From shared URL — prioritizes share block + alternate social line. */
  sharedEntry?: boolean;
};

export function ResultsScreen({ primaryCta, animKey, sharedEntry = false }: Props) {
  const decisionReveal = useScrollRevealOnce<HTMLDivElement>();
  const ctaReveal = useScrollRevealOnce<HTMLDivElement>();
  const d = resultsDecisionMomentCopy;
  const r = resultsReadoutCopy;
  const share = resultsShareCopy;
  const socialLine = sharedEntry ? resultsReadoutCopyShared.socialProofLine : r.socialProofLine;

  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied">("idle");
  const copyResetRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current);
    };
  }, []);

  async function handleCopyLink() {
    const ok = await copyTextToClipboard(buildShareablePageUrl(window.location.href));
    if (!ok) return;
    setCopyFeedback("copied");
    if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current);
    copyResetRef.current = window.setTimeout(() => {
      copyResetRef.current = null;
      setCopyFeedback("idle");
    }, 4500);
  }

  const identityBlock = (
    <p className="results-identity-line" role="note">
      {r.recognitionLine}
    </p>
  );

  const socialBlock = (
    <p className="results-social-proof-line" role="note">
      {socialLine}
    </p>
  );

  const shareBlock = (
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
        {copyFeedback === "copied" ? <p className="results-share-copied">{share.copied}</p> : null}
      </div>
    </div>
  );

  return (
    <ScreenShell animKey={animKey} className="results-screen">
      <header className="results-header results-header--enter">
        <p className="results-ownership-line" role="note">
          {r.ownershipLead}
        </p>
        <p className="results-ownership-sub" role="note">
          {r.ownershipSub}
        </p>
        <h1 className="results-title">{r.pageTitle}</h1>
        <div className="results-pattern-authority" role="note">
          <p className="results-pattern-authority-line">{r.authority.line1}</p>
          <p className="results-pattern-authority-line results-pattern-authority-line--secondary">
            {r.authority.line2}
          </p>
        </div>
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
      <div
        className={`results-post-readout ${sharedEntry ? "results-post-readout--shared-priority" : ""}`.trim()}
      >
        {sharedEntry ? (
          <>
            {shareBlock}
            {identityBlock}
            {socialBlock}
          </>
        ) : (
          <>
            {identityBlock}
            {socialBlock}
            {shareBlock}
          </>
        )}
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
