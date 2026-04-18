import { resultsBridgeCopy, resultsStakesCopy } from "../data/siteCopy";
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
  const bridgeReveal = useScrollRevealOnce<HTMLDivElement>();
  const ctaReveal = useScrollRevealOnce<HTMLDivElement>();

  return (
    <ScreenShell animKey={animKey} className="results-screen">
      <header className="results-header results-header--enter">
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
    </ScreenShell>
  );
}
