import React, { useLayoutEffect, useRef } from "react";

import "../../css/experience.scss";

// Work history, laid out like the résumé: a header bar per company, then each
// role as a stop on one dotted timeline. Keep this in step with the résumé
// (~/Documents/Tasks/Jobs/builder/profile.mjs).
const jobs = [
    {
        company: "Kortext",
        location: "Niagara Falls, Ontario (Remote)",
        dates: "Jan 2025 - Aug 2026",
        roles: [
            {
                title: "Software Developer",
                points: [
                    <>Built features across <b>.NET Core</b> microservices on <b>Azure</b> and an <b>Angular</b> / <b>TypeScript</b> front end in an <b>Nx</b> monorepo, with services talking over <b>gRPC</b> and <b>Kafka</b>.</>,
                    <><b>Won a company-wide AI hackathon</b> against teams across North America and Europe with an AI pull-request reviewer that uses <b>RAG</b> over the team's coding standards and code.</>,
                    <>Set up <b>Transloco</b> internationalization and delivered <b>WCAG 2.2</b> accessibility improvements.</>,
                ],
            },
        ],
    },
    {
        company: "BIS Safety Software",
        location: "Sherwood Park, Alberta",
        dates: "Dec 2020 - Dec 2024",
        roles: [
            {
                title: "Intermediate Full Stack Developer",
                dates: "Jun 2023 - Dec 2024",
                points: [
                    <>Built an AI support chatbot using <b>RAG</b> with <b>Pinecone</b>, cutting support inquiries by <b>50%</b>.</>,
                    <>Built an AI form generator with the <b>OpenAI API</b>, cutting form creation time by <b>40%</b>.</>,
                    <>Replaced long polling with a <b>Node.js</b> WebSocket server on <b>AWS EC2</b>, reducing database load by <b>30%</b>.</>,
                ],
            },
            {
                title: "Full Stack Developer",
                dates: "Dec 2020 - Jun 2023",
                points: [
                    <>Cut settings page load times by <b>80%</b> with <b>React-Redux</b> and <b>Redis</b> caching.</>,
                    <>Built a reusable <b>React</b> component library on npm with Storybook docs for <b>70 developers</b>, reducing UI development time by <b>50%</b>.</>,
                    <>Worked on an application serving over <b>2 million users</b> under SOC 2, PIPA and PIPEDA compliance.</>,
                ],
            },
        ],
    },
    {
        company: "Aimsio",
        location: "Calgary, Alberta (Remote)",
        dates: "Jul 2020 - Oct 2020",
        roles: [
            {
                title: "Implementation Developer Intern",
                points: [
                    <>Built custom forms for web and mobile apps with the Aimsio framework and <b>MySQL</b>.</>,
                    <>Improved report generation efficiency by <b>30%</b> with SCSS and JavaScript.</>,
                ],
            },
        ],
    },
];

// Centre of a role's ring, measured from the top of the role (see .experience-role::before).
const RING_CENTER = 13;

const Experience = () => {
    const timelineRef = useRef(null);

    // The dotted line runs from the first role's ring to the last one's. Their
    // positions shift with fonts and screen width, so re-measure on resize.
    useLayoutEffect(() => {
        const timeline = timelineRef.current;
        if (!timeline) return undefined;
        const place = () => {
            const roles = timeline.querySelectorAll('.experience-role');
            if (roles.length < 2) return;
            const top = roles[0].offsetTop + RING_CENTER;
            const bottom = roles[roles.length - 1].offsetTop + RING_CENTER;
            timeline.style.setProperty('--line-top', `${top}px`);
            timeline.style.setProperty('--line-height', `${bottom - top}px`);
        };
        place();
        const observer = new ResizeObserver(place);
        observer.observe(timeline);
        return () => observer.disconnect();
    }, []);

    return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
        <h4 id="experience-title">Experience</h4>
        <div className="experience-timeline" ref={timelineRef}>
            {jobs.map((job) => (
                <article className="experience-job" key={job.company}>
                    <header className="experience-head">
                        <span className="experience-company">{job.company}</span>
                        <span className="experience-location">{job.location}</span>
                        <span className="experience-dates">{job.dates}</span>
                    </header>
                    {job.roles.map((role) => (
                        <div className="experience-role" key={role.title}>
                            <h5>
                                {role.title}
                                {role.dates && <span className="experience-role-dates">{role.dates}</span>}
                            </h5>
                            <ul>
                                {role.points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </article>
            ))}
        </div>
    </section>
    );
};

export default Experience;
