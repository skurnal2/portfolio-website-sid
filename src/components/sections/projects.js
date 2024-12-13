// import WorkProjects from "../sections/work_projects";
// import OldProjects from "../sections/old_projects";

import { useEffect } from "react";
import gsap from "gsap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Added import for font awesome star icon

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
            const slidePush = `${20 * index}px`;

            tl.fromTo(
                slide,
                {
                    y: '100%',
                    scale: 0.2,
                    rotateY: 45,
                    x: index % 2 ? '-90%' : '90%',
                    rotateZ: index % 2 ? -55 : 55
                },
                {
                    y: index * -10,
                    scale: 1,
                    rotateY: 0,
                    x: slidePush,
                    rotateZ: index * -0.8,
                    width: `calc(100% - ${slidePush} - 40px)`
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
                            <span className="project-name">
                                <span className="project-icon">
                                    <FontAwesomeIcon icon={faStar}/>
                                </span>
                                {project.name}
                            </span>
                            <div className="project-content">
                                <span>Coming Soon</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Projects;