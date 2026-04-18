import { entryCopy } from "../data/siteCopy";
import { ScreenShell } from "./ScreenShell";

type Props = {
  onStart: () => void;
  animKey: string;
};

export function EntryScreen({ onStart, animKey }: Props) {
  return (
    <ScreenShell animKey={animKey} className="entry-screen">
      <div className="entry-inner">
        <h1 className="entry-headline">{entryCopy.headline}</h1>
        <p className="entry-sub">{entryCopy.sub}</p>
        <div className="cta-row entry-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={onStart}>
            {entryCopy.cta}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
