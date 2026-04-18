import { homeCopy } from "../data/siteCopy";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onStart: () => void;
  onWatchBreakdown: () => void;
};

export function HomeScreen({ animKey, onStart, onWatchBreakdown }: Props) {
  const h = homeCopy;
  return (
    <ScreenShell animKey={animKey} className="home-screen">
      <div className="home-inner home-inner--entrance">
        <div className="home-hero">
          <div className="home-hero-copy">
            <h1 className="home-headline">{h.headline}</h1>
            <p className="home-subtext">{h.subtext}</p>
            <div className="home-shows" role="note">
              <p className="home-shows-lead">{h.showsLead}</p>
              {h.showsLines.map((line) => (
                <p key={line} className="home-shows-line">
                  {line}
                </p>
              ))}
            </div>
            <p className="home-body-tension">{h.bodyTension}</p>
          </div>
        </div>
        <div className="cta-row home-primary-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={onStart}>
            {h.cta}
          </button>
        </div>
        <div className="home-video-tease" role="note">
          <button type="button" className="home-video-tease-btn" onClick={onWatchBreakdown}>
            {h.videoTeaseCta}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
