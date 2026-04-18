import { useEffect } from "react";
import { revenueGateModalCopy } from "../data/siteCopy";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ApplyQualifyModal({ open, onClose, onConfirm }: Props) {
  const copy = revenueGateModalCopy;

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
      className="install-qualify-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="install-qualify-modal screen-copy-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="revenue-gate-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="revenue-gate-title" className="install-qualify-modal-title">
          {copy.headline}
        </h2>
        <p className="install-qualify-modal-lead">{copy.bodyLead}</p>
        <p className="install-qualify-modal-pick">{copy.bodyPick}</p>
        <ul className="install-qualify-modal-routes">
          {copy.routes.map((line) => (
            <li key={line} className="install-qualify-modal-route">
              {line}
            </li>
          ))}
        </ul>
        <p className="install-qualify-modal-closing">{copy.closing}</p>
        <button type="button" className="btn btn-primary btn-block install-qualify-modal-cta" onClick={onConfirm}>
          <span className="install-qualify-modal-cta-arrow" aria-hidden>
            →
          </span>
          {copy.cta}
        </button>
      </div>
    </div>
  );
}
