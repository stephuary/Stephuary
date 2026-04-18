import { useCallback, useEffect, useRef, useState } from "react";
import { homeCopy } from "../data/siteCopy";
import { ScreenShell } from "./ScreenShell";

const HOME_CTA_IDLE_MS = 5000;

type Props = {
  animKey: string;
  onStart: () => void;
  onWatchBreakdown: () => void;
};

export function HomeScreen({ animKey, onStart, onWatchBreakdown }: Props) {
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
        <div className="home-hero">
          <div className="home-hero-copy">
            <h1 className="home-headline">{h.headline}</h1>
            <p className="home-subtext">{h.subtext}</p>
            <div className="home-shows" role="note">
              <p className="home-shows-lead">{h.showsLead}</p>
              {h.showsLines.map((line) => (
                <p key={line} className="home-shows-line">
                  {line}
                </p>
              ))}
            </div>
            <p className="home-body-tension">{h.bodyTension}</p>
          </div>
        </div>
        <div
          className={`cta-row home-primary-cta ${ctaIdleAttention ? "home-primary-cta--idle-attention" : ""}`.trim()}
        >
          <button type="button" className="btn btn-primary btn-block" onClick={onStart}>
            {h.cta}
          </button>
        </div>
        <div className="home-video-tease" role="note">
          <button type="button" className="home-video-tease-btn" onClick={onWatchBreakdown}>
            {h.videoTeaseCta}
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
