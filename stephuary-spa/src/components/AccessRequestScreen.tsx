import { useState, type FormEvent } from "react";
import { usePostActionMoment } from "../context/PostActionMomentContext";
import { accessRequestCopy, accessRequestInternalFlow } from "../data/siteCopy";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  /** Internal routing only — sets hidden field for OS intake. */
  intent?: "os";
  onDone: () => void;
};

export function AccessRequestScreen({ animKey, intent, onDone }: Props) {
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
    return (
      <ScreenShell animKey={animKey} className="access-screen">
        <ScrollReveal className="access-block-reveal">
          <p className="access-thanks">{accessRequestCopy.thanksLine1}</p>
          <p className="access-thanks-sub">{accessRequestCopy.thanksLine2}</p>
          <div className="cta-row">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {
                triggerPostAction();
                onDone();
              }}
            >
              Back
            </button>
          </div>
        </ScrollReveal>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell animKey={animKey} className="access-screen">
      <ScrollReveal className="access-block-reveal">
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
      </ScrollReveal>
    </ScreenShell>
  );
}
