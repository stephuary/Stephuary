import type { Question } from "../data/questions";
import { ScreenShell } from "./ScreenShell";

type Props = {
  question: Question;
  selectedId: string | null;
  onSelect: (optionId: string) => void;
  onContinue: () => void;
  progress: { current: number; total: number };
  phaseLabel: string;
  phaseIndex: number;
  phaseCount: number;
  animKey: string;
};

export function QuestionScreen({
  question,
  selectedId,
  onSelect,
  onContinue,
  progress,
  phaseLabel,
  phaseIndex,
  phaseCount,
  animKey,
}: Props) {
  const canContinue = selectedId !== null;

  return (
    <ScreenShell animKey={animKey} className="question-screen question-slide">
      <div className="question-inner">
        <div className="phase-row">
          <span className="phase-pill">
            {phaseIndex + 1}/{phaseCount} · {phaseLabel}
          </span>
        </div>
        <p className="eyebrow question-eyebrow">
          {progress.current} / {progress.total}
        </p>
        <h2 className="question-title" id={`q-${question.id}`}>
          {question.prompt}
        </h2>
        <div className="options" role="radiogroup" aria-labelledby={`q-${question.id}`}>
          {question.options.map((opt) => {
            const active = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`option-btn ${active ? "option-btn--active" : ""}`}
                onClick={() => onSelect(opt.id)}
              >
                <span className="option-label">{opt.label}</span>
              </button>
            );
          })}
        </div>
        <div className="cta-row">
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!canContinue}
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
