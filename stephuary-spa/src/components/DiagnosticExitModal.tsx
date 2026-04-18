type Props = {
  open: boolean;
  onStay: () => void;
  onExit: () => void;
};

export function DiagnosticExitModal({ open, onStay, onExit }: Props) {
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
          Leave the Alignment Diagnostic?
        </h2>
        <p className="diagnostic-exit-modal-body">Your progress on this run will be lost.</p>
        <div className="diagnostic-exit-modal-actions">
          <button type="button" className="btn btn-secondary diagnostic-exit-modal-stay" onClick={onStay}>
            Stay
          </button>
          <button type="button" className="btn btn-primary diagnostic-exit-modal-leave" onClick={onExit}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
