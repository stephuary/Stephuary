import { Fragment } from "react";
import { useScrollRevealOnce } from "../hooks/useScrollRevealOnce";
import type { SectionOutput } from "../lib/outputGenerator";

type Props = {
  section: SectionOutput;
};

function EmphasisParts({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="result-emphasis">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function ResultSection({ section }: Props) {
  const { ref, inView } = useScrollRevealOnce<HTMLElement>();
  const reveal = inView ? "scroll-reveal--in" : "";
  const niche = section.id === "niche";
  const insightClass = niche ? "result-insight result-insight--lead" : "result-insight";

  return (
    <article
      ref={ref}
      className={`result-section ${niche ? "result-section--niche" : ""} scroll-reveal ${reveal}`.trim()}
    >
      <h3 className="result-section-title">{section.title}</h3>
      <div className="result-section-body">
        {section.insights.map((line, i) => (
          <p key={`${section.id}-in-${i}`} className={`${insightClass} result-observation`}>
            <span className="result-observation-mark" aria-hidden>
              →{" "}
            </span>
            <EmphasisParts text={line} />
          </p>
        ))}
        {section.consequence ? (
          <p className="result-consequence result-observation">
            <span className="result-observation-mark" aria-hidden>
              →{" "}
            </span>
            <EmphasisParts text={section.consequence} />
          </p>
        ) : null}
        {section.instruction ? (
          <p className="result-instruction result-observation">
            <span className="result-observation-mark" aria-hidden>
              →{" "}
            </span>
            <EmphasisParts text={section.instruction} />
          </p>
        ) : null}
      </div>
    </article>
  );
}
