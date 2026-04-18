import { useMemo, useState } from "react";
import { SUBSTACK_PLACEHOLDER_HREF } from "./data/ecosystem";
import { QUESTIONS, phaseMeta } from "./data/questions";
import { AccessRequestScreen } from "./components/AccessRequestScreen";
import type { NavAction } from "./components/AppNav";
import { AppNav } from "./components/AppNav";
import { ClubScreen } from "./components/ClubScreen";
import { CustomBuildScreen } from "./components/CustomBuildScreen";
import { ExploreScreen } from "./components/ExploreScreen";
import { GrownSpaghettiScreen } from "./components/GrownSpaghettiScreen";
import { HomeScreen } from "./components/HomeScreen";
import { OfferScreen } from "./components/OfferScreen";
import { OscScreen } from "./components/OscScreen";
import { ProgressBar } from "./components/ProgressBar";
import { QuestionScreen } from "./components/QuestionScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { buildEvaluationContext } from "./lib/scoring";
import { generateSectionOutputs } from "./lib/outputGenerator";
import type { AnswersMap, FlowStep } from "./types/flow";

const PHASE_TOTAL = 5;

const NAV_HIDDEN = new Set<FlowStep["id"]>(["quiz", "results", "offer"]);

function stepAnimKey(step: FlowStep): string {
  switch (step.id) {
    case "home":
      return "home";
    case "osc":
      return "osc";
    case "club":
      return "club";
    case "grownSpaghetti":
      return "grownSpaghetti";
    case "customBuild":
      return "customBuild";
    case "accessRequest":
      return "accessRequest";
    case "explore":
      return "explore";
    case "quiz":
      return `quiz-${step.index}`;
    case "results":
      return "results";
    case "offer":
      return "offer";
  }
}

export default function App() {
  const [step, setStep] = useState<FlowStep>({ id: "home" });
  const [answers, setAnswers] = useState<AnswersMap>({});

  const sections = useMemo(() => {
    const ctx = buildEvaluationContext(answers);
    return generateSectionOutputs(ctx);
  }, [answers]);

  const showNav = !NAV_HIDDEN.has(step.id);

  function setAnswer(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function startDiagnostic() {
    setAnswers({});
    setStep({ id: "quiz", index: 0 });
  }

  function goAccess() {
    setStep({ id: "accessRequest" });
  }

  function openSubstack() {
    window.open(SUBSTACK_PLACEHOLDER_HREF, "_blank", "noopener,noreferrer");
  }

  function handleNav(action: NavAction) {
    switch (action.kind) {
      case "start":
        startDiagnostic();
        break;
      case "osc":
        setStep({ id: "osc" });
        break;
      case "club":
        setStep({ id: "club" });
        break;
      case "grownSpaghetti":
        setStep({ id: "grownSpaghetti" });
        break;
      case "customBuild":
        setStep({ id: "customBuild" });
        break;
    }
  }

  const entryLayout =
    step.id === "home" ||
    step.id === "osc" ||
    step.id === "grownSpaghetti" ||
    step.id === "customBuild" ||
    step.id === "accessRequest" ||
    step.id === "explore";

  return (
    <div className={`app ${showNav ? "app--with-nav" : ""}`.trim()}>
      <AppNav visible={showNav} onAction={handleNav} />

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

      <main className={`app-main ${entryLayout ? "app-main--entry" : ""}`.trim()}>
        {step.id === "home" ? (
          <HomeScreen
            animKey={stepAnimKey(step)}
            onStart={startDiagnostic}
            onRequestAccess={goAccess}
            onReadSubstack={openSubstack}
          />
        ) : null}

        {step.id === "osc" ? (
          <OscScreen animKey={stepAnimKey(step)} onRequestAccess={goAccess} />
        ) : null}

        {step.id === "club" ? (
          <ClubScreen animKey={stepAnimKey(step)} onRequestAccess={goAccess} />
        ) : null}

        {step.id === "grownSpaghetti" ? (
          <GrownSpaghettiScreen animKey={stepAnimKey(step)} />
        ) : null}

        {step.id === "customBuild" ? (
          <CustomBuildScreen animKey={stepAnimKey(step)} onRequestAccess={goAccess} />
        ) : null}

        {step.id === "accessRequest" ? (
          <AccessRequestScreen
            animKey={stepAnimKey(step)}
            onDone={() => setStep({ id: "home" })}
          />
        ) : null}

        {step.id === "explore" ? (
          <ExploreScreen
            animKey={stepAnimKey(step)}
            onRequestAccess={goAccess}
            onReadSubstack={openSubstack}
            onHome={() => setStep({ id: "home" })}
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
              setStep({ id: "explore" });
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
