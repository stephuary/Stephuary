import { grownSpaghettiPageCopy } from "../data/grownSpaghettiPageCopy";
import { SUBSTACK_PLACEHOLDER_HREF } from "../data/ecosystem";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
};

export function GrownSpaghettiScreen({ animKey }: Props) {
  return (
    <ScreenShell animKey={animKey} className="eco-page eco-page--gs">
      <h1 className="eco-page-headline">{grownSpaghettiPageCopy.headline}</h1>
      <p className="eco-page-sub">{grownSpaghettiPageCopy.sub}</p>
      <div className="cta-row eco-page-cta">
        <a
          className="btn btn-primary btn-block"
          href={SUBSTACK_PLACEHOLDER_HREF}
          target="_blank"
          rel="noopener noreferrer"
        >
          {grownSpaghettiPageCopy.cta}
        </a>
      </div>
    </ScreenShell>
  );
}
