// Central place for the media queries that decide whether motion runs.
//
// CSS handles its own animations through `@media (prefers-reduced-motion)`,
// but GSAP and Lenis are JavaScript and have to be gated explicitly. Passing
// these strings to `gsap.matchMedia()` also means GSAP reverts every inline
// style it set when a query stops matching (rotating a phone, resizing a
// window, changing the OS motion setting), which is what lets the CSS
// fallback layouts take over cleanly.

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

// Decorative entrance animations: fine at any width, but not if the user has
// asked for less motion.
export const ANIMATION_OK = '(prefers-reduced-motion: no-preference)';

// Pinned, scroll-scrubbed sections. These hijack the scroll and only make
// sense on a wide viewport; on a phone they trap the reader in an 80vh box.
// Must stay in step with $bp-mobile in src/css/_variables.scss.
export const SCROLL_EFFECTS_OK =
    '(min-width: 1025px) and (prefers-reduced-motion: no-preference)';

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(REDUCED_MOTION).matches;
