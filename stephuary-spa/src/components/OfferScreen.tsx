import { useState } from "react";
import { offerCopy } from "../data/siteCopy";
import { ScreenShell } from "./ScreenShell";

type TierId = (typeof offerCopy.tiers)[number]["id"];

type Props = {
  animKey: string;
  /** Fires after user picks a tier and confirms — prototype has no checkout. */
  onComplete: (tierId: TierId) => void;
};

export function OfferScreen({ animKey, onComplete }: Props) {
  const [selected, setSelected] = useState<TierId | null>(null);

  return (
    <ScreenShell animKey={animKey} className="offer-screen">
      <div className="offer-inner">
        <h2 className="offer-headline">{offerCopy.headline}</h2>
        <div className="offer-tiers" role="radiogroup" aria-label="Offers">
          {offerCopy.tiers.map((tier) => {
            const active = selected === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`offer-tier ${active ? "offer-tier--active" : ""}`}
                onClick={() => setSelected(tier.id)}
              >
                <span className="offer-tier-price">{tier.price}</span>
                <span className="offer-tier-title">{tier.title}</span>
                <span className="offer-tier-line">{tier.line}</span>
              </button>
            );
          })}
        </div>
        <div className="cta-row">
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!selected}
            onClick={() => {
              if (selected) onComplete(selected);
            }}
          >
            {offerCopy.cta}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
