import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  animKey: string;
};

export function ScreenShell({ children, className = "", animKey }: Props) {
  return (
    <div
      key={animKey}
      className={`screen-transition screen-shell ${className}`.trim()}
      role="region"
    >
      {children}
    </div>
  );
}
