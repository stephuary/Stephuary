type Props = {
  current: number;
  total: number;
  phaseCurrent: number;
  phaseTotal: number;
};

export function ProgressBar({ current, total, phaseCurrent, phaseTotal }: Props) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div className="progress-wrap" aria-label="Diagnostic progress">
      <div className="progress-meta">
        <span className="progress-phase">
          {phaseCurrent}/{phaseTotal}
        </span>
        <span className="progress-count">
          {current}/{total}
        </span>
      </div>
      <div className="progress-track" aria-hidden>
        <div className="progress-fill progress-transition" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
