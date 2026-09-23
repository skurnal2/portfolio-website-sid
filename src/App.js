//Imports
import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import ReactGA from 'react-ga4';

// Font Awesome Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { gsap, ScrollTrigger } from "gsap/all";
import { faStar } from "@fortawesome/free-solid-svg-icons";

//Common Imports within Routes
import "./css/global.scss";
import "./css/stage.scss";

//Page imports
import Spine from "./components/spine";
import HomePage from "./components/pages/home-page";

//Component Imports
import Cursor from "./components/common/cursor";
import ThemeHint from "./components/common/theme-hint";
import Lenis from "lenis";

//Function Imports
import { setRandomTheme } from "./components/common/colors";
import { ANIMATION_OK, prefersReducedMotion } from "./components/common/motion";
import { setLenis, scrollToSection, scrollToY, initSectionSnap } from "./lib/scroll";

library.add(faGithub, faLinkedin, faStar);
gsap.registerPlugin(ScrollTrigger);

const GITHUB_URL = "https://github.com/skurnal2";
const LINKEDIN_URL = "https://www.linkedin.com/in/siddharth-kurnal";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);


  const lenisRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const wasOpen = useRef(false);
  // A menu item that navigates has to wait for the menu to close before it
  // scrolls, otherwise it scrolls behind a full-screen overlay.
  const pendingScroll = useRef(null);

  const initializeGA = () => {
    ReactGA.initialize('G-VV8X7KDEV9');
  };

  useLayoutEffect(() => {
    setRandomTheme();

    // gsap.matchMedia owns the lifecycle: it builds these on match, and
    // reverts every inline style and ScrollTrigger it created when the query
    // stops matching, which is what lets the CSS fallback layouts take over.
    const mm = gsap.matchMedia();

    // the top bar's name box and backdrop appear once the hero is behind you
    const heroTrigger = ScrollTrigger.create({
      trigger: "#home",
      start: "bottom top+=160",
      onToggle: (self) => document.querySelector(".topbar")?.classList.toggle("is-scrolled", self.isActive || self.progress === 1),
      onUpdate: (self) => document.querySelector(".topbar")?.classList.toggle("is-scrolled", self.scroll() > self.start),
      end: "max",
    });

    mm.add(ANIMATION_OK, () => {
      gsap.to(".first-h2", {
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "600px 10px",
          scrub: true,
        },
        x: 400,
        duration: 35,
      });

      gsap.to(".second-h2", {
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "600px 10px",
          scrub: true
        },
        x: -400,
        duration: 35
      });

    });


    return () => { heroTrigger.kill(); mm.revert(); };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis();
    lenisRef.current = lenis;
    setLenis(lenis);
    const stopSnap = initSectionSnap(lenis, ScrollTrigger);

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    // gsap.ticker reports elapsed time in SECONDS; Lenis expects MILLISECONDS.
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing();
      lenis.off('scroll', onScroll);
      lenis.destroy();
      stopSnap();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    // Initialize Google Analytics on page load
    initializeGA();

    // Track the initial pageview
    ReactGA.send('pageview', {
      page_path: window.location.pathname + window.location.search,
    });

    window.scrollTo(0, 0);
  }, []);

  // Menu open/close side effects: lock the page behind the overlay, move focus
  // into the menu on open and back to the toggle on close, and run any
  // navigation the closing menu item asked for.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      menuRef.current?.querySelector('a, button')?.focus();
    } else if (wasOpen.current) {
      menuButtonRef.current?.focus();
      const run = pendingScroll.current;
      pendingScroll.current = null;
      run?.();
    }

    wasOpen.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const trackNavClick = (navItem) => {
    ReactGA.event({
      category: 'Navigation',
      action: `Clicked ${navItem}`,
      label: navItem,
    });
  };

  const handleMenu = () => setIsOpen((open) => !open);

  const menuStyle = {
    zIndex: isOpen ? 300 : -100,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
  };

  const scrollToTop = () => scrollToY(0);
  const goToSection = (id) => () => scrollToSection(id);
  const goToContact = () => scrollToSection("contact");

  // Queue navigation to run once the menu has actually closed.
  const menuNavigate = (action, label) => () => {
    pendingScroll.current = action;
    trackNavClick(label);
    setIsOpen(false);
  };


  return (
    <div className="parent">
      <div className="container">
        <div
          id="full-menu"
          className={`full-menu-wrapper${isOpen ? " is-open" : ""}`}
          style={menuStyle}
          aria-hidden={!isOpen}
          ref={menuRef}
        >
          <nav className="mm-list" aria-label="Sections">
            {[
              ["Home", scrollToTop],
              ["Experience", goToSection("experience")],
              ["Projects", goToSection("projects")],
              ["Skills", goToSection("skills")],
              ["Contact", goToSection("contact")],
            ].map(([label, action], i) => (
              <button type="button" key={label} style={{ "--i": i }} onClick={menuNavigate(action, label)}>
                <span className="mm-ring" />
                <span className="mm-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="mm-label">{label}</span>
              </button>
            ))}
          </nav>
          <div className="mm-links" style={{ "--i": 5 }}>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackNavClick("GitHub")}>
              <FontAwesomeIcon icon={["fab", "github"]} /> GitHub
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackNavClick("LinkedIn")}>
              <FontAwesomeIcon icon={["fab", "linkedin"]} /> LinkedIn
            </a>
          </div>
        </div>
        <header className="topbar">
          <button type="button" className="topbar-brand" onClick={() => { scrollToTop(); trackNavClick("Brand"); }} aria-label="Back to top">
            <span className="topbar-sq" /><span className="topbar-sq" />
            <span className="topbar-name"><span>Siddharth</span><span>Kurnal</span></span>
          </button>
          <div className="corner-bar">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" onClick={() => trackNavClick("GitHub")}>
              <FontAwesomeIcon icon={["fab", "github"]} />
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" onClick={() => trackNavClick("LinkedIn")}>
              <FontAwesomeIcon icon={["fab", "linkedin"]} />
            </a>
            <button type="button" className="corner-cta" onClick={() => { goToContact(); trackNavClick("Contact"); }}>
              Let&rsquo;s talk
            </button>
          </div>
        </header>
        <button
          type="button"
          className="nav-menu-button"
          ref={menuButtonRef}
          aria-expanded={isOpen}
          aria-controls="full-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => { handleMenu(); trackNavClick("Menu"); }}
        >
          <span className="mm-burger" aria-hidden="true"><i /><i /><i /></span>
        </button>
        <Spine onNavigate={(id, label) => { scrollToSection(id); trackNavClick(label); }} />
        <HomePage />
      </div>
      <Cursor />
      <button
        type="button"
        id="theme-info-popup"
        aria-label="Shuffle the colour theme"
        onClick={() => setRandomTheme()}
      >
        <FontAwesomeIcon icon={["fa", "star"]}/>
        <span id="theme-info-popup-name"/>
      </button>
      <ThemeHint />
    </div>
  );
}
export default App;
