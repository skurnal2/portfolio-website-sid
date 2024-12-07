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

const Projects = () => {
    useEffect(() => {
        animateProjectBackdrop();
        animateProjectCards();
    }, []);

    const animateProjectBackdrop = () => {
        gsap.to("#projects", {
            scrollTrigger: {
                trigger: "#projects",
                start: "top-=120 top",
                end: "+=5000",
                pin: true,
                scrub: true
            },
            width: "100vw",
            opacity: 1
        });
    };

    const animateProjectCards = () => {
        const projectSlides = document.querySelectorAll('.project-slide');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.projects',
                start: 'top 80%',
                end: 'bottom top',
                scrub: true,
                markers: true
            }
        });

        projectSlides.forEach((slide, index) => {
            tl.fromTo(
                slide,
                {
                    opacity: 0,
                    y: 100,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay: index * 0.3,
                    onStart: () => {
                        if (index > 0) {
                            gsap.to(projectSlides[index - 1], {
                                opacity: 0,
                                y: -50,
                                duration: 1
                            });
                        }
                    }
                }
            );
        });
    };

    return (
        <div id="projects">
            <h4>Projects</h4>
            <div id="projects-slides">
                {
                    projects.map((project, i) => (
                        <span key={i} className="project-slide">
                            {project.name}
                        </span>
                    ))
                }
            </div>
        </div>
    );
};

export default Projects;