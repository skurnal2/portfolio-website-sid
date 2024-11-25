import React from "react";
import Projects from "../common/projects";

const workProjectsData = [];

const WorkProjects = ({
    containerProps,
    projectItemProps
}) => {
    return(
        <Projects title="Work Projects" data={workProjectsData} containerProps={containerProps} projectItemProps={projectItemProps}/>
    );
}

export default WorkProjects;