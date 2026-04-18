import { resultsBridgeCopy } from "../data/siteCopy";
import type { SectionOutput } from "../lib/outputGenerator";
import { ResultSection } from "./ResultSection";
import { ScreenShell } from "./ScreenShell";

type Props = {
  sections: SectionOutput[];
  primaryCta: { label: string; onClick: () => void };
  animKey: string;
};

export function ResultsScreen({ sections, primaryCta, animKey }: Props) {
  return (
    <ScreenShell animKey={animKey} className="results-screen">
      <header className="results-header">
        <h1 className="results-title">Your readout</h1>
      </header>
      <div className="results-body">
        {sections.map((s) => (
          <ResultSection key={s.id} section={s} />
        ))}
      </div>
      <div className="results-bridge">
        <p className="results-bridge-line">{resultsBridgeCopy.line1}</p>
        <p className="results-bridge-line results-bridge-line--emph">
          {resultsBridgeCopy.line2}
        </p>
      </div>
      <div className="cta-row">
        <button type="button" className="btn btn-primary btn-block" onClick={primaryCta.onClick}>
          {primaryCta.label}
        </button>
      </div>
    </ScreenShell>
  );
}
