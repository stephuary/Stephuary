import { highTicketOfferCopy, highTicketSectionLabels } from "../data/siteCopy";
import { ScrollReveal } from "./ScrollReveal";
import { ScreenShell } from "./ScreenShell";

type Props = {
  animKey: string;
  onRequestAccess: () => void;
};

export function CustomBuildScreen({ animKey, onRequestAccess }: Props) {
  const t = highTicketOfferCopy;
  const L = highTicketSectionLabels;

  return (
    <ScreenShell animKey={animKey} className="eco-page eco-page--custom">
      <ScrollReveal className="eco-head-reveal">
        {t.headlineLead ? <p className="install-card-eyebrow eco-eyebrow">{t.headlineLead}</p> : null}
        <h1 className="eco-page-headline">{t.headline}</h1>
      </ScrollReveal>

      <ScrollReveal className="custom-build-block">
        <p className="tier-section-label">{L.whatIDo}</p>
        <ul className="tier-bullet-list">
          {t.whatIDo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ScrollReveal>

      <ScrollReveal className="custom-build-block">
        <p className="tier-section-label">{L.whatYouGet}</p>
        <ul className="tier-bullet-list">
          {t.whatYouGet.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ScrollReveal>

      <ScrollReveal className="custom-build-block">
        <p className="tier-section-label">{L.whatChanges}</p>
        <div className="tier-change-paragraphs">
          {t.whatChangesParagraphs.map((p) => (
            <p key={p} className="tier-outcome tier-outcome--para">
              {p}
            </p>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="custom-build-block">
        <p className="tier-section-label">{L.timeline}</p>
        <p className="tier-time tier-time--standalone">{t.time}</p>
      </ScrollReveal>

      <ScrollReveal className="custom-build-block">
        <p className="tier-section-label">{L.whoFor}</p>
        <ul className="tier-bullet-list tier-bullet-list--who">
          {t.whoFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ScrollReveal>

      <ScrollReveal className="custom-build-block">
        <p className="tier-section-label">{L.afterApply}</p>
        <ol className="tier-after-apply-list">
          <li>
            <strong>{L.reviewStep}.</strong> {t.afterApply.review}
          </li>
          <li>
            <strong>{L.decisionStep}.</strong> {t.afterApply.decision}
          </li>
          <li>
            <strong>{L.nextStep}.</strong> {t.afterApply.nextAction}
          </li>
        </ol>
      </ScrollReveal>

      <ScrollReveal className="eco-cta-reveal">
        <p className="custom-build-price">{t.price}</p>
        <div className="cta-row eco-page-cta">
          <button type="button" className="btn btn-primary btn-block" onClick={onRequestAccess}>
            {t.cta}
          </button>
        </div>
      </ScrollReveal>
    </ScreenShell>
  );
}
