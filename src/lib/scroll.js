// Every in-page jump goes through here, so they all move the same way: a slow
// start, a long glide, and a small springy overshoot as it lands. Scrolling
// (rather than jumping) lets every scroll-driven animation on the way play
// through instead of snapping to its end state.
import { SCROLL_EFFECTS_OK, headerOffset, prefersReducedMotion } from "../components/common/motion";

let lenis = null;
// true while a link-triggered jump is running, so section snapping stands aside
let navigating = false;

// App.js registers its Lenis instance; without one we fall back to the browser.
export const setLenis = (instance) => { lenis = instance; };

// ease in, glide, then settle past the target and spring back (a gentle
// easeInOutBack: 1.15 is how far it overshoots)
const swing = (t) => {
  const c1 = 1.15;
  const c2 = c1 * 1.525;
  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
};

export const scrollToY = (y) => {
  const target = Math.max(0, y);
  if (prefersReducedMotion() || !lenis) {
    window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return;
  }
  // longer trips take longer, so a jump down the whole page doesn't whip past
  const distance = Math.abs(target - window.scrollY);
  const duration = Math.min(3.2, Math.max(1.1, distance / 2600));
  navigating = true;
  lenis.scrollTo(target, { duration, easing: swing, lock: true, force: true, onComplete: () => { navigating = false; } });
};

// The top of a section as it sits in the page. Pinned sections are wrapped in
// a spacer and lock just below the top bar, so aim for the point where the
// pin starts, not the element's current position.
export const sectionTop = (id) => {
  const el = document.getElementById(id);
  if (!el) return null;
  const box = (el.closest(".pin-spacer") || el).getBoundingClientRect();
  const pinned = !!el.closest(".pin-spacer");
  return box.top + window.scrollY - (pinned ? headerOffset() : 0);
};

export const scrollToSection = (id) => {
  if (id === "home") { scrollToY(0); return; }
  const y = sectionTop(id);
  if (y !== null) scrollToY(y);
};

// ---------------------------------------------------------------------------
// Section snapping: the page moves section to section.
//
// Each section has a "free zone": the scroll range where you are reading it
// (a pinned section's whole pin, or a tall section's own height). Between
// free zones there is only a transition. As soon as you scroll into one, the
// page glides the rest of the way to the next section in that direction and
// lands, so a section is never left half on screen.
// Only the full-screen sections at the top jump. From the end of Projects on,
// the shorter sections (Skills, Contact) scroll normally.
const SECTIONS = ["home", "experience", "projects"];

const buildZones = () => {
  const header = headerOffset();
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  return SECTIONS.map((id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const box = (el.closest(".pin-spacer") || el).getBoundingClientRect();
    const top = box.top + window.scrollY;
    const start = id === "home" ? 0 : Math.max(0, top - header);
    const end = Math.max(start, Math.min(max, top + box.height - vh));
    return { id, start, end };
  }).filter(Boolean).concat({ id: "rest", start: 0, end: max, free: true });
};

export const initSectionSnap = (lenisInstance, ScrollTrigger) => {
  if (prefersReducedMotion() || !lenisInstance) return () => {};
  let zones = buildZones();
  let busy = false;
  const refresh = () => { zones = buildZones(); };
  ScrollTrigger.addEventListener("refresh", refresh);
  window.addEventListener("resize", refresh);

  // desktop only: on phones and tablets the page scrolls normally
  const desktop = window.matchMedia(SCROLL_EFFECTS_OK);
  const onScroll = (l) => {
    if (!desktop.matches || busy || navigating || !zones.length) return;
    const y = l.scroll;
    const dir = l.direction;
    if (!dir) return;
    // inside a section: scroll freely
    const last = zones[zones.length - 2];
    if (last && y > last.end - 2) return; // Skills and Contact: normal scrolling
    if (zones.some((z) => !z.free && y >= z.start - 2 && y <= z.end + 2)) return;
    // between sections: finish the trip in the direction you're going
    const real = zones.filter((z) => !z.free);
    const target = dir > 0
      ? real.find((z) => z.start > y)
      : [...real].reverse().find((z) => z.end < y);
    if (!target) return;
    const to = dir > 0 ? target.start : target.end;
    busy = true;
    const distance = Math.abs(to - y);
    lenisInstance.scrollTo(to, {
      duration: Math.min(1.8, Math.max(0.9, distance / 1400)),
      easing: (t) => 1 - Math.pow(1 - t, 4),
      lock: true,
      force: true,
      onComplete: () => { busy = false; },
    });
  };
  lenisInstance.on("scroll", onScroll);

  return () => {
    lenisInstance.off("scroll", onScroll);
    ScrollTrigger.removeEventListener("refresh", refresh);
    window.removeEventListener("resize", refresh);
  };
};
