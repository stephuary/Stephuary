/** Detect inbound shared links (?from=share, etc.). No server round-trip. */
export function isSharedEntrySearch(search: string): boolean {
  const q = search.startsWith("?") ? search.slice(1) : search;
  const p = new URLSearchParams(q);
  const g = (key: string) => (p.get(key) ?? "").toLowerCase();
  if (g("from") === "share") return true;
  if (g("via") === "share") return true;
  if (g("ref") === "share") return true;
  if (p.get("s") === "1") return true;
  return false;
}

/** Ensures copied links tag the recipient entry for the home hint + loop. */
export function buildShareablePageUrl(href: string): string {
  try {
    const u = new URL(href);
    u.searchParams.set("from", "share");
    return u.toString();
  } catch {
    return href;
  }
}
