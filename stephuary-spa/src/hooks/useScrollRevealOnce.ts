import { useEffect, useRef, useState } from "react";

function motionReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Fires once when element enters viewport; respects prefers-reduced-motion.
 */
export function useScrollRevealOnce<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(() =>
    typeof window !== "undefined" ? motionReduced() : false,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (motionReduced()) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, inView };
}
