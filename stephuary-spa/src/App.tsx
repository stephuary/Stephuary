import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePostActionMoment } from "./context/PostActionMomentContext";
import { SUBSTACK_PLACEHOLDER_HREF } from "./data/ecosystem";
import { brandIdentityCopy, resultsOfferBridgeCopy } from "./data/siteCopy";
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
import { ApplyQualifyModal } from "./components/ApplyQualifyModal";
import { DiagnosticExitModal } from "./components/DiagnosticExitModal";
import { QuestionScreen } from "./components/QuestionScreen";
import { RealizationMomentScreen } from "./components/RealizationMomentScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { resolveRecommendedTier } from "./lib/recommendedTier";
import { resolveClassificationLabels } from "./lib/classification";
import { buildEvaluationContext } from "./lib/scoring";
import { isSharedEntrySearch } from "./lib/shareEntry";
import type { AnswersMap, FlowStep } from "./types/flow";

const PHASE_TOTAL = 5;

/** After Q4 (index 3): full-screen realization before next question. */
const REALIZATION_AFTER_Q_INDEX = 3;

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
    case "realizationMoment":
      return "realizationMoment";
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
  const [installQualifyOpen, setInstallQualifyOpen] = useState(false);
  const [pendingAccessIntent, setPendingAccessIntent] = useState<"os" | undefined>();
  const [auraRoutePulse, setAuraRoutePulse] = useState(false);
  const skipAuraRoutePulse = useRef(true);
  const quizAdvanceLock = useRef(false);
  const quizMomentumTimer = useRef<number | null>(null);
  const [sharedEntry, setSharedEntry] = useState(false);

  const evaluationCtx = useMemo(() => buildEvaluationContext(answers), [answers]);

  const classificationLabels = useMemo(
    () => resolveClassificationLabels(evaluationCtx),
    [evaluationCtx],
  );

  const recommendedTier = useMemo(
    () => resolveRecommendedTier(evaluationCtx),
    [evaluationCtx],
  );

  useEffect(() => {
    if (step.id !== "quiz") setExitModalOpen(false);
  }, [step.id]);

  useEffect(() => {
    return () => {
      if (quizMomentumTimer.current !== null) {
        window.clearTimeout(quizMomentumTimer.current);
        quizMomentumTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (skipAuraRoutePulse.current) {
      skipAuraRoutePulse.current = false;
      return;
    }
    setAuraRoutePulse(true);
    const id = window.setTimeout(() => setAuraRoutePulse(false), 1400);
    return () => window.clearTimeout(id);
  }, [step]);

  const showNav = true;

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

  function closeInstallQualify() {
    setInstallQualifyOpen(false);
    setPendingAccessIntent(undefined);
  }

  function confirmInstallQualify() {
    const intent = pendingAccessIntent;
    triggerPostAction();
    closeInstallQualify();
    goAccess(intent);
  }

  function requestAccessWithMoment(intent?: "os") {
    triggerPostAction();
    setPendingAccessIntent(intent);
    setInstallQualifyOpen(true);
  }

  function openSubstack() {
    triggerPostAction();
    window.open(SUBSTACK_PLACEHOLDER_HREF, "_blank", "noopener,noreferrer");
  }

  const advanceQuizAfterMomentum = useCallback(() => {
    if (quizAdvanceLock.current) return;
    quizAdvanceLock.current = true;
    triggerPostAction();
    if (quizMomentumTimer.current !== null) window.clearTimeout(quizMomentumTimer.current);
    const delayMs = 120 + Math.floor(Math.random() * 61);
    quizMomentumTimer.current = window.setTimeout(() => {
      quizMomentumTimer.current = null;
      quizAdvanceLock.current = false;
      setStep((prev) => {
        if (prev.id !== "quiz") return prev;
        const last = prev.index >= QUESTIONS.length - 1;
        if (last) return { id: "results" };
        if (prev.index === REALIZATION_AFTER_Q_INDEX) return { id: "realizationMoment" };
        return { id: "quiz", index: prev.index + 1 };
      });
    }, delayMs);
  }, []);

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
    if (quizMomentumTimer.current !== null) {
      window.clearTimeout(quizMomentumTimer.current);
      quizMomentumTimer.current = null;
    }
    quizAdvanceLock.current = false;
    setStep({ id: "quiz", index: step.index - 1 });
  }

  function confirmExitDiagnostic() {
    setExitModalOpen(false);
    if (quizMomentumTimer.current !== null) {
      window.clearTimeout(quizMomentumTimer.current);
      quizMomentumTimer.current = null;
    }
    quizAdvanceLock.current = false;
    setAnswers({});
    setStep({ id: "home" });
  }

  return (
    <div
      className={`app ${showNav ? "app--with-nav" : ""} ${auraRoutePulse ? "app--aura-route" : ""}`.trim()}
    >
      <div className="aura-field" aria-hidden="true">
        <div className="aura-layer aura-layer--base" />
        <div className="aura-layer aura-layer--outer" />
        <div className="aura-layer aura-layer--mid" />
        <div className="aura-layer aura-layer--glow" />
        <div className="aura-grain" />
        <div className="aura-vignette" />
      </div>
      <AppNav visible={showNav} onAction={handleNav} />

      <DiagnosticExitModal
        open={exitModalOpen}
        onStay={() => setExitModalOpen(false)}
        onExit={confirmExitDiagnostic}
      />

      <ApplyQualifyModal
        open={installQualifyOpen}
        onClose={closeInstallQualify}
        onConfirm={confirmInstallQualify}
      />

      <main className={`app-main ${entryLayout ? "app-main--entry" : ""}`.trim()}>
        {step.id === "home" ? (
          <HomeScreen
            animKey={stepAnimKey(step)}
            onStart={startDiagnostic}
            onWatchBreakdown={triggerPostAction}
            sharedEntry={sharedEntry}
          />
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
            onContinue={advanceQuizAfterMomentum}
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

        {step.id === "realizationMoment" ? (
          <RealizationMomentScreen
            animKey={stepAnimKey(step)}
            onContinue={() => {
              triggerPostAction();
              setStep({ id: "quiz", index: REALIZATION_AFTER_Q_INDEX + 1 });
            }}
            onExitRequest={() => setExitModalOpen(true)}
          />
        ) : null}

        {step.id === "results" ? (
          <ResultsScreen
            animKey={stepAnimKey(step)}
            classificationLabels={classificationLabels}
            primaryCta={{
              label: resultsOfferBridgeCopy.cta,
              onClick: () => {
                triggerPostAction();
                try {
                  sessionStorage.setItem("stephuary-offer-scroll", "1");
                } catch {
                  /* ignore */
                }
                setStep({ id: "offer" });
              },
            }}
          />
        ) : null}

        {step.id === "offer" ? (
          <OfferScreen
            animKey={stepAnimKey(step)}
            recommendedTier={recommendedTier}
            signalCta={triggerPostAction}
            onPaidIntake={() => {
              triggerPostAction();
              requestAccessWithMoment();
            }}
            onRequestCustomBuild={() => {
              triggerPostAction();
              setStep({ id: "customBuild" });
            }}
          />
        ) : null}
      </main>

      <footer className="app-brand-footer">
        <p className="app-brand-name">{brandIdentityCopy.name}</p>
        <p className="app-brand-diagnostic">{brandIdentityCopy.diagnosticName}</p>
        <p className="app-brand-tagline">{brandIdentityCopy.tagline}</p>
      </footer>
    </div>
  );
}
