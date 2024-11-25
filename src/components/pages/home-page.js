import React from "react";
import '../../css/home-page.scss';
import '../../css/nav.scss';

//Component Imports
import Services from "../sections/services";
import AllProjects from "../sections/all_projects";
// import Skills from "../home-sections/skills";

const HomePage = ({
  projectProps
}) => {
  return (
    <div>
      <main>
        <div id="name-container">
          <h2 className="first-h2">SIDDHARTH</h2>
          <h2 className="second-h2">KURNAL</h2>
          <h3>EXPERIENCED FULL-STACK DEVELOPER</h3>
          <div className="circle" />
          <div className="circle" />
        </div>
      </main>
      <Services />
      <AllProjects/>
      {/* <WorkProjects {...projectProps} /> */}
      {/* <OldProjects {...projectProps} /> */}
      {/* <Skills /> */}
    </div>
  );
};

export default HomePage;