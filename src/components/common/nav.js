import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Nav extends React.Component {
  render() {
    return (
      <nav>
        <h1>
          <div className="h1-circle" />
          <div className="h1-circle" />
          <span id="title-first">Siddharth</span>
          <br />
          <span id="title-second">Kurnal</span>
        </h1>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Projects</a>
          <a href="http://github.com/skurnal2" target="_blank">
            <FontAwesomeIcon
              className="github-symbol"
              icon={["fab", "github"]}
            />
            GitHub
          </a>
          <a href="#">Contact</a>
        </div>
      </nav>
    );
  }
}

export default Nav;