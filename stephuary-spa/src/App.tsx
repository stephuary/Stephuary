import { useEffect, useMemo, useRef, useState } from "react";
import { usePostActionMoment } from "./context/PostActionMomentContext";
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
import { OperatorOSScreen } from "./components/OperatorOSScreen";
import { OscScreen } from "./components/OscScreen";
import { DiagnosticExitModal } from "./components/DiagnosticExitModal";
import { QuestionScreen } from "./components/QuestionScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { shouldShowHighTicketAccess } from "./lib/highTicketSignals";
import { shouldShowOperatorOSGate } from "./lib/operatorOSSignals";
import { resolveRecommendedTier } from "./lib/recommendedTier";
import { buildEvaluationContext } from "./lib/scoring";
import { generateSectionOutputs } from "./lib/outputGenerator";
import type { AnswersMap, FlowStep } from "./types/flow";

const PHASE_TOTAL = 5;

const NAV_HIDDEN = new Set<FlowStep["id"]>(["quiz", "results", "offer", "operatorOS"]);

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
    case "operatorOS":
      return "operatorOS";
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
  const triggerPostAction = usePostActionMoment();
  const [step, setStep] = useState<FlowStep>({ id: "home" });
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [auraRoutePulse, setAuraRoutePulse] = useState(false);
  const skipAuraRoutePulse = useRef(true);

  const evaluationCtx = useMemo(() => buildEvaluationContext(answers), [answers]);

  const sections = useMemo(
    () => generateSectionOutputs(evaluationCtx),
    [evaluationCtx],
  );

  const recommendedTier = useMemo(
    () => resolveRecommendedTier(evaluationCtx),
    [evaluationCtx],
  );

  const showHighTicketAccess = useMemo(
    () => shouldShowHighTicketAccess(evaluationCtx),
    [evaluationCtx],
  );

  const showOperatorOSGate = useMemo(
    () => shouldShowOperatorOSGate(evaluationCtx),
    [evaluationCtx],
  );

  useEffect(() => {
    if (step.id !== "quiz") setExitModalOpen(false);
  }, [step.id]);

  useEffect(() => {
    if (skipAuraRoutePulse.current) {
      skipAuraRoutePulse.current = false;
      return;
    }
    setAuraRoutePulse(true);
    const id = window.setTimeout(() => setAuraRoutePulse(false), 1400);
    return () => window.clearTimeout(id);
  }, [step]);

  const showNav = !NAV_HIDDEN.has(step.id);

  function setAnswer(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function startDiagnostic() {
    triggerPostAction();
    setAnswers({});
    setStep({ id: "quiz", index: 0 });
  }

  function goAccess(intent?: "os") {
    if (intent === "os") {
      setStep({ id: "accessRequest", intent: "os" });
    } else {
      setStep({ id: "accessRequest" });
    }
  }

  function requestAccessWithMoment(intent?: "os") {
    triggerPostAction();
    goAccess(intent);
  }

  function openSubstack() {
    triggerPostAction();
    window.open(SUBSTACK_PLACEHOLDER_HREF, "_blank", "noopener,noreferrer");
  }

  function handleNav(action: NavAction) {
    triggerPostAction();
    switch (action.kind) {
      case "start":
        setAnswers({});
        setStep({ id: "quiz", index: 0 });
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
    step.id === "operatorOS" ||
    step.id === "explore";

  function backQuestion() {
    if (step.id !== "quiz" || step.index <= 0) return;
    setStep({ id: "quiz", index: step.index - 1 });
  }

  function confirmExitDiagnostic() {
    setExitModalOpen(false);
    setAnswers({});
    setStep({ id: "home" });
  }

  return (
    <div
      className={`app ${showNav ? "app--with-nav" : ""} ${auraRoutePulse ? "app--aura-route" : ""}`.trim()}
    >
      <div className="aura-field" aria-hidden="true">
        <div className="aura-layer aura-layer--core" />
        <div className="aura-layer aura-layer--halo" />
        <div className="aura-depth" />
        <div className="aura-grain" />
        <div className="aura-vignette" />
      </div>
      <AppNav visible={showNav} onAction={handleNav} />

      <DiagnosticExitModal
        open={exitModalOpen}
        onStay={() => setExitModalOpen(false)}
        onExit={confirmExitDiagnostic}
      />

      <main className={`app-main ${entryLayout ? "app-main--entry" : ""}`.trim()}>
        {step.id === "home" ? (
          <HomeScreen animKey={stepAnimKey(step)} onStart={startDiagnostic} onWatchBreakdown={triggerPostAction} />
        ) : null}

        {step.id === "osc" ? (
          <OscScreen animKey={stepAnimKey(step)} onRequestAccess={() => requestAccessWithMoment()} />
        ) : null}

        {step.id === "club" ? (
          <ClubScreen animKey={stepAnimKey(step)} onRequestAccess={() => requestAccessWithMoment()} />
        ) : null}

        {step.id === "grownSpaghetti" ? (
          <GrownSpaghettiScreen animKey={stepAnimKey(step)} />
        ) : null}

        {step.id === "customBuild" ? (
          <CustomBuildScreen animKey={stepAnimKey(step)} onRequestAccess={() => requestAccessWithMoment()} />
        ) : null}

        {step.id === "accessRequest" ? (
          <AccessRequestScreen
            animKey={stepAnimKey(step)}
            intent={step.intent === "os" ? "os" : undefined}
            onWatchBreakdown={triggerPostAction}
          />
        ) : null}

        {step.id === "operatorOS" ? (
          <OperatorOSScreen
            animKey={stepAnimKey(step)}
            onRequestAccess={() => requestAccessWithMoment("os")}
          />
        ) : null}

        {step.id === "explore" ? (
          <ExploreScreen
            animKey={stepAnimKey(step)}
            onRequestAccess={() => requestAccessWithMoment()}
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
              triggerPostAction();
              const last = step.index >= QUESTIONS.length - 1;
              if (last) setStep({ id: "results" });
              else setStep({ id: "quiz", index: step.index + 1 });
            }}
            onBack={backQuestion}
            canGoBack={step.index > 0}
            onExitRequest={() => setExitModalOpen(true)}
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
              onClick: () => {
                triggerPostAction();
                setStep({ id: "offer" });
              },
            }}
          />
        ) : null}

        {step.id === "offer" ? (
          <OfferScreen
            animKey={stepAnimKey(step)}
            recommendedTier={recommendedTier}
            showOperatorOSGate={showOperatorOSGate}
            showHighTicketAccess={showHighTicketAccess}
            onRequestOperatorOS={() => setStep({ id: "operatorOS" })}
            onRequestCustomBuild={() => setStep({ id: "customBuild" })}
            onRequestOsc={() => setStep({ id: "osc" })}
            onPostOfferAccess={goAccess}
            signalCta={triggerPostAction}
            onComplete={() => {
              setStep({ id: "explore" });
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
