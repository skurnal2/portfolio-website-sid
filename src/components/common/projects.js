//Imports
import React, { useState } from "react";
import ReactTooltip from 'react-tooltip';

//Style Imports
import "../../css/projects-page.scss";

const Projects = ({
  id = "",
  title = "Projects",
  data = [],
  containerProps,
  projectItemProps
}) => {

  const [dataTip, setDataTip] = useState('');

  //Setting the popup based on hover
  const getPopup = () => {
    const proj = data.find(obj => obj.key == dataTip);
    if(proj) {
      return(
        <ul>
          {
            proj.content.map(content => (
              <li>{content}</li>
            ))
          }
        </ul>
      );
    }
    return null;
  }
  const popup = getPopup();
  console.log(popup);

  const showItem = (item) => {
    console.log('Will show item here', item);
  }

  return (
    <div id={id} className="project-section" {...containerProps}>
      {dataTip}
      <div className="project-section-inner">
        <h5>{title}</h5>
        <div className="project-section-container">
          {
            data.map(item => (
              <div key={item.key} onClick={() => showItem(item)} data-for='info-tool-tip' data-tip={item.key} {...projectItemProps}>
                ~{item.key}~data
                <img src={item.image} alt={item.title} />d
                <div>{item.title}</div>
              </div>
            ))
          }
        </div>
        {
          popup &&
          <ReactTooltip className='tool-tip' id='info-tool-tip' getContent={(dataTip) => setDataTip(dataTip)} >
            <div>
              <span>Technologies Used: </span>
              {getPopup()}
            </div>
          </ReactTooltip>
        }
      </div>
    </div>
  );
};

export default Projects;
