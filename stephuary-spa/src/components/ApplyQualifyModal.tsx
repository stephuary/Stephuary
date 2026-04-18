import { useEffect } from "react";
import { applyQualifyModalCopy } from "../data/siteCopy";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ApplyQualifyModal({ open, onClose, onConfirm }: Props) {
  const copy = applyQualifyModalCopy;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="apply-qualify-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="apply-qualify-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-qualify-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="apply-qualify-title" className="apply-qualify-modal-title">
          {copy.headline}
        </h2>
        <p className="apply-qualify-modal-filter">{copy.filterLine}</p>
        <p className="apply-qualify-modal-prompt">{copy.prompt}</p>
        <p className="apply-qualify-modal-unsure">{copy.unsureLine}</p>
        <ul className="apply-qualify-modal-bullets">
          {copy.bullets.map((line) => (
            <li key={line} className="apply-qualify-modal-bullet">
              {line}
            </li>
          ))}
        </ul>
        <p className="apply-qualify-modal-bridge">{copy.bridge}</p>
        <button type="button" className="btn btn-primary btn-block apply-qualify-modal-cta" onClick={onConfirm}>
          <span className="apply-qualify-modal-cta-arrow" aria-hidden>
            →
          </span>
          {copy.cta}
        </button>
        <p className="apply-qualify-modal-review">{copy.belowButton}</p>
      </div>
    </div>
  );
}
