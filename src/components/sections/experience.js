import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes, faTrophy, faLanguage, faRocket, faHeadset, faGaugeHigh, faRobot, faWandMagicSparkles,
  faBolt, faUsers, faLayerGroup, faSitemap, faPlug, faShieldHalved, faFileLines, faChartLine, faHandshake,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import usePinnedStage from "../../hooks/usePinnedStage";
import { SCROLL_EFFECTS_OK } from "../common/motion";
import { onScreen, trackDwell, trackItems } from "../../lib/analytics";
import "../../css/experience.scss";

// Work history. Keep in step with the résumé
// (~/Documents/Tasks/Jobs/builder/profile.mjs): same titles, dates and numbers.
const ROLES = [
  {
    company: "Kortext",
    location: "Niagara Falls, Ontario (Remote)",
    dates: "Jan 2025 - Aug 2026",
    title: "Software Developer",
    work: [["Setup", "Remote, team mostly in Ontario, company based in the UK"], ["Cloud", "Azure, with Azure DevOps CI/CD and Argo CD to Kubernetes"], ["Customers", "Universities, as their point of contact for support"]],
    stack: [".NET 8", "C#", "Angular", "TypeScript", "Nx", "gRPC", "Kafka", "Azure", "Azure DevOps", "Argo CD", "Kubernetes", "Transloco", "Grafana k6", "Playwright"],
    points: [
      [faCubes, <>Built features across <b>42 .NET 8 microservices</b> on <b>Azure</b> and an <b>Angular</b> / <b>TypeScript</b> front end in an <b>Nx</b> monorepo of 9 apps, communicating over <b>gRPC</b> and <b>Kafka</b>.</>],
      [faTrophy, <><b>Won a company-wide AI hackathon</b> against teams across North America and Europe with an AI pull-request reviewer using <b>RAG</b> over <b>1,700+</b> engineering wiki pages and the team's code.</>],
      [faLanguage, <>Set up <b>Transloco</b> internationalization across <b>13 languages</b>, including right-to-left, and delivered <b>WCAG 2.2</b> accessibility improvements.</>],
      [faRocket, <>Shipped through <b>Azure DevOps</b> CI/CD with <b>Argo CD</b> deploying to <b>Kubernetes</b>, and load-tested services with <b>Grafana k6</b>, <b>Artillery</b> and <b>Playwright</b>.</>],
      [faHeadset, <>Point of contact for university customers on support inquiries and bug fixes.</>],
    ],
  },
  {
    company: "BIS Safety Software",
    location: "Sherwood Park, Alberta",
    dates: "Jun 2023 - Dec 2024",
    title: "Intermediate Full Stack Developer",
    work: [["Focus", "AI features in production and a team of developers to lead"], ["Cloud", "AWS"], ["Scale", "An application serving over 2 million users"]],
    stack: ["Python", "Pinecone", "RAG", "OpenAI", "Node.js", "WebSockets", "AWS EC2", "AWS S3", "React"],
    points: [
      [faRobot, <>Built an AI support chatbot using <b>RAG</b> with <b>Pinecone</b>, cutting support inquiries by <b>50%</b>.</>],
      [faWandMagicSparkles, <>Built an AI form generator with the <b>OpenAI API</b>, cutting form creation time by <b>40%</b>.</>],
      [faBolt, <>Replaced long polling with a <b>Node.js</b> WebSocket server on <b>AWS EC2</b>, reducing database load by <b>30%</b>.</>],
      [faUsers, <>Led a team of developers on AI projects, cutting development time by <b>40%</b>.</>],
    ],
  },
  {
    company: "BIS Safety Software",
    location: "Sherwood Park, Alberta",
    dates: "Dec 2020 - Jun 2023",
    title: "Full Stack Developer",
    work: [["Focus", "Performance, shared UI and integrations"], ["Compliance", "SOC 2, PIPA and PIPEDA"], ["Scale", "An application serving over 2 million users"]],
    stack: ["React", "Redux", "Redis", "NPM", "Storybook", "SASS", "REST APIs"],
    points: [
      [faGaugeHigh, <>Cut settings page load times by <b>80%</b> with <b>React-Redux</b> and <b>Redis</b> caching.</>],
      [faLayerGroup, <>Built a reusable <b>React</b> component library on npm with Storybook docs for <b>70 developers</b>, reducing UI development time by <b>50%</b>.</>],
      [faSitemap, <>Developed a recursive drag-and-drop location tree with virtualized <b>React</b> components, handling thousands of locations per customer.</>],
      [faPlug, <>Implemented <b>RESTful APIs</b> and automated FTP imports, eliminating all manual data transfer for clients.</>],
      [faShieldHalved, <>Worked on an application serving over <b>2 million users</b> under SOC 2, PIPA and PIPEDA compliance.</>],
    ],
  },
  {
    company: "Aimsio",
    location: "Calgary, Alberta (Remote)",
    dates: "Jul 2020 - Oct 2020",
    title: "Implementation Developer Intern",
    work: [["Setup", "Remote internship"], ["Focus", "Client implementations on the Aimsio platform"]],
    stack: ["JavaScript", "SCSS", "MySQL"],
    points: [
      [faFileLines, <>Built custom forms for web and mobile apps with the Aimsio framework and <b>MySQL</b>.</>],
      [faChartLine, <>Improved report generation efficiency by <b>30%</b> with SCSS and JavaScript.</>],
      [faHandshake, <>Worked with clients to understand their needs and implement tailored solutions.</>],
    ],
  },
];

const Experience = () => {
  const stageRef = useRef(null);
  const [active, setActive] = useState(0);
  const onIndex = useCallback((i) => setActive(i), []);

  // Analytics: which roles people actually look at, once each
  const activeRef = useRef(0);
  activeRef.current = active;
  const trackRole = (i) => ROLES[i] && trackDwell("role", `role:${i}`, "role_view", { role: `${ROLES[i].company} - ${ROLES[i].title}` });
  useEffect(() => {
    const root = stageRef.current;
    if (!root) return undefined;
    if (!window.matchMedia(SCROLL_EFFECTS_OK).matches) {
      const cards = Array.from(root.querySelectorAll(".xp-card"));
      return trackItems(cards, (el) => {
        const i = cards.indexOf(el);
        return [`role:${i}`, "role_view", { role: `${ROLES[i].company} - ${ROLES[i].title}` }];
      });
    }
    // desktop: the wheel shows one role at a time; record the one showing on arrival
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) trackRole(activeRef.current); }, { rootMargin: "-33% 0px -33% 0px" });
    io.observe(root);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (onScreen(stageRef.current)) trackRole(active); }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // The dotted line is drawn through each ring's live position, so it bends
  // with the wheel instead of the rings sliding off a straight line.
  const curveRef = useRef(null);
  const drawCurve = useCallback(() => {
    const path = curveRef.current;
    const wheel = path?.closest(".xp-wheel");
    if (!wheel) return;
    const box = wheel.getBoundingClientRect();
    const pts = [...wheel.querySelectorAll(".xp-ring")].map((r) => {
      const b = r.getBoundingClientRect();
      return [b.left + b.width / 2 - box.left, b.top + b.height / 2 - box.top];
    }).sort((a, b) => a[1] - b[1]);
    if (pts.length < 2) return;
    // carry the curve on past the first and last ring to the wheel's edges
    const [a0, a1] = pts;
    const [z1, z0] = pts.slice(-2);
    pts.unshift([a0[0] - (a1[0] - a0[0]), Math.min(0, a0[1] - (a1[1] - a0[1]))]);
    pts.push([z0[0] + (z0[0] - z1[0]), Math.max(box.height, z0[1] + (z0[1] - z1[1]))]);
    // Catmull-Rom through every point, as cubic Béziers
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    path.setAttribute("d", d);
  }, []);

  // Left: the roles turn past like an iOS picker wheel while the section is pinned.
  usePinnedStage(stageRef, { item: ".xp-card", mode: "wheel", perItem: 520, stage: ".xp-wheel", onIndex, onFrame: drawCurve });

  // Right: whenever a new role reaches the centre, its work flips in line by line.
  useLayoutEffect(() => {
    const root = stageRef.current;
    if (!root || !window.matchMedia(SCROLL_EFFECTS_OK).matches) return undefined;
    const panel = root.querySelectorAll(".xp-detail")[active];
    if (!panel) return undefined;
    const ctx = gsap.context(() => {
      // gentle: a short rise and fade, lines following each other quickly
      gsap.fromTo(panel.querySelectorAll(".xp-detail-head, .xp-work > div, .xp-point, .xp-stack"),
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power2.out" });
    }, panel);
    return () => ctx.revert();
  }, [active]);

  return (
    <section className="xp" id="experience" aria-labelledby="experience-title" ref={stageRef}>
      <h4 id="experience-title" className="sec-head">
        <span className="sec-ring" aria-hidden="true" />
        <span className="sec-num" aria-hidden="true">01</span>
        <span className="sec-title">Experience</span>
        <span className="sec-sub" aria-hidden="true">Where I have worked</span>
        <span className="sec-rule" aria-hidden="true" />
      </h4>
      <div className="xp-layout">
        <div className="xp-wheel">
          <svg className="xp-curve" aria-hidden="true"><path ref={curveRef} /></svg>
          {ROLES.map((r, i) => (
            <article className={`xp-card${i === active ? " is-active" : ""}`} key={r.title} style={{ "--o": i * 2 }}>
              <span className="xp-ring" />
              <span className="xp-company">{r.company}</span>
              <span className="xp-title">{r.title}</span>
              <span className="xp-meta"><span>{r.dates}</span><span><FontAwesomeIcon icon={faLocationDot} /> {r.location}</span></span>
            </article>
          ))}
        </div>
        <div className="xp-details">
          {ROLES.map((r, i) => (
            <div className={`xp-detail${i === active ? " is-active" : ""}`} key={r.title} style={{ "--o": i * 2 + 1 }}>
              <div className="xp-detail-head">
                <span>What I did</span>
                <b>{r.company}</b>
                <em>{r.title}</em>
              </div>
              <dl className="xp-work">
                {r.work.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
              <ul>
                {r.points.map(([icon, text], k) => (
                  <li className="xp-point" key={k}>
                    <span className="xp-point-icon"><FontAwesomeIcon icon={icon} /></span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div className="xp-stack"><small>Stack</small>{r.stack.map((s) => <span key={s}>{s}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
