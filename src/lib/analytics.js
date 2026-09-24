// Google Analytics 4, in one place.
//
// What gets recorded (all anonymous; nothing typed into the contact form is sent):
//   page_view          once per load, with the full address (including ?ref=)
//   resume_link_open   someone arrived from a resume or cover letter link:
//                      app_ref = the application's id (Jobs repo, builder/ref.mjs),
//                      doc = "resume" or "cover_letter"
//   section_view       a section came into view        (section)
//   role_view          an Experience role was shown     (role)
//   project_view       a project card was shown         (project)
//   scroll_depth       25 / 50 / 75 / 100% of the page  (percent)
//   nav_click          in-page navigation               (link_id)
//   outbound_click     a link off the site              (link_id, link_url, section)
//   email_click        the mailto link                  (section)
//   form_start / generate_lead / form_error            the contact form
//   theme_change       the theme button                  (theme)
//   theme_hint         the first-visit hint              (action)
//   cube_drag          someone played with the hero cubes
//
// An arrival's app_ref is also set as a user property and on every later
// event, so everything that visitor does counts toward that application,
// including return visits (it's remembered in localStorage).
//
// Nothing is sent from localhost unless the address has ?ga_debug, which
// also turns on GA's DebugView.
import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-VV8X7KDEV9";
// same alphabet and length as the Jobs repo's builder/ref.mjs
const REF_PATTERN = /^[abcdefghjkmnpqrstuvwxyz23456789]{7}$/;
const REF_KEY = "appRef";
const OPENED_KEY = "appRefOpened";

let enabled = false;
const sent = new Set();

const store = (kind) => {
  try { return window[kind]; } catch { return null; }
};
const read = (kind, key) => {
  try { return store(kind)?.getItem(key) ?? null; } catch { return null; }
};
const write = (kind, key, value) => {
  try { store(kind)?.setItem(key, value); } catch { /* storage blocked: fine */ }
};

export const initAnalytics = () => {
  if (enabled || typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const debug = params.has("ga_debug");
  const local = /^(localhost|127\.|0\.0\.0\.0|\[::1\]|192\.168\.)/.test(window.location.hostname);
  if (local && !debug) return;

  const fromLink = params.get("ref");
  const ref = REF_PATTERN.test(fromLink || "") ? fromLink : read("localStorage", REF_KEY);
  const doc = params.get("d") === "cl" ? "cover_letter" : "resume";

  // page_view is sent by hand below, once, so it isn't counted twice
  ReactGA.initialize(MEASUREMENT_ID, {
    gtagOptions: { send_page_view: false, ...(debug ? { debug_mode: true } : {}) },
  });
  enabled = true;

  if (ref) {
    write("localStorage", REF_KEY, ref);
    ReactGA.gtag("set", "user_properties", { app_ref: ref });
    ReactGA.gtag("set", { app_ref: ref });
  }
  ReactGA.gtag("event", "page_view", {
    page_location: window.location.href,
    page_title: document.title,
  });
  // counted once per visit, even if the page is reloaded
  if (fromLink && REF_PATTERN.test(fromLink) && read("sessionStorage", OPENED_KEY) !== fromLink) {
    write("sessionStorage", OPENED_KEY, fromLink);
    track("resume_link_open", { app_ref: fromLink, doc });
  }

  trackLinks();
  trackScrollDepth();
};

export const track = (name, params = {}) => {
  if (!enabled) return;
  ReactGA.gtag("event", name, params);
};

// the same thing is only worth recording once per page load
export const trackOnce = (key, name, params) => {
  if (!enabled || sent.has(key)) return;
  sent.add(key);
  track(name, params);
};

// Recorded only if it's still showing after `ms`: a card someone scrolled
// straight past isn't one they looked at. Each group (e.g. "project") has one
// pending item at a time; showing another replaces it.
const pending = new Map();
export const trackDwell = (group, key, name, params, ms = 1000) => {
  const cur = pending.get(group);
  if (cur && cur.key === key) return; // same item still showing: keep its clock running
  if (cur) clearTimeout(cur.timer);
  if (sent.has(key)) { pending.delete(group); return; }
  pending.set(group, { key, timer: setTimeout(() => { pending.delete(group); trackOnce(key, name, params); }, ms) });
};

// the section a clicked element sits in, for context
const sectionOf = (el) => el.closest("section[id], main[id]")?.id || "header";

// One listener for every link: outbound links and the mailto link.
const trackLinks = () => {
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");
    const label = (a.dataset.track || a.getAttribute("aria-label") || a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
    if (href.startsWith("mailto:")) {
      track("email_click", { section: sectionOf(a) });
      return;
    }
    let url;
    try { url = new URL(href, window.location.href); } catch { return; }
    if (url.hostname && url.hostname !== window.location.hostname) {
      track("outbound_click", { link_id: label, link_url: url.href, section: sectionOf(a) });
    }
  }, { capture: true });
};

// How far down the page people get.
const trackScrollDepth = () => {
  const marks = [25, 50, 75, 100];
  let raf = 0;
  const check = () => {
    raf = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const pct = (window.scrollY / max) * 100;
    marks.forEach((m) => { if (pct >= m - 1) trackOnce(`depth:${m}`, "scroll_depth", { percent: m }); });
  };
  window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(check); }, { passive: true });
};

// Sections: recorded once each, when at least a third of the screen shows them.
// (Watchers set up before initAnalytics runs, since React sets children up
// first; sending stays off until then, and on localhost.)
export const trackSections = (ids) => {
  if (!("IntersectionObserver" in window)) return () => {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) trackOnce(`section:${e.target.id}`, "section_view", { section: e.target.id });
    });
  }, { rootMargin: "-33% 0px -33% 0px" });
  ids.map((id) => document.getElementById(id)).filter(Boolean).forEach((el) => io.observe(el));
  return () => io.disconnect();
};

// Items in a list (phone layout): each recorded once it has been mostly on
// screen for a second.
export const trackItems = (elements, toEvent, ms = 1000) => {
  if (!("IntersectionObserver" in window)) return () => {};
  const timers = new Map();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      clearTimeout(timers.get(e.target));
      if (!e.isIntersecting) return;
      const [key, name, params] = toEvent(e.target);
      timers.set(e.target, setTimeout(() => trackOnce(key, name, params), ms));
    });
  }, { threshold: 0.6 });
  elements.forEach((el) => io.observe(el));
  return () => { io.disconnect(); timers.forEach(clearTimeout); };
};

// Is this element on screen right now (a pinned section's current item)?
export const onScreen = (el) => {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * 0.66 && r.bottom > window.innerHeight * 0.33;
};
