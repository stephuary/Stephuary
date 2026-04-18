import { useScrollRevealOnce } from "../hooks/useScrollRevealOnce";
import type { SectionOutput } from "../lib/outputGenerator";

type Props = {
  section: SectionOutput;
};

export function ResultSection({ section }: Props) {
  const { ref, inView } = useScrollRevealOnce<HTMLElement>();
  const reveal = inView ? "scroll-reveal--in" : "";

  if (section.id === "niche") {
    const line = section.lines[0] ?? "";
    return (
      <article
        ref={ref}
        className={`result-section result-section--niche scroll-reveal ${reveal}`.trim()}
      >
        <h3 className="result-section-title">{section.title}</h3>
        <p className="niche-sentence">{line}</p>
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
        <ol className="steps-list">
          {section.lines.map((line, i) => (
            <li key={`${section.id}-${i}`}>{line}</li>
          ))}
        </ol>
      </article>
    );
  }

  return (
    <article
      ref={ref}
      className={`result-section scroll-reveal ${reveal}`.trim()}
    >
      <h3 className="result-section-title">{section.title}</h3>
      <ul className="result-section-list">
        {section.lines.map((line, i) => (
          <li key={`${section.id}-${i}`}>{line}</li>
        ))}
      </ul>
    </article>
  );
}
