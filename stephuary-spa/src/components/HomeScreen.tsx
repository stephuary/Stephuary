import { homeCopy } from "../data/siteCopy";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onStart: () => void;
  onWatchBreakdown: () => void;
};

export function HomeScreen({ animKey, onStart, onWatchBreakdown }: Props) {
  return (
    <ScreenShell animKey={animKey} className="home-screen">
      <div className="home-inner home-inner--entrance">
        <div className="home-hero">
          <h1 className="home-headline">{homeCopy.headline}</h1>
          <p className="home-sub">{homeCopy.sub}</p>
          <p className="home-authority">{homeCopy.authority}</p>
        </div>
        <div className="cta-row home-primary-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={onStart}>
            {homeCopy.cta}
          </button>
        </div>
        <div className="home-video-tease" role="note">
          <p className="home-video-tease-lead">{homeCopy.videoTeaseLead}</p>
          <button type="button" className="home-video-tease-btn" onClick={onWatchBreakdown}>
            {homeCopy.videoTeaseCta}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
