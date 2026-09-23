import React, { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { scrollToSection } from "../../lib/scroll";
import { readRole } from "../../lib/role";
import { introReady } from "../../lib/intro";
import ScrambleText from "../scramble-text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop, faServer, faDatabase, faCloud, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
// nav styles arrive with global.scss, which App.js loads first
import '../../css/home-page.scss';

//Component Imports
import Experience from "../sections/experience";
import Skills from "../sections/skills";
import Projects from "../sections/projects";
import Contact from "../sections/contact";

// one span per letter, numbered for the staggered wave
const letters = (word, offset) => word.split("").map((ch, i) => (
  <span className="nl" aria-hidden="true" key={i} style={{ "--i": i + offset }}>{ch}</span>
));

// He works across the whole stack rather than claiming one specialty, so the
// hero cycles through the layers instead of naming a framework.
const LAYERS = [
  { word: 'front ends', label: 'Front end', icon: faDesktop },
  { word: 'APIs and services', label: 'Back end', icon: faServer },
  { word: 'databases', label: 'Database', icon: faDatabase },
  { word: 'cloud deploys', label: 'Cloud', icon: faCloud },
  { word: 'AI features', label: 'AI', icon: faWandMagicSparkles },
];

// Three.js is only fetched once the page is idle, so it never delays the first paint.
const FurCubes = lazy(() => import("../fur-cubes"));

const HomePage = () => {
  const [showFur, setShowFur] = useState(false);
  useEffect(() => {
    const go = () => setShowFur(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(go, { timeout: 500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(go, 200);
    return () => clearTimeout(t);
  }, []);

  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const [role] = useState(readRole);
  useEffect(() => { document.title = `Siddharth Kurnal | ${role}`; }, [role]);

  // Name: letters flip up into place in 3D, then keep a slow wave (CSS);
  // the whole name drifts a little against the pointer for depth.
  useLayoutEffect(() => {
    const root = nameRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = gsap.context(() => {
      const nl = root.querySelectorAll(".nl");
      // Each letter tips up from its baseline. The perspective scales with
      // the type, so the huge desktop letters tip as gently as phone ones.
      const size = parseFloat(getComputedStyle(root.querySelector("h2")).fontSize) || 100;
      gsap.set(nl, { yPercent: 60, rotateX: -65, opacity: 0, transformPerspective: size * 7, transformOrigin: "50% 100%" });
      introReady.then(() => ctx.add(() => gsap.to(nl,
        { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1, stagger: 0.05, ease: "power3.out", delay: 0.3 })));
    }, root);
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--px", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        root.style.setProperty("--py", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { ctx.revert(); cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);
  const [layer, setLayer] = useState(0);

  // Slot-machine word swap, one layer at a time, with the matching pill lit.
  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.hero-word', root);
      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.set(words[0], { yPercent: 0, opacity: 1 });
      const tl = gsap.timeline({ repeat: -1, delay: 2.6, paused: true });

      words.forEach((w, i) => {
        const next = words[(i + 1) % words.length];
        tl.to(w, { yPercent: -110, opacity: 0, duration: 0.55, ease: 'power3.in' }, '+=1.9')
          .call(() => setLayer((i + 1) % words.length))
          .fromTo(next, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.8)', immediateRender: false }, '<+0.1');
      });
      // building the loop mustn't hide the first word; it shows until the first swap
      gsap.set(words[0], { yPercent: 0, opacity: 1 });
      introReady.then(() => tl.play());
    }, root);
    return () => ctx.revert();
  }, []);


  return (
    <div>
      <main id="home" ref={heroRef}>
        <div id="name-container" ref={nameRef}>
          <h2 className="first-h2" aria-label="Siddharth">{letters("SIDDHARTH", 0)}</h2>
          <h2 className="second-h2" aria-label="Kurnal">{letters("KURNAL", 9)}</h2>
          <h3 style={{ "--len": role.length }}><ScrambleText text={role} delay={1000} waitFor={introReady} /></h3>
          <div className="circle" />
          <div className="circle" />
          {showFur && <Suspense fallback={null}><FurCubes /></Suspense>}
        </div>
        <div className="hero-extra">
          <p className="hero-line">
            I build{' '}
            <span className="hero-rotator" aria-live="polite">
              {LAYERS.map((l, i) => (
                <span className="hero-word" key={l.word} aria-hidden={i !== layer}>{l.word}</span>
              ))}
            </span>
          </p>
          <p className="hero-sub">Six years working across the whole stack, from the interface down to the database.</p>
          <ul className="hero-layers" aria-label="Where I work">
            {LAYERS.map((l, i) => (
              <li key={l.label} className={i === layer ? 'is-on' : ''}>
                <FontAwesomeIcon icon={l.icon} />
                <span>{l.label}</span>
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <button type="button" className="hero-btn hero-btn-primary" onClick={() => scrollToSection('projects')}>See my work</button>
            <button type="button" className="hero-btn" onClick={() => scrollToSection('contact')}>Get in touch</button>
          </div>
        </div>
      </main>
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </div>
  );
};

export default HomePage;