import { useScrollRevealOnce } from "../hooks/useScrollRevealOnce";
import type { SectionOutput } from "../lib/outputGenerator";

type Props = {
  section: SectionOutput;
};

export function ResultSection({ section }: Props) {
  const { ref, inView } = useScrollRevealOnce<HTMLElement>();
  const reveal = inView ? "scroll-reveal--in" : "";

  if (section.id === "niche") {
    return (
      <article
        ref={ref}
        className={`result-section result-section--niche scroll-reveal ${reveal}`.trim()}
      >
        <h3 className="result-section-title">{section.title}</h3>
        <div className="result-section-body">
          {section.insights.map((line, i) => (
            <p key={`${section.id}-in-${i}`} className="result-insight result-insight--lead">
              {line}
            </p>
          ))}
          {section.consequence ? (
            <p className="result-consequence">{section.consequence}</p>
          ) : null}
          {section.instruction ? (
            <p className="result-instruction">{section.instruction}</p>
          ) : null}
        </div>
      </article>
    );
  }

  if (section.id === "first") {
    return (
      <article
        ref={ref}
        className={`result-section result-section--first scroll-reveal ${reveal}`.trim()}
      >
        <h3 className="result-section-title">{section.title}</h3>
        <div className="result-section-body">
          {section.insights.map((line, i) => (
            <p key={`${section.id}-in-${i}`} className="result-insight">
              {line}
            </p>
          ))}
          {section.consequence ? (
            <p className="result-consequence">{section.consequence}</p>
          ) : null}
          {section.steps && section.steps.length > 0 ? (
            <ol className="steps-list steps-list--tight">
              {section.steps.map((line, i) => (
                <li key={`${section.id}-st-${i}`}>{line}</li>
              ))}
            </ol>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article
      ref={ref}
      className={`result-section scroll-reveal ${reveal}`.trim()}
    >
      <h3 className="result-section-title">{section.title}</h3>
      <div className="result-section-body">
        {section.insights.map((line, i) => (
          <p key={`${section.id}-in-${i}`} className="result-insight">
            {line}
          </p>
        ))}
        {section.consequence ? (
          <p className="result-consequence">{section.consequence}</p>
        ) : null}
        {section.instruction ? (
          <p className="result-instruction">{section.instruction}</p>
        ) : null}
      </div>
    </article>
  );
}
