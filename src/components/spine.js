import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import '../css/spine.scss';

gsap.registerPlugin(ScrollTrigger);

// The spine: one dotted line down the page, drawn as you scroll, with a hollow
// ring at each section. It is the resume's timeline, and it is also the
// navigation: the rings are the links and the filled one is where you are.
//
// The stops are found from the DOM rather than hard-coded, so adding a section
// to the page adds a ring without touching this file.
const STOPS = [
  { id: 'home', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const Spine = ({ onNavigate }) => {
  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const [stops, setStops] = useState([]);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Where each section sits as a fraction of the page, so a ring can sit at
    // the same fraction of the rail.
    const measure = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const found = STOPS.map((stop) => {
        const el = document.getElementById(stop.id);
        if (!el) return null;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return { ...stop, top, at: docHeight > 0 ? Math.min(1, top / docHeight) : 0 };
      }).filter(Boolean);
      setStops(found);
      return found;
    };

    // Pinned sections (Projects, Contact) add scroll length only once their
    // ScrollTriggers refresh, and images change heights as they load. Measure
    // after every refresh, never just once.
    let found = measure();
    const remeasure = () => { found = measure(); };
    ScrollTrigger.addEventListener('refresh', remeasure);
    window.addEventListener('load', () => ScrollTrigger.refresh());
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    const ctx = gsap.context(() => {
      // The coral fill is a clipped copy of the dotted line, so the line looks
      // drawn rather than recoloured.
      const trigger = ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        scrub: reduced ? false : 0.4,
        // refresh after every other trigger, once all the pins have added
        // their scroll length
        refreshPriority: -100,
        onUpdate: () => {
          // progress from the live page height, not a cached one: pinned
          // sections change how long the page is
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
          if (fillRef.current) fillRef.current.style.setProperty('--fill', p.toFixed(4));
          // the ring you are at, not the one you are heading to
          let i = 0;
          found.forEach((s, idx) => { if (p >= s.at - 0.02) i = idx; });
          setActive(i);
        },
      });
      return () => trigger.kill();
    }, rootRef);

    // one more pass once fonts and the other sections' triggers have settled
    const settle = setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      clearTimeout(settle);
      ScrollTrigger.removeEventListener('refresh', remeasure);
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div className="spine" ref={rootRef} aria-hidden={stops.length === 0}>
      <div className="spine-line" />
      <div className="spine-line spine-line-fill" ref={fillRef} />
      <div className="spine-stops" role="navigation" aria-label="Sections">
        {stops.map((stop, i) => (
          <button
            key={stop.id}
            type="button"
            className={`spine-stop${i === active ? ' is-active' : ''}${i < active ? ' is-passed' : ''}`}
            style={{ top: `${stop.at * 100}%` }}
            onClick={() => onNavigate?.(stop.id, stop.label)}
            aria-current={i === active ? 'true' : undefined}
          >
            <span className="spine-ring" />
            <span className="spine-label">{stop.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Spine;
