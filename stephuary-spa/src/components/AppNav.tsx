export type NavAction =
  | { kind: "start" }
  | { kind: "osc" }
  | { kind: "club" }
  | { kind: "customBuild" };

type Props = {
  visible: boolean;
  onAction: (a: NavAction) => void;
};

export function AppNav({ visible, onAction }: Props) {
  if (!visible) return null;

  return (
    <nav className="app-nav" aria-label="Site">
      <div className="app-nav-inner">
        <button type="button" className="app-nav-link" onClick={() => onAction({ kind: "start" })}>
          Start
        </button>
        <button type="button" className="app-nav-link" onClick={() => onAction({ kind: "osc" })}>
          Only Sometimes Club
        </button>
        <button type="button" className="app-nav-link" onClick={() => onAction({ kind: "club" })}>
          .5% Club
        </button>
        <button type="button" className="app-nav-link" onClick={() => onAction({ kind: "customBuild" })}>
          Custom Build
        </button>
      </div>
    </nav>
  );
}
