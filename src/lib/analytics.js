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
//   cube_drag          each time a cube is dragged (first 15) (cube: small / large, result: hit / miss)
//   section_time       seconds a section was on screen   (section, engaged_seconds)
//   time_on_page       30s / 1m / 2m / 5m of visible time (milestone)
//   email_copy         the email address was copied      (section)
//   form_abandon       form started, left unsent         (form, fields_filled)
//   web_vitals         real-visitor page speed           (metric_name, metric_value, metric_rating)
//   fur_quality        a slow device stepped the 3D fur down (level)
//   js_error           a script error, first few per page (message)
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
  trackTimeOnPage();
  trackCopies();
  trackErrors();
  trackVitals();
};

// Before the page goes away (tab closed, navigated off, app switched): the
// last moment to send totals. gtag sends these with sendBeacon.
export const onLeave = (fn) => {
  window.addEventListener("pagehide", fn);
  document.addEventListener("visibilitychange", () => { if (document.hidden) fn(); });
};

// Visible time on the page, in marks.
const trackTimeOnPage = () => {
  const marks = [30, 60, 120, 300];
  let seconds = 0;
  const timer = setInterval(() => {
    if (document.hidden) return;
    seconds += 1;
    marks.forEach((m) => { if (seconds >= m) trackOnce(`time:${m}`, "time_on_page", { milestone: m }); });
    if (seconds >= marks[marks.length - 1]) clearInterval(timer);
  }, 1000);
};

// Copying the email address (instead of clicking it) is still reaching out.
const trackCopies = () => {
  document.addEventListener("copy", () => {
    const text = String(window.getSelection?.() || "");
    if (!/@/.test(text)) return;
    const node = window.getSelection()?.anchorNode;
    const el = node && (node.nodeType === 1 ? node : node.parentElement);
    trackOnce("email_copy", "email_copy", { section: el ? sectionOf(el) : "unknown" });
  });
};

// A few script errors per page, so a browser the site breaks on shows up.
const trackErrors = () => {
  let count = 0;
  const report = (message) => {
    if (count >= 5 || !message) return;
    count += 1;
    trackOnce(`err:${message}`, "js_error", { message: String(message).slice(0, 100) });
  };
  window.addEventListener("error", (e) => report(e.message));
  window.addEventListener("unhandledrejection", (e) => report(e.reason?.message || e.reason));
};

// Real page speed from real devices (Core Web Vitals). Loaded after the page,
// so measuring never slows it down.
const trackVitals = () => {
  import("web-vitals").then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
    const send = (m) => track("web_vitals", {
      metric_name: m.name,
      metric_value: m.name === "CLS" ? Math.round(m.value * 1000) / 1000 : Math.round(m.value),
      metric_rating: m.rating,
    });
    [onCLS, onFCP, onINP, onLCP, onTTFB].forEach((on) => on(send));
  }).catch(() => {});
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
// Also times each one: seconds it held the middle of the screen while the
// tab was visible, sent as section_time when the visitor leaves.
export const trackSections = (ids) => {
  if (!("IntersectionObserver" in window)) return () => {};
  const inFocus = new Set();
  const seconds = new Map();
  const timer = setInterval(() => {
    if (document.hidden) return;
    inFocus.forEach((id) => seconds.set(id, (seconds.get(id) || 0) + 1));
  }, 1000);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const id = e.target.id;
      if (e.isIntersecting) {
        inFocus.add(id);
        if (id !== "home") trackOnce(`section:${id}`, "section_view", { section: id });
      } else inFocus.delete(id);
    });
  }, { rootMargin: "-33% 0px -33% 0px" });
  ["home", ...ids].map((id) => document.getElementById(id)).filter(Boolean).forEach((el) => io.observe(el));
  // send what's accumulated since the last send (the page can be hidden and shown again)
  const flush = () => {
    seconds.forEach((n, id) => {
      if (n >= 2) track("section_time", { section: id, engaged_seconds: n });
      seconds.set(id, 0);
    });
  };
  onLeave(flush);
  return () => { io.disconnect(); clearInterval(timer); };
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
