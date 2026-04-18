import { useId } from "react";
import { offerScopeModalCopy, type OfferTierId } from "../data/siteCopy";

type Props = {
  open: boolean;
  pendingTier: OfferTierId;
  onClose: () => void;
  onKeepFocused: () => void;
  onLookAcross: () => void;
  onFixOne: () => void;
};

export function OfferScopeModal({
  open,
  pendingTier,
  onClose,
  onKeepFocused,
  onLookAcross,
  onFixOne,
}: Props) {
  const titleId = useId();
  if (!open) return null;

  const showFixOne = pendingTier === "path";
  const showLookAcross = pendingTier !== "breakdown";

  return (
    <div className="offer-scope-backdrop" role="presentation" onClick={onClose}>
      <div
        className="offer-scope-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id={titleId} className="offer-scope-modal-title">
          {offerScopeModalCopy.header}
        </h3>
        <div className="offer-scope-modal-actions">
          <button type="button" className="btn btn-primary btn-block" onClick={onKeepFocused}>
            {offerScopeModalCopy.keepFocused}
          </button>
          {showLookAcross ? (
            <button type="button" className="btn btn-secondary btn-block" onClick={onLookAcross}>
              {offerScopeModalCopy.lookAcross}
            </button>
          ) : null}
          {showFixOne ? (
            <button type="button" className="btn btn-secondary btn-block" onClick={onFixOne}>
              {offerScopeModalCopy.fixOne}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
