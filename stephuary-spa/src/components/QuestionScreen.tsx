import type { Question } from "../data/questions";
import { diagnosticCopy } from "../data/siteCopy";
import { ProgressBar } from "./ProgressBar";
import { ScreenShell } from "./ScreenShell";

type Props = {
  question: Question;
  selectedId: string | null;
  onSelect: (optionId: string) => void;
  onContinue: () => void;
  onBack: () => void;
  canGoBack: boolean;
  onExitRequest: () => void;
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
  onBack,
  canGoBack,
  onExitRequest,
  progress,
  phaseLabel,
  phaseIndex,
  phaseCount,
  animKey,
}: Props) {
  const canContinue = selectedId !== null;
  const { current, total } = progress;
  const psych = diagnosticCopy.progressPsychLine.trim();

  return (
    <ScreenShell animKey={animKey} className="question-screen question-slide">
      <div className="question-inner question-inner--stagger">
        <header className="diagnostic-header">
          <div className="diagnostic-header-side diagnostic-header-side--left">
            <button
              type="button"
              className="diagnostic-header-btn"
              onClick={onBack}
              disabled={!canGoBack}
              aria-disabled={!canGoBack}
            >
              Back
            </button>
          </div>
          <div className="diagnostic-header-center">
            <p className="diagnostic-header-phase">
              {phaseIndex + 1}/{phaseCount} · {phaseLabel}
            </p>
            <ProgressBar
              current={current}
              total={total}
              phaseCurrent={phaseIndex + 1}
              phaseTotal={phaseCount}
            />
          </div>
          <div className="diagnostic-header-side diagnostic-header-side--right">
            <button type="button" className="diagnostic-header-btn" onClick={onExitRequest}>
              Exit
            </button>
          </div>
        </header>
        <div className="question-progress-block">
          <p className="question-progress-count" aria-live="polite">
            Question {current} of {total}
          </p>
          {psych ? (
            <p className="question-progress-psych" role="note">
              {psych}
            </p>
          ) : null}
        </div>
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
