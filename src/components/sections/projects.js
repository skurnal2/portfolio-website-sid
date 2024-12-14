// import WorkProjects from "../sections/work_projects";
// import OldProjects from "../sections/old_projects";

import { useEffect } from "react";
import gsap from "gsap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Added import for font awesome star icon

import rag_url from "../../images/rag.jpg";
import sortable_tree_url from "../../images/sortable_tree.gif";
import openai_url from "../../images/openai.jpg";
import highway_dodge_url from "../../images/highway_dodge_screen.png";

// Style Import
import "../../css/projects.scss";

const projects = [
    {
        name: "Knowledge Base Management with Pinecone for AI Agents",
        image: rag_url,
        details: (
            <ul>
                <li>Used <b>Pinecone</b> to store and retrieve vector embeddings efficiently, enabling accurate similarity searches and improving chatbot query precision.</li>
                <li>Implemented a <b>Retrieval-Augmented Generation (RAG)</b> system to integrate external knowledge dynamically, enhancing the chatbot's ability to provide relevant and context-aware responses.</li>
                <li>Developed real-time markdown rendering for chatbot responses using event streaming, creating an interactive user experience with minimal response delays.</li>
                <li>Managed a Python-based backend on <b>AWS EC2</b> for reliable and scalable operations, and used <b>AWS S3</b> for secure and organized Knowledge Base uploads.</li>
                <li>Built a responsive chatbot interface with <b>React</b> and <b>Redux</b>, incorporating efficient state management through local storage and session handling for a seamless user experience.</li>
                <li>Provided users the option to tweak <b>temperature</b>, <b>topK</b>, and <b>score thresholds</b> for enhanced customization.</li>
            </ul>
        )
    },
    {
        name: "Locations Management Hierarchy Page",
        image: sortable_tree_url,
        details: (
            <ul>
                <li>Customized <b>React Sortable Tree Library</b>: Tailored the React Sortable Tree library to meet business requirements, enabling efficient management of thousands of company locations.</li>
                <li>Implemented <b>Virtualized React Components</b>: Optimized performance by dynamically rendering components and unmounting them from the DOM, ensuring smooth handling of large datasets without lags.</li>
                <li>Designed Responsive Interfaces: Developed a fully responsive UI using <b>SASS</b> to provide seamless drag-and-drop functionality on both desktop and mobile devices.</li>
                <li>Integrated <b>Redux</b> for State Management: Leveraged Redux to manage application state effectively, ensuring scalability and maintainability of the system.</li>
                <li>Enhanced Nested Data Handling: Designed and implemented complex solutions for recursive location tree management, significantly improving the efficiency of nested data operations.</li>
            </ul>
        )
    },
    {
        name: "Dynamic Form Generator using AI",
        image: openai_url,
        details: (
            <ul>
                <li>Integrated <b>OpenAI's latest models</b> via API, allowing users to create dynamic forms by entering prompts or uploading PDFs/images.</li>
                <li>Developed an <b>AI-driven chatbot interface</b> that assists users in refining and customizing forms, streamlining the form creation process.</li>
                <li>Built a responsive, user-friendly interface with <b>React</b> and <b>Redux</b>, ensuring smooth interaction and seamless integration within the form builder.</li>
                <li>Conducted <b>prompt engineering</b> to ensure the AI returned precise, actionable results in a format compatible with the form builder.</li>
                <li>Reduced form creation times by <b>40-50%</b>, significantly improving workflow efficiency and boosting user productivity.</li>
            </ul>
        )
    },
    {
        name: "HighwayDodge - Cross-Platform Mobile Game",
        image: highway_dodge_url,
        details: (
            <ul>
                <li><b>Cross-Platform Game Development</b>: Developed a mobile game for both <b>Android</b> and <b>iOS</b> platforms using the <b>LibGDX</b> framework, ensuring compatibility across devices and enhancing user experience on both systems.</li>
                <li><b>Gameplay State Management</b>: Designed and implemented <b>gameplay state transitions</b> across multiple screens, improving game flow and enhancing user engagement.</li>
                <li><b>Motion and Acceleration Tracking</b>: Integrated device sensors, including the <b>gyroscope</b> and <b>accelerometer</b>, to track motion and acceleration, providing an immersive gaming experience through real-time movement-based controls.</li>
                <li><b>Sensor Data Processing</b>: Utilized <b>gyroscope</b> and <b>accelerometer</b> data to trigger dynamic in-game events, enabling motion-sensitive interactions and intuitive controls, elevating gameplay realism and player involvement.</li>
                <li><b>Optimized Game Performance</b>: Leveraged <b>Android Studio</b> and <b>Java</b> for efficient coding practices, ensuring optimal performance and responsiveness, even during complex sensor-based interactions.</li>
            </ul>
        )
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
                                <div className="project-content-image">
                                    <img src={project?.image}/>
                                </div>
                                <div className="project-content-description">
                                    <span className="project-content-description-details">
                                        {project?.details}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Projects;