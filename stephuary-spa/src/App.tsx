import { useMemo, useState } from "react";
import { QUESTIONS, phaseMeta } from "./data/questions";
import { EntryScreen } from "./components/EntryScreen";
import { OfferScreen } from "./components/OfferScreen";
import { ProgressBar } from "./components/ProgressBar";
import { QuestionScreen } from "./components/QuestionScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { buildEvaluationContext } from "./lib/scoring";
import { generateSectionOutputs } from "./lib/outputGenerator";
import type { AnswersMap, FlowStep } from "./types/flow";

const PHASE_TOTAL = 5;

function stepAnimKey(step: FlowStep): string {
  switch (step.id) {
    case "entry":
      return "entry";
    case "quiz":
      return `quiz-${step.index}`;
    case "results":
      return "results";
    case "offer":
      return "offer";
  }
}

export default function App() {
  const [step, setStep] = useState<FlowStep>({ id: "entry" });
  const [answers, setAnswers] = useState<AnswersMap>({});

  const sections = useMemo(() => {
    const ctx = buildEvaluationContext(answers);
    return generateSectionOutputs(ctx);
  }, [answers]);

  function setAnswer(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function restart() {
    setAnswers({});
    setStep({ id: "entry" });
  }

  return (
    <div className="app">
      {step.id === "quiz" ? (
        <header className="app-header">
          <div className="app-header-inner app-header-inner--narrow">
            <ProgressBar
              current={step.index + 1}
              total={QUESTIONS.length}
              phaseCurrent={phaseMeta(step.index).phaseIndex + 1}
              phaseTotal={PHASE_TOTAL}
            />
          </div>
        </header>
      ) : null}

      <main
        className={`app-main ${step.id === "entry" ? "app-main--entry" : ""}`.trim()}
      >
        {step.id === "entry" ? (
          <EntryScreen
            animKey={stepAnimKey(step)}
            onStart={() => setStep({ id: "quiz", index: 0 })}
          />
        ) : null}

        {step.id === "quiz" ? (
          <QuestionScreen
            animKey={stepAnimKey(step)}
            question={QUESTIONS[step.index]}
            selectedId={answers[QUESTIONS[step.index].id] ?? null}
            onSelect={(id) => setAnswer(QUESTIONS[step.index].id, id)}
            onContinue={() => {
              const last = step.index >= QUESTIONS.length - 1;
              if (last) setStep({ id: "results" });
              else setStep({ id: "quiz", index: step.index + 1 });
            }}
            progress={{
              current: step.index + 1,
              total: QUESTIONS.length,
            }}
            phaseLabel={phaseMeta(step.index).phaseLabel}
            phaseIndex={phaseMeta(step.index).phaseIndex}
            phaseCount={PHASE_TOTAL}
          />
        ) : null}

        {step.id === "results" ? (
          <ResultsScreen
            animKey={stepAnimKey(step)}
            sections={sections}
            primaryCta={{
              label: "Continue",
              onClick: () => setStep({ id: "offer" }),
            }}
          />
        ) : null}

        {step.id === "offer" ? (
          <OfferScreen
            animKey={stepAnimKey(step)}
            onComplete={() => {
              restart();
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
