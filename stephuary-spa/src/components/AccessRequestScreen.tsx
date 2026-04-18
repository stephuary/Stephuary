import { useState, type FormEvent } from "react";
import { usePostActionMoment } from "../context/PostActionMomentContext";
import {
  accessRequestCopy,
  accessRequestInternalFlow,
  applicationConfirmationCopy,
} from "../data/siteCopy";
import { ExclusionAuthorityBlock } from "./ExclusionAuthorityBlock";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  /** Internal routing only — sets hidden field for OS intake. */
  intent?: "os";
  /** Post-submit: same moment as home “Watch breakdown”. */
  onWatchBreakdown: () => void;
};

export function AccessRequestScreen({ animKey, intent, onWatchBreakdown }: Props) {
  const triggerPostAction = usePostActionMoment();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [investReady, setInvestReady] = useState<"" | "yes" | "no">("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    const a = q1.trim();
    const b = q2.trim();
    const c = q3.trim();
    if (!n || !em || !a || !b || !c) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return;
    triggerPostAction();
    setSent(true);
  }

  if (sent) {
    const c = applicationConfirmationCopy;
    return (
      <ScreenShell animKey={animKey} className="access-screen access-screen--confirm">
        <ScrollReveal className="access-block-reveal access-confirm">
          <div className="screen-copy-panel access-confirm-panel">
            <h1 className="access-confirm-headline">{c.headline}</h1>
            <p className="access-confirm-sub">{c.subtext}</p>
            {(c.reframeLine1 || c.reframeLine2) && (
              <section className="access-confirm-section" aria-label="Context">
                {c.reframeLine1 ? <p>{c.reframeLine1}</p> : null}
                {c.reframeLine2 ? <p>{c.reframeLine2}</p> : null}
              </section>
            )}
            <section className="access-confirm-section" aria-label="Next">
              <p>{c.expectationLine1}</p>
              <p>{c.expectationLine2}</p>
            </section>
            {(c.preframeLine1 || c.preframeLine2) && (
              <section className="access-confirm-section" aria-label="Scope">
                {c.preframeLine1 ? <p>{c.preframeLine1}</p> : null}
                {c.preframeLine2 ? <p>{c.preframeLine2}</p> : null}
              </section>
            )}
            <div className="access-confirm-optional">
              <p className="access-confirm-optional-lead">{c.optionalLead}</p>
              <button type="button" className="home-video-tease-btn" onClick={onWatchBreakdown}>
                {c.watchBreakdownCta}
              </button>
            </div>
            <p className="access-confirm-final">
              {c.finalLine1}
              <br />
              {c.finalLine2}
            </p>
          </div>
        </ScrollReveal>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell animKey={animKey} className="access-screen">
      <ScrollReveal className="access-block-reveal">
        <div className="screen-copy-panel access-form-panel">
        <h1 className="access-title">{accessRequestCopy.title}</h1>
        <div className="access-intro">
          <p className="access-lead">{accessRequestCopy.lead}</p>
          <p className="access-yes-prompt">{accessRequestCopy.answerYesPrompt}</p>
          <ul className="access-checklist">
            {accessRequestCopy.bullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="access-internal-flow" hidden aria-hidden="true">
          <span className="access-internal-flow-title">Conversation flow (internal)</span>
          <ol>
            {accessRequestInternalFlow.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
        <form className="access-form" onSubmit={handleSubmit}>
          {intent === "os" ? <input type="hidden" name="intent" value="OS inquiry" aria-hidden /> : null}
          <label className="access-field">
            <span className="access-label">{accessRequestCopy.labels.name}</span>
            <input
              className="access-input"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </label>
          <label className="access-field">
            <span className="access-label">{accessRequestCopy.labels.email}</span>
            <input
              className="access-input"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="access-field">
            <span className="access-label access-label--question">{accessRequestCopy.labels.q1}</span>
            <textarea
              className="access-textarea"
              name="revenue_focus"
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              rows={3}
              required
            />
          </label>
          <label className="access-field">
            <span className="access-label access-label--question">{accessRequestCopy.labels.q2}</span>
            <textarea
              className="access-textarea"
              name="blockers"
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              rows={3}
              required
            />
          </label>
          <label className="access-field">
            <span className="access-label access-label--question">{accessRequestCopy.labels.q3}</span>
            <textarea
              className="access-textarea"
              name="immediate_change"
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              rows={3}
              required
            />
          </label>
          <fieldset className="access-field access-invest">
            <legend className="access-invest-legend">{accessRequestCopy.labels.invest}</legend>
            <div className="access-radio-row">
              <label className="access-radio">
                <input
                  type="radio"
                  name="invest_ready"
                  value="yes"
                  checked={investReady === "yes"}
                  onChange={() => setInvestReady("yes")}
                />
                {accessRequestCopy.investYes}
              </label>
              <label className="access-radio">
                <input
                  type="radio"
                  name="invest_ready"
                  value="no"
                  checked={investReady === "no"}
                  onChange={() => setInvestReady("no")}
                />
                {accessRequestCopy.investNo}
              </label>
            </div>
          </fieldset>
          <p className="access-micro">
            {accessRequestCopy.microLine1}
            <br />
            {accessRequestCopy.microLine2}
          </p>
          <div className="cta-row">
            <button type="submit" className="btn btn-primary btn-block">
              {accessRequestCopy.cta}
            </button>
          </div>
        </form>
        <ExclusionAuthorityBlock className="exclusion-authority--access" />
        </div>
      </ScrollReveal>
    </ScreenShell>
  );
}
