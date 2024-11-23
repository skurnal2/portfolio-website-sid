//Imports
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { gsap, ScrollTrigger } from "gsap/all";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link  
} from "react-router-dom";

//Common Imports within Routes
import "./css/global.scss";

//Page imports
import HomePage from "./components/routes/home-page";
import ContactPage from "./components/routes/contact-page";

//Component Imports
import Cursor from "./components/common/cursor";

library.add(faGithub, faBars);

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [zIndex, setZIndex] = useState("-100");
  const [opacity, setOpacity] = useState("0");
  const [currentWidth, setCurrentWidth] = useState(window.screen.width);

  //Cursor States
  const [cursorEnlarged, setCursorEnlarged] = useState(false);

  useEffect(() => {
    gsapFunctions();
  }, []);

  // Custom Functions START
  const gsapFunctions = () => {
    //Reload GSAP animations on Screen thresholds
    if (window.screen.width > 1024 && currentWidth < 1024) {      
      setCurrentWidth(window.screen.width);
      gsapFunctions();
    } else if (window.screen.width < 1024 && currentWidth > 1024) {
      setCurrentWidth(window.screen.width);
      gsapFunctions();      
    }

    gsap.registerPlugin(ScrollTrigger);
    //GSAP Animations
    gsap.from(".nav-links a", {
      duration: 1,
      opacity: 0,
      y: -150,
      x: -100,
      stagger: -0.25,
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
        scrub: true,
      },
      visibility: "visible",
      marginRight: 50,
    });
    gsap.to("#title-second", {
      scrollTrigger: {
        trigger: ".services",
        start: "top",
        end: "100px 15px",
        scrub: true,
      },
      visibility: "visible",
      marginLeft: 50,
    });
    gsap.from(".circle", {
      duration: 4,
      opacity: 0,
      y: -250,
      rotate: 20,
      stagger: 0.3,
      ease: "elastic",
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
        scrub: true,
      },
      x: -400,
      duration: 35,
    });
    
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function () {
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
      },

      "(max-width: 1024px)": function () {
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
      },
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

  const cursorEnlargeEffect = () => {
    return {
      onMouseEnter: () => setCursorEnlarged(true),
      onMouseLeave: () => setCursorEnlarged(false)
    };
  }

  return (
    <Router>
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
              <a {...cursorEnlargeEffect()} onClick={scrollToTop}><span>Home</span></a>
              <a {...cursorEnlargeEffect()} onClick={goToProjects}><span>Projects</span></a>
              <a {...cursorEnlargeEffect()} href="http://github.com/skurnal2" target="_blank" rel="noopener noreferrer">
                <span>
                <FontAwesomeIcon className="github-symbol" icon={["fab", "github"]}/>GitHub</span>
              </a>
              <a {...cursorEnlargeEffect()} href="mailto:contact@siddharthkurnal.com"><span>Contact</span></a> 
            </div>
          </nav>
          <div className="nav-menu-button" onClick={handleMenu}>
            <FontAwesomeIcon className="menu-symbol" icon={["fa", "bars"]} />
          </div>

          {/* Routes (depends on current route in URL) */}
          <Switch>
            <Route exact path="/">
              <HomePage setCursorEnlarged={setCursorEnlarged} />  
            </Route>
            <Route path="/home">
              <HomePage setCursorEnlarged={setCursorEnlarged} />              
            </Route>
            <Route path="/contact">
              <ContactPage />              
            </Route>
          </Switch>          
        </div>
        <Cursor cursorEnlarged={cursorEnlarged}/>
      </div>
    </Router>
  );
}
export default App;
