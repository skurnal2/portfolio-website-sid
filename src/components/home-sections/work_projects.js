import React from "react";
import Projects from "../common/projects";

const workProjectsData = [];

const WorkProjects = ({
    setProjectHover
}) => {
    return(
        <Projects id="projects" title="Work Projects" data={workProjectsData} setProjectHover={setProjectHover}/>
    );
}

export default WorkProjects;