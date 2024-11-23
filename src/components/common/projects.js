//Imports
import React, { useState } from "react";
import ReactTooltip from 'react-tooltip';

const Projects = ({
  id = "",
  title = "Projects",
  data = [],
  setProjectHover = null
}) => {

  const [dataTip, setDataTip] = useState('');

  //Setting the popup based on hover
  const getPopup = () => {
    let popup;
    switch(dataTip) {
      case 'resume':
        popup = <ul>
          <li>JQuery</li>
          <li>JSON</li>
        </ul>;
        break;
      case 'sunshine':
        popup = <ul>
          <li>ReactJs</li>
          <li>SVGs</li>
        </ul>
        break;
      case 'geo_covid':
        popup = <ul>
          <li>Google Maps API</li>
          <li>ReactJs</li>
          <li>React-Bootstrap</li>
        </ul>
        break;
      case 'highway_dodge':
        popup = <ul>
          <li>Android Studio</li>
          <li>LibGDX</li>
          <li>Java</li>
        </ul>
        break;
      case 'bee_chat':
        popup = <ul>
          <li>ReactJs</li>
          <li>REST Api</li>
          <li>PHP</li>
          <li>Axios</li>
          <li>Framer Motion</li>
        </ul>
        break;
      case 'la_auto':
        popup = <ul>
          <li>ASP.Net (C#)</li>
          <li>MySQL</li>
          <li>Entity Framework</li>
          <li>LINQ</li>
          <li>JQuery</li>
        </ul>
      break;
      case 'wallify':
        popup = <ul>
          <li>React Native</li>
        </ul>
        break;
      case 'color_app':
        popup = <ul>
          <li>Swift (XCode)</li>
          <li>REST Api</li>
        </ul>
        break;
      case 'portfolio_site':
        popup = <ul>
          <li>ReactJs</li>
          <li>SASS</li>
          <li>React Router</li>
        </ul>
        break;
      case 'old_portfolio':
        popup = <ul>
          <li>PHP</li>
          <li>JavaScript</li>
        </ul>
        break;
      case 'laptops_catalog':
        popup = <ul>
          <li>PHP</li>
          <li>MariaDB (MySQL)</li>
        </ul>
        break;
      case 'eonet_viewer':
        popup = <ul>
          <li>React.js</li>
          <li>Rest API (EONET NASA)</li>
          <li>Google Maps JavaScript API</li>
        </ul>
        break;
    }
    return popup;
  }

  const showItem = (item) => {
    console.log('Will show item here', item);
  }

  return (
    <div id={id} className="projects">
      <div className="projects-inner">
        <h4>{title}</h4>
        <div className="projects-container">
          {
            data.map((item, i) => (
              <div key={i} onClick={() => showItem(item)} onMouseEnter={() => setProjectHover(true)} onMouseLeave={() => setProjectHover(false)} data-for='info-tool-tip' data-tip='la_auto'>
                <img src={item.image} alt={item.title} />
                <div>{item.title}</div>
              </div>
            ))
          }
        </div>
        <ReactTooltip className='tool-tip' id='info-tool-tip' getContent={(dataTip) => setDataTip(dataTip)} >
          <div>
            <span>Technologies Used: </span>
            {getPopup()}
          </div>
        </ReactTooltip>
      </div>
    </div>
  );
};

export default Projects;
