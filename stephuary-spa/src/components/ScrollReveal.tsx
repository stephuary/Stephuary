import type { ReactNode } from "react";
import { useScrollRevealOnce } from "../hooks/useScrollRevealOnce";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Presentation-only wrapper for one-time scroll fade-in. */
export function ScrollReveal({ children, className = "" }: Props) {
  const { ref, inView } = useScrollRevealOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`scroll-reveal ${inView ? "scroll-reveal--in" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
