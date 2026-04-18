import { exclusionAuthorityCopy } from "../data/siteCopy";

type Props = {
  className?: string;
};

export function ExclusionAuthorityBlock({ className }: Props) {
  const c = exclusionAuthorityCopy;
  return (
    <div className={`exclusion-authority ${className ?? ""}`.trim()} role="note">
      <p className="exclusion-authority-line">{c.line1}</p>
      <p className="exclusion-authority-line">{c.line2}</p>
    </div>
  );
}
