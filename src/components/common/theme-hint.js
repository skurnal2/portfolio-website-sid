import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faXmark } from "@fortawesome/free-solid-svg-icons";
import { setRandomTheme } from "./colors";
import "../../css/theme-hint.scss";

// A one-time nudge toward the theme button: desktop only, first visit only.
// It appears after a few seconds and leaves on its own unless the visitor
// is hovering it.
const SEEN_KEY = "themeHintSeen";
const SHOW_AFTER = 5000;
const STAY_FOR = 6000;
const STAY_AFTER_HOVER = 2500;
const DESKTOP = "(min-width: 1025px) and (hover: hover) and (pointer: fine)";

const seen = () => {
  try { return window.localStorage.getItem(SEEN_KEY) === "1"; } catch { return false; }
};
const markSeen = () => {
  try { window.localStorage.setItem(SEEN_KEY, "1"); } catch { /* private mode: it just shows again */ }
};

const ThemeHint = () => {
  const [open, setOpen] = useState(false);
  const hideTimer = useRef(0);

  const close = () => {
    clearTimeout(hideTimer.current);
    setOpen(false);
  };
  const hideIn = (ms) => {
    clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setOpen(false), ms);
  };

  useEffect(() => {
    if (seen() || !window.matchMedia(DESKTOP).matches) return undefined;
    const button = document.getElementById("theme-info-popup");
    // someone who finds the button first doesn't need the hint
    let used = false;
    const onUse = () => { used = true; markSeen(); close(); };
    button?.addEventListener("click", onUse);
    const showTimer = window.setTimeout(() => {
      if (used) return;
      markSeen();
      setOpen(true);
      hideIn(STAY_FOR);
    }, SHOW_AFTER);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer.current);
      button?.removeEventListener("click", onUse);
    };
  }, []);

  // the theme button pulses while the hint points at it
  useEffect(() => {
    document.getElementById("theme-info-popup")?.classList.toggle("is-hinted", open);
  }, [open]);

  return (
    <div
      className={`theme-hint${open ? " is-open" : ""}`}
      role="status"
      aria-hidden={!open}
      onMouseEnter={() => clearTimeout(hideTimer.current)}
      onMouseLeave={() => open && hideIn(STAY_AFTER_HOVER)}
    >
      <button
        type="button"
        className="theme-hint-body"
        tabIndex={open ? 0 : -1}
        onClick={() => { setRandomTheme(); close(); }}
      >
        <span className="theme-hint-icon"><FontAwesomeIcon icon={faPalette} /></span>
        <span className="theme-hint-text">
          <b>Try another colour theme</b>
          <span>Click here, or the button below, to shuffle it.</span>
        </span>
      </button>
      <button type="button" className="theme-hint-close" tabIndex={open ? 0 : -1} aria-label="Dismiss" onClick={close}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
};

export default ThemeHint;
