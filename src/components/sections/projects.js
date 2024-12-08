// import WorkProjects from "../sections/work_projects";
// import OldProjects from "../sections/old_projects";

import { useEffect } from "react";
import gsap from "gsap";

// Style Import
import "../../css/projects.scss";

const projects = [
    {
        name: "Knowledge Base Management with Pinecone for AI Agents"
    },
    {
        name: "Locations Management Hierarchy Page"
    },
    {
        name: "Dynamic Form Generator using AI"
    },
    {
        name: "Websockets Login State Management"
    }
];

const Projects = (props) => {

    const {
        containerProps,
        projectItemProps
    } = props;

    useEffect(() => {
        animateProjectBackdrop();
        animateProjectCards();
    }, []);

    const animateProjectBackdrop = () => {
        gsap.to("#projects", {
            scrollTrigger: {
                trigger: "#projects",
                start: "top-=120 top",
                end: `+=${projects.length * 200 + 300}`,
                pin: true,
                scrub: 1.5
            },
            width: "100vw",
            opacity: 1
        });
    };

    const animateProjectCards = () => {
        const projectSlides = document.querySelectorAll('.project-slide');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#projects',
                start: 'top-=120 top',
                end: `+=${projects.length * 200}`,
                scrub: 1.5
            }
        });

        projectSlides.forEach((slide, index) => {
            tl.fromTo(
                slide,
                {
                    y: '100%',
                    scale: 0.2,
                    rotateY: 45,
                    x: '100%',
                    rotateZ: 45
                },
                {
                    y: 0,
                    scale: 1,
                    rotateY: 0,
                    x: 0,
                    rotateZ: -index * 0.4
                }
            );
        });
    };

    return (
        <div {...containerProps} id="projects">
            <h4>Projects</h4>
            <div id="projects-slides">
                {
                    projects.map((project, i) => (
                        <div {...projectItemProps} key={i} className="project-slide">
                            <span className="project-name">{project.name}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Projects;