import React from "react";
import '../../css/home-page.scss';
import '../../css/nav.scss';

//Component Imports
import Services from "../sections/services";
import Projects from "../sections/projects";
import Contact from "../sections/contact";

const HomePage = ({
  projectProps,
  contactProps
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
      <Projects {...projectProps} />
      <Contact {...contactProps}/>
    </div>
  );
};

export default HomePage;