import { homeCopy } from "../data/siteCopy";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onStart: () => void;
};

export function HomeScreen({ animKey, onStart }: Props) {
  return (
    <ScreenShell animKey={animKey} className="home-screen">
      <div className="home-inner">
        <h1 className="home-headline">{homeCopy.headline}</h1>
        <p className="home-sub">{homeCopy.sub}</p>
        <div className="cta-row home-primary-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={onStart}>
            {homeCopy.cta}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
