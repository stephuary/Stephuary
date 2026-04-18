import type { SectionOutput } from "../lib/outputGenerator";

type Props = {
  section: SectionOutput;
};

export function ResultSection({ section }: Props) {
  if (section.id === "niche") {
    const line = section.lines[0] ?? "";
    return (
      <article className="result-section result-section--niche">
        <h3 className="result-section-title">{section.title}</h3>
        <p className="niche-sentence">{line}</p>
      </article>
    );
  }

  if (section.id === "first") {
    return (
      <article className="result-section result-section--first">
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
    <article className="result-section">
      <h3 className="result-section-title">{section.title}</h3>
      <ul className="result-section-list">
        {section.lines.map((line, i) => (
          <li key={`${section.id}-${i}`}>{line}</li>
        ))}
      </ul>
    </article>
  );
}
