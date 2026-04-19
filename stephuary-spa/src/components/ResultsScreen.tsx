import { useEffect, useRef, useState } from "react";
import {
  resultsOfferBridgeCopy,
  resultsReadoutCopy,
  resultsShareCopy,
} from "../data/siteCopy";
import { copyTextToClipboard } from "../lib/copyToClipboard";
import { buildShareablePageUrl } from "../lib/shareEntry";
import { ScreenShell } from "./ScreenShell";

type Props = {
  primaryCta: { label: string; onClick: () => void };
  animKey: string;
  classificationLabels: string[];
};

export function ResultsScreen({
  primaryCta,
  animKey,
  classificationLabels,
}: Props) {
  const r = resultsReadoutCopy;
  const share = resultsShareCopy;
  const bridge = resultsOfferBridgeCopy;

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

  const happeningBlock = (
    <div className="results-happening" role="region" aria-label="What is happening">
      <p className="results-section-kicker">{r.whatHeading}</p>
      <ul className="results-classification-list">
        {classificationLabels.map((label) => (
          <li key={label} className="results-classification-item">
            → {label}
          </li>
        ))}
      </ul>
    </div>
  );

  const whyBlock = (
    <div className="results-why" role="region" aria-label="Why">
      <p className="results-section-kicker">{r.whyHeading}</p>
      <p className="results-why-body">{r.whyBody}</p>
    </div>
  );

  const costBlock = (
    <div className="results-consequence" role="region" aria-label="Cost">
      <p className="results-section-kicker">{r.costHeading}</p>
      <ul className="results-consequence-list">
        {r.consequenceBullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <p className="results-consequence-close">{r.consequenceClose}</p>
    </div>
  );

  return (
    <ScreenShell animKey={animKey} className="results-screen">
      <div className="results-copy-stack screen-copy-panel">
        <header className="results-header results-header--enter">
          <h1 className="results-title">{r.pageTitle}</h1>
          {r.openLine1 ? <p className="results-open-line results-open-line--solo">{r.openLine1}</p> : null}
        </header>
        {happeningBlock}
        {whyBlock}
        {costBlock}
      </div>

      <div className="results-offer-bridge screen-copy-panel" aria-label="Paid options">
        <h2 className="results-offer-bridge-headline">{bridge.headline}</h2>
        <div className="cta-row results-offer-bridge-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={primaryCta.onClick}>
            {primaryCta.label}
          </button>
        </div>
      </div>

      <div className="results-post-readout">{shareBlock}</div>
    </ScreenShell>
  );
}
