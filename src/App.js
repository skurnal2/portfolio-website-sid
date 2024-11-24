//Imports
import React, { useState, useEffect, useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { gsap, ScrollTrigger } from "gsap/all";

//Common Imports within Routes
import "./css/global.scss";

//Page imports
import HomePage from "./components/pages/home-page";

//Component Imports
import Cursor from "./components/common/cursor";
import Lenis from "lenis";

library.add(faGithub, faBars);

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [zIndex, setZIndex] = useState("-100");
  const [opacity, setOpacity] = useState("0");
  const [currentWidth, setCurrentWidth] = useState(window.screen.width);

  //Cursor States
  const [cursorEnlarged, setCursorEnlarged] = useState(false);
  const [cursorBlendColor, setCursorBlendColor] = useState(false);
  const [cursorBlur, setCursorBlur] = useState(false);
  const [cursorCircle, setCursorCircle] = useState(false);
  const [cursorBorder, setCursorBorder] = useState(true);
  const [cursorBackgroundOpacity, setCursorBackgroundOpacity] = useState(0.3);
  const [cursorBackgroundRGB, setCursorBackgroundRGB] = useState("");
  const [cursorDoubleSize, setCursorDoubleSize] = useState(false);
  const [cursorBackdropBlur, setCursorBackdropBlur] = useState(true);

  useLayoutEffect(() => {
    animationFunctions();
  }, [])

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
        start: "top",
        end: "100px 15px",
        scrub: true,
      },
      y: -120,
    });

    gsap.to("#title-first", {
      scrollTrigger: {
        trigger: ".services",
        start: "top",
        end: "100px 15px",
        scrub: true
      },
      visibility: "visible",
      marginRight: 50
    });

    gsap.to("#title-second", {
      scrollTrigger: {
        trigger: ".services",
        start: "top",
        end: "100px 15px",
        scrub: true,
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
    
    // Desktop animations
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 1025px)", () => {
      gsap.from(".span-row-1, .span-row-3", {
        scrollTrigger: {
          trigger: ".container", 
          start: "top",
          end: "600px 10px",
          scrub: true,
        },
        scale: 0.5,
        stagger: 0.25,
        opacity: 0,
        duration: 11,
      });

      gsap.from(".span-row-2, .span-row-4", {
        scrollTrigger: {
          trigger: ".container",
          start: "top", 
          end: "600px 10px",
          scrub: true,
        },
        scale: 0.5,
        stagger: -0.25,
        opacity: 0,
        duration: 11,
      });

      gsap.to("nav", {
        scrollTrigger: {
          trigger: "nav",
          start: "bottom",
          scrub: true,
        },
        height: "4rem",
        ease: "ease",
      });
    });

    // Mobile animations 
    mm.add("(max-width: 1024px)", () => {
      gsap.from(".span-row-1, .span-row-3", {
        duration: 1,
        scale: 0.5,
        stagger: 0.25,
        opacity: 0,
      });

      gsap.from(".span-row-2, .span-row-4", {
        duration: 0.75,
        scale: 0.5,
        stagger: -0.25,
        opacity: 0,
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
    const offset = -150; // Add offset to account for nav bar height
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

  const navLinksEffects = () => {
    return {
      onMouseEnter: () => {
        setCursorBlendColor(true);
        setCursorEnlarged(true);
        setCursorBackgroundOpacity(0.75);
        setCursorBorder(false);
        setCursorBackdropBlur(false);
      },
      onMouseLeave: () => {
        setCursorBlendColor(false);
        setCursorEnlarged(false);
        setCursorBackgroundOpacity(0.3);
        setCursorBorder(true);
        setCursorBackdropBlur(true);
      }
    };
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
            <a {...navLinksEffects()} onClick={scrollToTop}><span>Home</span></a>
            <a {...navLinksEffects()} onClick={goToProjects}><span>Projects</span></a>
            <a {...navLinksEffects()} href="http://github.com/skurnal2" target="_blank" rel="noopener noreferrer">
              <span>
              <FontAwesomeIcon className="github-symbol" icon={["fab", "github"]}/>GitHub</span>
            </a>
            <a {...navLinksEffects()} href="mailto:contact@siddharthkurnal.com"><span>Contact</span></a> 
          </div>
        </nav>
        <div className="nav-menu-button" onClick={handleMenu}>
          <FontAwesomeIcon className="menu-symbol" icon={["fa", "bars"]} />
        </div>
        <HomePage
          projectProps={
            {
              containerProps: {
                onMouseEnter: () => {
                  setCursorBlendColor(true);
                  setCursorBorder(false);
                  setCursorDoubleSize(true);
                  setCursorBackgroundOpacity(0.75);
                },
                onMouseLeave: () => {
                  setCursorBlendColor(false);
                  setCursorBorder(true);
                  setCursorDoubleSize(false);
                  setCursorBackgroundOpacity(0.3);
                }
              },
              projectItemProps: {
                onMouseEnter: () => {
                  setCursorEnlarged(true);
                  setCursorCircle(true);
                  setCursorDoubleSize(false);
                  setCursorBlendColor(false);
                  setCursorBackdropBlur(true);
                  setCursorBackgroundOpacity(0.2);
                  setCursorBorder(true);
                  setCursorBackgroundRGB('0, 0, 0');
                },
                onMouseLeave: () => {
                  setCursorEnlarged(false);
                  setCursorDoubleSize(true);
                  setCursorCircle(false);
                  setCursorBackgroundOpacity(0.75);
                  setCursorBlendColor(true);
                  setCursorBackdropBlur(false);
                  setCursorBorder(false);
                  setCursorBackgroundRGB('');

                }
              }
          }}
        />
      </div>
      <Cursor
        cursorEnlarged = {cursorEnlarged}
        cursorBlendColor = {cursorBlendColor}
        cursorBlur = {cursorBlur}
        cursorCircle = {cursorCircle}
        cursorBorder = {cursorBorder}
        cursorBackgroundRGB= {cursorBackgroundRGB}
        cursorBackgroundOpacity={cursorBackgroundOpacity}
        cursorDoubleSize = {cursorDoubleSize}
        cursorBackdropBlur = {cursorBackdropBlur}
      />
    </div>
  );
}
export default App;
