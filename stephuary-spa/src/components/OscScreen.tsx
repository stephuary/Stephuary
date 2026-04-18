import { oscPageCopy } from "../data/oscPageCopy";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onRequestAccess: () => void;
};

export function OscScreen({ animKey, onRequestAccess }: Props) {
  return (
    <ScreenShell animKey={animKey} className="eco-page eco-page--osc">
      <h1 className="eco-page-headline">{oscPageCopy.headline}</h1>
      <p className="eco-page-sub">{oscPageCopy.sub}</p>
      <div className="cta-row eco-page-cta">
        <button type="button" className="btn btn-primary btn-block" onClick={onRequestAccess}>
          {oscPageCopy.cta}
        </button>
      </div>
    </ScreenShell>
  );
}
