import React from "react";
import Projects from "../common/projects";

const workProjectsData = [];

const WorkProjects = () => {
    return(
        <Projects id="projects" title="Work Projects" data={workProjectsData}/>
    );
}

export default WorkProjects;