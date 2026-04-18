import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { postActionMomentCopy } from "../data/siteCopy";

const PostActionMomentContext = createContext<() => void>(() => {});

export function PostActionMomentProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    setOpen(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
      timeoutRef.current = null;
    }, 4200);
  }, []);

  return (
    <PostActionMomentContext.Provider value={trigger}>
      {children}
      {open ? (
        <div className="post-action-moment" role="status" aria-live="polite">
          <p className="post-action-moment-line">{postActionMomentCopy.line1}</p>
          <p className="post-action-moment-line post-action-moment-line--emph">{postActionMomentCopy.line2}</p>
        </div>
      ) : null}
    </PostActionMomentContext.Provider>
  );
}

export function usePostActionMoment() {
  return useContext(PostActionMomentContext);
}
