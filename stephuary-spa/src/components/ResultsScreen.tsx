import { resultsDecisionMomentCopy, resultsReadoutCopy } from "../data/siteCopy";
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

  return (
    <ScreenShell animKey={animKey} className="results-screen">
      <header className="results-header results-header--enter">
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
