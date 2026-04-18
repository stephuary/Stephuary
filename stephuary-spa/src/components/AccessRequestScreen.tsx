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
  const [fixingNow, setFixingNow] = useState("");
  const [need, setNeed] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = fixingNow.trim();
    if (!trimmed) return;
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
        <h1 className="access-title">Request access</h1>
        {/*
          Internal — operator response flow (not shown to users):
          - What are you trying to fix?
          - What have you tried?
          - What's not working?
          - Confirm real issue
          - Then offer
        */}
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
          <label className="access-field access-field--prominent">
            <span className="access-label access-label--prominent">{accessRequestCopy.fixingLabel}</span>
            <textarea
              className="access-textarea access-textarea--prominent"
              name="fixing_now"
              value={fixingNow}
              onChange={(e) => setFixingNow(e.target.value)}
              rows={5}
              required
            />
          </label>
          <label className="access-field">
            <span className="access-label">Name</span>
            <input
              className="access-input"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="access-field">
            <span className="access-label">Email</span>
            <input
              className="access-input"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="access-field">
            <span className="access-label">What do you need?</span>
            <textarea
              className="access-textarea"
              name="need"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              rows={4}
            />
          </label>
          <div className="cta-row">
            <button type="submit" className="btn btn-primary btn-block">
              Request access
            </button>
          </div>
        </form>
      </ScrollReveal>
    </ScreenShell>
  );
}
