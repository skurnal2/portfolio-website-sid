import { useEffect, useRef, useState } from "react";

// Text that decodes into place: each character cycles through random glyphs,
// then settles, left to right. Hovering decodes it again.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/+&";

export default function ScrambleText({ text, delay = 0, duration = 1100, className, waitFor }) {
  const [shown, setShown] = useState(text);
  const frame = useRef(0);

  const run = (wait) => {
    cancelAnimationFrame(frame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(text); return; }
    const start = performance.now() + wait;
    const tick = (now) => {
      const p = Math.max(0, (now - start) / duration);
      if (p >= 1) { setShown(text); return; }
      const settled = Math.floor(p * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out += i < settled || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setShown(out);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    let live = true;
    // until it starts, show the scrambled text rather than the answer
    if (waitFor) {
      setShown(text.replace(/[^ ]/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]));
      waitFor.then(() => live && run(delay));
    } else run(delay);
    return () => { live = false; cancelAnimationFrame(frame.current); };
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={className} aria-label={text} onMouseEnter={() => run(0)}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
