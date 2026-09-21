//Imports
import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import ReactGA from 'react-ga4';

// Font Awesome Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { gsap, ScrollTrigger } from "gsap/all";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

//Common Imports within Routes
import "./css/global.scss";

//Page imports
import HomePage from "./components/pages/home-page";

//Component Imports
import Cursor from "./components/common/cursor";
import Lenis from "lenis";

//Function Imports
import { setRandomTheme } from "./components/common/colors";
import { ANIMATION_OK, SCROLL_EFFECTS_OK, prefersReducedMotion } from "./components/common/motion";

library.add(faGithub, faBars, faSyncAlt, faCompass, faHome, faPaperPlane, faFaceSmile, faStar, faUser);
gsap.registerPlugin(ScrollTrigger);

const GITHUB_URL = "https://github.com/skurnal2";
const RESUME_URL = `${process.env.PUBLIC_URL}/resume.pdf`;
const EMAIL_URL = "mailto:contact@siddharthkurnal.com";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  //Cursor States
  const [cursorScale, setCursorScale] = useState(1);
  const [cursorBorderRadius, setCursorBorderRadius] = useState("5px");
  const [cursorBlendColor, setCursorBlendColor] = useState(false);
  const [cursorBlur, setCursorBlur] = useState(false);
  const [cursorBorder, setCursorBorder] = useState(true);
  const [cursorBackgroundOpacity, setCursorBackgroundOpacity] = useState(0.3);
  const [cursorBackgroundRGB, setCursorBackgroundRGB] = useState("");
  const [cursorBackdropBlur, setCursorBackdropBlur] = useState(true);
  const [cursorContent, setCursorContent] = useState(null);

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

    mm.add(ANIMATION_OK, () => {
      gsap.from(".nav-links > *", {
        duration: 1,
        opacity: 0,
        y: -30,
        x: -20,
        stagger: -0.25,
        ease: 'elastic'
      });

      gsap.from("nav h1", {
        scrollTrigger: {
          trigger: ".services",
          start: "top-=200 top",
          end: "100px 15px",
          scrub: true
        },
        y: -120,
      });

      gsap.to("#title-first", {
        scrollTrigger: {
          trigger: ".services",
          start: "top",
          end: "100px 15px",
          scrub: 0.5,
          ease: "power1.inOut"
        },
        visibility: "visible",
        marginRight: 50
      });

      gsap.to("#title-second", {
        scrollTrigger: {
          trigger: ".services",
          start: "top",
          end: "100px 15px",
          scrub: 0.5,
          ease: "power1.inOut"
        },
        visibility: "visible",
        marginLeft: 50
      });

      gsap.from(".circle", {
        delay: 1,
        duration: 4,
        opacity: 0,
        y: -250,
        rotate: 20,
        stagger: 0.3,
        ease: "elastic"
      });

      gsap.to(".first-h2", {
        scrollTrigger: {
          trigger: "nav",
          start: "top",
          end: "600px 10px",
          scrub: true,
        },
        x: 400,
        duration: 35,
      });

      gsap.to(".second-h2", {
        scrollTrigger: {
          trigger: "nav",
          start: "top",
          end: "600px 10px",
          scrub: true
        },
        x: -400,
        duration: 35
      });

      gsap.to(".services", {
        scrollTrigger: {
          trigger: ".services",
          start: "top+=150 center",
          end: "+=550",
          scrub: 0.5,
          ease: "power1.inOut"
        },
        y: 300,
        scale: 0.5,
        rotateX: 70,
        opacity: 0
      });
    });

    // Desktop animations
    mm.add(SCROLL_EFFECTS_OK, () => {
      gsap.to("nav", {
        scrollTrigger: {
          trigger: "nav",
          start: "bottom",
          scrub: true
        },
        height: "9vh",
        ease: "ease",
        stagger: true
      });
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis();
    lenisRef.current = lenis;

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
      lenisRef.current = null;
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

  const scrollTo = (top) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(top);
      return;
    }
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const goToProjects = () => {
    const projectsSection = document.querySelector('#projects');
    if (!projectsSection) return;
    const offset = 20; // Add offset to account for nav bar height
    scrollTo(projectsSection.getBoundingClientRect().top + window.scrollY + offset);
  };

  const scrollToTop = () => scrollTo(0);

  // Queue navigation to run once the menu has actually closed.
  const menuNavigate = (action, label) => () => {
    pendingScroll.current = action;
    trackNavClick(label);
    setIsOpen(false);
  };

  const navLinksEffects = (icon) => {
    return {
      onMouseEnter: () => {
        setCursorBackgroundRGB('0,0,0');
        setCursorScale(3);
        setCursorBackgroundOpacity(0.2);
        setCursorBackdropBlur(true);
        setCursorBorderRadius("20px");
        setCursorContent(<FontAwesomeIcon icon={icon} style={{fontSize: '30px', color: 'white'}}/>);
      },
      onMouseLeave: () => {
        setCursorBackgroundRGB('');
        setCursorScale(1);
        setCursorBackgroundOpacity(0.3);
        setCursorBackdropBlur(true);
        setCursorBorderRadius("5px");
        setCursorContent(null);
      }
    };
  }

  return (
    <div className="parent">
      <div className="container">
        <div
          id="full-menu"
          className="full-menu-wrapper"
          style={menuStyle}
          aria-hidden={!isOpen}
          ref={menuRef}
        >
            <button type="button" onClick={menuNavigate(scrollToTop, "Home")}>Home</button>
            <button type="button" onClick={menuNavigate(goToProjects, "Projects")}>Projects</button>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackNavClick("Résumé")}
            >
              Résumé
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackNavClick("GitHub")}>
              <FontAwesomeIcon
                className="github-symbol"
                icon={["fab", "github"]}
              />
              GitHub
            </a>
            <a href={EMAIL_URL} onClick={() => trackNavClick("Contact")}>Contact</a>
        </div>
        <nav>
          <h1>
            <div className="h1-circle" />
            <div className="h1-circle" />
            <span id="title-first">Siddharth</span>
            <br />
            <span id="title-second">Kurnal</span>
          </h1>
          <div className="nav-links">
            <button
              type="button"
              {...navLinksEffects(["fas", "home"])}
              onClick={() => { scrollToTop(); trackNavClick("Home"); }}
            >
              <span>Home</span>
            </button>
            <a
              {...navLinksEffects(["fas", "user"])}
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackNavClick("Résumé")}
            >
              <span>Résumé</span>
            </a>
            <button
              type="button"
              {...navLinksEffects(["fas", "compass"])}
              onClick={() => { goToProjects(); trackNavClick("Projects"); }}
            >
              <span>Projects</span>
            </button>
            <a
              {...navLinksEffects(["fab", "github"])}
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackNavClick("GitHub")}
            >
              <span><FontAwesomeIcon className="github-symbol" icon={["fab", "github"]}/>GitHub</span>
            </a>
            <a
              {...navLinksEffects(["fas", "paper-plane"])}
              href={EMAIL_URL}
              onClick={() => trackNavClick("Contact")}
            >
              <span>Contact</span>
            </a>
          </div>
        </nav>
        <button
          type="button"
          className="nav-menu-button"
          ref={menuButtonRef}
          aria-expanded={isOpen}
          aria-controls="full-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => { handleMenu(); trackNavClick("Menu"); }}
        >
          <FontAwesomeIcon className="menu-symbol" icon={["fa", "bars"]} />
        </button>
        <HomePage
          projectProps={
            {
              containerProps: {
                onMouseEnter: () => {
                  setCursorBorderRadius(10);
                },
                onMouseLeave: () => {
                  setCursorBorderRadius(5);
                }
              },
              projectItemProps: {
                onMouseEnter: () => {
                  setCursorScale(3);
                  setCursorBorderRadius(30);
                  setCursorContent(<FontAwesomeIcon icon={["fa", "face-smile"]} style={{fontSize: '30px', color: '#ffffffc2'}}/>);
                },
                onMouseLeave: () => {
                  setCursorScale(1);
                  setCursorBorderRadius(10);
                  setCursorContent("");
                }
              }
            }
          }
          contactProps={{
            onMouseEnter: () => {
              setCursorBlendColor(true);
              setCursorBackdropBlur(false);
              setCursorBackgroundRGB('255,255,255');
              setCursorBorder(false);
              setCursorBackgroundOpacity(1);
              setCursorScale(4);
              setCursorBlur(3);
            },
            onMouseLeave: () => {
              setCursorBlendColor(false);
              setCursorBackdropBlur(true);
              setCursorBackgroundRGB('');
              setCursorBorder(true);
              setCursorScale(1);
              setCursorBlur(0);
              setCursorBackgroundOpacity(0);
            }
          }}
        />
      </div>
      <Cursor
        cursorScale = {cursorScale}
        cursorBlendColor = {cursorBlendColor}
        cursorBlur = {cursorBlur}
        cursorBorder = {cursorBorder}
        cursorBackgroundRGB= {cursorBackgroundRGB}
        cursorBackgroundOpacity={cursorBackgroundOpacity}
        cursorBackdropBlur = {cursorBackdropBlur}
        cursorContent = {cursorContent}
        cursorBorderRadius = {cursorBorderRadius}
      />
      <button
        type="button"
        id="theme-info-popup"
        aria-label="Shuffle the colour theme"
        onClick={() => setRandomTheme()}
        onMouseEnter={() => {
          setCursorScale(2);
          setCursorBackgroundRGB('0,0,0');
          setCursorContent(<FontAwesomeIcon icon={["fas", "sync-alt"]} style={{fontSize: '20px', color: '#ffffffc2'}}/>);
        }}

        onMouseLeave={() => {
          setCursorScale(1);
          setCursorBackgroundRGB('');
          setCursorContent(null);
        }}
      >
        <FontAwesomeIcon icon={["fa", "star"]}/>
        <span id="theme-info-popup-name"/>
      </button>
    </div>
  );
}
export default App;
