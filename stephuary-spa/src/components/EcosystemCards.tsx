import { ecosystemCards } from "../data/ecosystem";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  onRequestAccess: () => void;
  onReadSubstack: () => void;
};

export function EcosystemCards({ onRequestAccess, onReadSubstack }: Props) {
  return (
    <div className="ecosystem-cards">
      {ecosystemCards.map((card) => (
        <ScrollReveal key={card.id} className="ecosystem-card-reveal">
          <div className="ecosystem-card">
            <h3 className="ecosystem-card-title">{card.title}</h3>
            <p className="ecosystem-card-desc">{card.descriptor}</p>
            {card.action === "read_substack" ? (
              <button
                type="button"
                className="btn btn-secondary btn-block ecosystem-card-btn"
                onClick={onReadSubstack}
              >
                {card.cta}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-block ecosystem-card-btn"
                onClick={onRequestAccess}
              >
                {card.cta}
              </button>
            )}
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
