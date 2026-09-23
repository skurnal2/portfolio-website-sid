import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { PROJECTS } from "../../data/projects";
import { Visual } from "../visuals";
import { ANIMATION_OK, SCROLL_EFFECTS_OK, headerOffset } from "../common/motion";
import { scrollToY } from "../../lib/scroll";
import "../../css/projects.scss";

gsap.registerPlugin(ScrollTrigger);

// The deck. On wide screens the section pins and each project comes up out
// of the depth of the page, holds, then falls back and vanishes as the next
// one arrives. The list on the left is a table of contents on its own dotted
// rail: it shows where you are and jumps to any project.
const IN = { z: -900, rotateX: 26, yPercent: 38, autoAlpha: 0 };
const REST = { z: 0, rotateX: 0, yPercent: 0, scale: 1, autoAlpha: 1 };
const OUT = { z: -1300, rotateX: -8, yPercent: -16, scale: 0.72, autoAlpha: 0 };
const PER_PROJECT = 640;

const Projects = () => {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia();

    mm.add(SCROLL_EFFECTS_OK, () => {
      const cards = gsap.utils.toArray(".pj-card", root);
      const n = cards.length;
      gsap.set(cards, { transformPerspective: 1600, transformOrigin: "50% 60% -200px" });
      gsap.set(cards.slice(1), IN);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: () => `top top+=${headerOffset()}`,
          end: () => `+=${(n - 1) * PER_PROJECT}`,
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.3, max: 0.8 }, delay: 0.1, ease: "power2.inOut" },
          onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
        },
      });
      triggerRef.current = tl.scrollTrigger;

      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.to(cards[i - 1], { ...OUT, duration: 1, ease: "power2.in" }, i - 1)
          .fromTo(card, IN, { ...REST, duration: 1, ease: "power3.out" }, i - 1 + 0.3);
      });
      return () => { triggerRef.current = null; };
    });

    // phones and narrow windows: no pin, each card rises in as it arrives
    mm.add(`(max-width: 1024px) and ${ANIMATION_OK}`, () => {
      gsap.utils.toArray(".pj-card", root).forEach((card) => {
        gsap.fromTo(card, { y: 60, rotateX: 14, opacity: 0, transformPerspective: 1000 },
          { y: 0, rotateX: 0, opacity: 1, ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 92%", end: "top 55%", scrub: 0.6 } });
      });
    });

    return () => mm.revert();
  }, []);

  // Only the card you can see runs its animation and video; the rest pause.
  const [onScreen, setOnScreen] = useState(() => new Set([0]));
  const [deck, setDeck] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia(SCROLL_EFFECTS_OK);
    const sync = () => setDeck(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  useLayoutEffect(() => {
    if (deck) return undefined;
    const cards = Array.from(rootRef.current.querySelectorAll(".pj-card"));
    const io = new IntersectionObserver((entries) => {
      setOnScreen((prev) => {
        const next = new Set(prev);
        entries.forEach((e) => { const i = cards.indexOf(e.target); if (e.isIntersecting) next.add(i); else next.delete(i); });
        return next;
      });
    }, { rootMargin: "100px 0px" });
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [deck]);
  const isLive = (i) => (deck ? i === active : onScreen.has(i));

  const jumpTo = (i) => {
    const st = triggerRef.current;
    if (st) {
      const y = st.start + (st.end - st.start) * (i / (PROJECTS.length - 1));
      scrollToY(y);
    } else {
      const card = document.getElementById(`pj-${PROJECTS[i].id}`);
      if (card) scrollToY(card.getBoundingClientRect().top + window.scrollY - headerOffset() - 12);
    }
  };

  return (
    <section className="pj" id="projects" ref={rootRef} aria-labelledby="projects-title">
      <h4 id="projects-title" className="sec-head">
        <span className="sec-ring" aria-hidden="true" />
        <span className="sec-num" aria-hidden="true">02</span>
        <span className="sec-title">Projects</span>
        <span className="sec-sub" aria-hidden="true">At work and on my own</span>
        <span className="sec-rule" aria-hidden="true" />
      </h4>
      <div className="pj-layout">
        <div className="pj-index" role="navigation" aria-label="Projects">
          <ol>
            {PROJECTS.map((p, i) => (
              <li key={p.id} className={`${i === active ? "is-active" : ""}${i < active ? " is-passed" : ""}`}>
                <button type="button" onClick={() => jumpTo(i)}>
                  <span className="pj-index-ring" />
                  <span className="pj-index-text">
                    <small>{p.where}</small>
                    <span>{p.title}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          {/* the rail keeps going: more projects than fit here */}
          <div className="pj-more">
            <div className="pj-more-row">
              <i aria-hidden="true" />
              <a className="pj-more-link" href="https://github.com/skurnal2" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} /> Many more projects
              </a>
            </div>
            <div className="pj-more-row" aria-hidden="true"><i /></div>
            <div className="pj-more-row" aria-hidden="true"><i /></div>
          </div>
        </div>
        <div className="pj-stage">
          {PROJECTS.map((p, i) => (
            <article className={`pj-card${isLive(i) ? " is-live" : ""}`} id={`pj-${p.id}`} key={p.id} aria-label={`${p.where}: ${p.title}`}>
              <div className="pj-visual"><Visual visual={p.visual} live={isLive(i)} /></div>
              <div className="pj-text">
                <span className="pj-kicker">
                  <b>{p.where}</b> · {p.kind === "Work" ? "At work" : "Personal build"}
                </span>
                <h5>{p.title}</h5>
                <p className="pj-summary">{p.summary}</p>
                {p.link && (
                  <a className="pj-link" href={p.link.href} target="_blank" rel="noopener noreferrer">
                    <span className="pj-link-live" aria-hidden="true" />
                    <span className="pj-link-text">
                      <b>{p.link.cta}</b>
                      <small>{p.link.label}</small>
                    </span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </a>
                )}
                <ul>{p.points.map((pt, k) => <li key={k}>{pt}</li>)}</ul>
                <div className="pj-stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
              </div>
            </article>
          ))}
          <a className="pj-more-card" href="https://github.com/skurnal2" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} /> Many more projects on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
