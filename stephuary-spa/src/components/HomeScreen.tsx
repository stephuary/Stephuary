import { useCallback, useEffect, useRef, useState } from "react";
import { homeCopy } from "../data/siteCopy";
import { ScreenShell } from "./ScreenShell";

const HOME_CTA_IDLE_MS = 5000;

type Props = {
  animKey: string;
  onStart: () => void;
  sharedEntry?: boolean;
};

export function HomeScreen({ animKey, onStart, sharedEntry = false }: Props) {
  const h = homeCopy;
  const [ctaIdleAttention, setCtaIdleAttention] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const scheduleIdleAttention = useCallback(() => {
    clearIdleTimer();
    setCtaIdleAttention(false);
    idleTimerRef.current = window.setTimeout(() => {
      idleTimerRef.current = null;
      setCtaIdleAttention(true);
    }, HOME_CTA_IDLE_MS);
  }, [clearIdleTimer]);

  useEffect(() => {
    scheduleIdleAttention();
    const onActivity = () => scheduleIdleAttention();
    window.addEventListener("mousemove", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener("touchstart", onActivity, { passive: true });
    window.addEventListener("scroll", onActivity, { passive: true });
    return () => {
      clearIdleTimer();
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("touchstart", onActivity);
      window.removeEventListener("scroll", onActivity);
    };
  }, [animKey, scheduleIdleAttention, clearIdleTimer]);

  return (
    <ScreenShell animKey={animKey} className="home-screen">
      <div className="home-inner home-inner--entrance">
        <div className="home-copy-panel screen-copy-panel">
          <div className="home-hero">
            <div className="home-hero-copy">
              <h1 className="home-headline">{h.headline}</h1>
              <div className="home-support-block">
                {h.supportLines.map((line) => (
                  <p key={line} className="home-support-line">
                    {line}
                  </p>
                ))}
              </div>
              {sharedEntry ? (
                <p className="home-shared-entry-hint" role="note">
                  {h.sharedEntryLine}
                </p>
              ) : null}
            </div>
          </div>
          <div
            className={`cta-row home-primary-cta ${ctaIdleAttention ? "home-primary-cta--idle-attention" : ""}`.trim()}
          >
            <button type="button" className="btn btn-primary btn-block" onClick={onStart}>
              {h.cta}
            </button>
          </div>
          <div className="home-cta-frame" role="note">
            {h.ctaFrameLines.map((line) => (
              <p key={line} className="home-cta-frame-line">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
