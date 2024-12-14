//Imports
import React, { useState, useLayoutEffect, useEffect } from "react";
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

library.add(faGithub, faBars, faSyncAlt, faCompass, faHome, faPaperPlane, faFaceSmile, faStar, faUser);

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [zIndex, setZIndex] = useState("-100");
  const [opacity, setOpacity] = useState("0");
  const [currentWidth, setCurrentWidth] = useState(window.screen.width);

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

  const initializeGA = () => {
    ReactGA.initialize('G-VV8X7KDEV9');
  };

  useLayoutEffect(() => {
    setRandomTheme();
    animationFunctions();
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

  const trackNavClick = (navItem) => {
    ReactGA.event({
      category: 'Navigation',
      action: `Clicked ${navItem}`,
      label: navItem,
    });
  };

  // Custom Functions START
  const animationFunctions = () => {
    // Lenis
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 350);
    });
    gsap.ticker.lagSmoothing();

    //Reload GSAP animations on Screen thresholds
    if (window.screen.width > 1024 && currentWidth < 1024) {      
      setCurrentWidth(window.screen.width);
      animationFunctions();
    } else if (window.screen.width < 1024 && currentWidth > 1024) {
      setCurrentWidth(window.screen.width);
      animationFunctions();      
    }

    gsap.registerPlugin(ScrollTrigger);
    // GSAP Animations
    gsap.to(".nav-links a", {
      duration: 1,
      opacity: 1,
      y: 30,
      x: 20,
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

    // Desktop animations
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px)", () => {
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
  }

  const handleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      setZIndex("-100");
      setOpacity("0");
      console.log("Menu Open");
    } else {
      setIsOpen(true);
      setZIndex("300");
      setOpacity("1");
      console.log("Menu Close");
    }
  }
  //Custom Functions END

  const menuStyle = {
    zIndex,
    opacity,
  };
  
  const goToProjects = (e) => {
    e.preventDefault();
    const projectsSection = document.querySelector('#projects');
    const coordinates = projectsSection.getBoundingClientRect();
    const offset = 20; // Add offset to account for nav bar height
    window.scrollTo({
      top: coordinates.top + window.scrollY + offset,
      behavior: 'smooth'
    });
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

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

  const showResume = () => {
    window.open('/resume.pdf', '_blank');
  }

  return (
    <div className="parent">
      <div className="container">
        <div className="full-menu-wrapper" style={menuStyle}>
            <a onClick={scrollToTop}>Home</a>
            <a onClick={handleMenu}>Projects</a>
            <a href="http://github.com/skurnal2" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon
                className="github-symbol"
                icon={["fab", "github"]}
              />
              GitHub
            </a>
            <a href="mailto:contact@siddharthkurnal.com">Contact</a> 
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
            <a {...navLinksEffects(["fas", "home"])} onClick={(e) => { scrollToTop(e); trackNavClick("Home"); }}><span>Home</span></a>
            <a {...navLinksEffects(["fas", "user"])} onClick={(e) => { showResume(e); trackNavClick("Résumé"); }}><span>Résumé</span></a>
            <a {...navLinksEffects(["fas", "compass"])} onClick={(e) => { goToProjects(e); trackNavClick("Projects"); }}><span>Projects</span></a>
            <a {...navLinksEffects(["fab", "github"])} href="http://github.com/skurnal2" target="_blank" rel="noopener noreferrer" onClick={() => { trackNavClick("GitHub"); }}>
              <span><FontAwesomeIcon className="github-symbol" icon={["fab", "github"]}/>GitHub</span>
            </a>
            <a {...navLinksEffects(["fas", "paper-plane"])} href="mailto:contact@siddharthkurnal.com"><span>Contact</span></a> 
          </div>
        </nav>
        <div className="nav-menu-button" onClick={(e) => { handleMenu(e); trackNavClick("Menu"); }}>
          <FontAwesomeIcon className="menu-symbol" icon={["fa", "bars"]} />
        </div>
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
      <div
        id="theme-info-popup"
        onClick={setRandomTheme}
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
      </div>
    </div>
  );
}
export default App;
