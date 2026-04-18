import { diagnosticExitCopy } from "../data/siteCopy";

type Props = {
  open: boolean;
  onStay: () => void;
  onExit: () => void;
};

export function DiagnosticExitModal({ open, onStay, onExit }: Props) {
  const c = diagnosticExitCopy;
  if (!open) return null;

  return (
    <div
      className="diagnostic-exit-modal-overlay"
      role="presentation"
      onClick={onStay}
    >
      <div
        className="diagnostic-exit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="diagnostic-exit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="diagnostic-exit-title" className="diagnostic-exit-modal-title">
          {c.title}
        </h2>
        <p className="diagnostic-exit-modal-body">{c.body}</p>
        <div className="diagnostic-exit-modal-actions">
          <button type="button" className="btn btn-primary diagnostic-exit-modal-stay" onClick={onStay}>
            {c.stay}
          </button>
          <button type="button" className="btn btn-secondary diagnostic-exit-modal-leave" onClick={onExit}>
            {c.leave}
          </button>
        </div>
      </div>
    </div>
  );
}
