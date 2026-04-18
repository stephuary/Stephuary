import { realizationMomentCopy } from "../data/siteCopy";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onContinue: () => void;
  onExitRequest: () => void;
};

export function RealizationMomentScreen({ animKey, onContinue, onExitRequest }: Props) {
  const { lines, cta, shareNudgeLines } = realizationMomentCopy;

  return (
    <ScreenShell animKey={animKey} className="realization-screen">
      <div className="realization-screen-inner">
        <header className="realization-screen-header">
          <div className="realization-screen-header-spacer" aria-hidden />
          <button type="button" className="diagnostic-header-btn" onClick={onExitRequest}>
            Exit
          </button>
        </header>
        <div className="realization-screen-body">
          <div className="realization-glow" aria-hidden />
          <div className="realization-copy">
            {lines.map((line, i) => (
              <p key={i} className="realization-line">
                {line}
              </p>
            ))}
          </div>
          <div className="cta-row realization-cta">
            <button type="button" className="btn btn-primary btn-block" onClick={onContinue}>
              {cta}
            </button>
          </div>
          <div className="realization-share-nudge" role="note">
            {shareNudgeLines.map((line) => (
              <p key={line} className="realization-share-nudge-line">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
