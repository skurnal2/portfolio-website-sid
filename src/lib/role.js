// The hero title can come from the link: résumés link to
//   https://www.siddharthkurnal.com/?role=.NET+Full+Stack+Developer
// so the site greets a recruiter with the same title as the résumé they read.
// Anything unexpected falls back to the default; the value is only ever
// rendered as text.
export const DEFAULT_ROLE = "Experienced Full-Stack Developer";

export const readRole = () => {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  const raw = new URLSearchParams(window.location.search).get("role");
  if (!raw) return DEFAULT_ROLE;
  const clean = raw
    .replace(/[^A-Za-z0-9 .,&/+#()'-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  return clean.length >= 3 ? clean : DEFAULT_ROLE;
};
