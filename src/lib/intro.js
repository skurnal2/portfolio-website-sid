// The opening sequence. Every entrance on the first screen is timed from one
// moment: when the name's font is ready (or 1s at most), so nothing swaps
// font mid-reveal and nothing starts before the rest. Until then <html> has
// .intro-wait, which holds every CSS animation at its first frame.
let t0 = null;

export const introReady = new Promise((resolve) => {
  const open = () => {
    if (t0 !== null) return;
    t0 = performance.now();
    document.documentElement.classList.remove("intro-wait");
    resolve(t0);
  };
  const fonts = document.fonts && document.fonts.load
    ? Promise.all([document.fonts.load("1em Righteous"), document.fonts.load("300 1em Sora")])
    : Promise.resolve();
  fonts.then(open, open);
  setTimeout(open, 1000);
});

// seconds since the sequence began, or -1 before it has
export const introTime = () => (t0 === null ? -1 : (performance.now() - t0) / 1000);
