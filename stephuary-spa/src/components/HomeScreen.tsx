import { homeCopy } from "../data/siteCopy";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onStart: () => void;
};

export function HomeScreen({ animKey, onStart }: Props) {
  return (
    <ScreenShell animKey={animKey} className="home-screen">
      <div className="home-inner home-inner--entrance">
        <h1 className="home-headline">{homeCopy.headline}</h1>
        <p className="home-sub">{homeCopy.sub}</p>
        <p className="home-micro">{homeCopy.micro}</p>
        <p className="home-qualifier">{homeCopy.qualifier}</p>
        <div className="cta-row home-primary-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={onStart}>
            {homeCopy.cta}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
