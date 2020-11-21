//Imports
import React, { useState } from "react";
import ReactTooltip from 'react-tooltip';

//Images
import sunshine_url from "../../images/sunshine-meme.gif";
import geo_covid_url from "../../images/geo-covid.JPG";
import highway_dodge_url from "../../images/highway_dodge.JPG";
import bee_chat_url from "../../images/bee-chat.JPG";
import la_auto_detail_url from "../../images/la-auto-detail.JPG";
import wallify_url from "../../images/wallify.JPG";
import color_app_url from "../../images/color-app.JPG";
import digital_resume_url from "../../images/digital-resume.jpg";
import portfolio_site_url from "../../images/portfolio-site.JPG";
import old_portfolio_url from "../../images/old-portfolio.JPG";
import laptops_catalog_url from "../../images/laptops-catalog.JPG";

const Projects = () => {

  const [dataTip, setDataTip] = useState('');

  //Setting the popup based on hover
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
  }

  function goToThisLink(item) {
    switch(item) {
      case 'resume':
        window.open('https://github.com/skurnal2/ResumeAssignment');
        break;
      case 'sunshine':
        window.open('https://skurnal2.github.io/Sunshine-Meme-Generator/');
        break;
      case 'geo_covid':
        window.open('https://geocovid.netlify.app/');
        break;
      case 'highway_dodge':
        window.open('https://github.com/skurnal2/HighwayDodge');
        break;
      case 'bee_chat':
        window.open('https://github.com/skurnal2/ReactProjects/tree/master/bee-chat-web');
        break;
      case 'la_auto':
        window.open('http://laautodetail.com/');
        break;
      case 'wallify':
        window.open('https://github.com/skurnal2/ReactProjects/tree/master/wallify');
        break;
      case 'color_app':
        window.open('https://github.com/skurnal2/ColorApp');
        break;
      case 'portfolio_site':
        window.open('https://github.com/skurnal2/portfolio-website-sid');
        break;
      case 'old_portfolio':
        window.open('https://sidprojectsapp.000webhostapp.com/');
        break;
      case 'laptops_catalog':
        window.open('https://sidprojectsapp.000webhostapp.com/CatalogProject/');
        break;
    }
  }

  return (
    <div className="projects">
      <div className="projects-inner">
        <h4>My Projects</h4>
        <div className="projects-container">
          <div onClick={() => goToThisLink('resume')} data-for='info-tool-tip' data-tip='resume'>
            <img src={digital_resume_url} alt="Siddharth Kurnal Digital Resume" />
            <div>Digital Resume</div>
          </div>          
          <div onClick={() => goToThisLink('sunshine')} data-for='info-tool-tip' data-tip='sunshine'>
            <img src={sunshine_url} alt="Sunshine Meme Generator" />
            <div>Sunshine Meme Generator</div>
          </div>
          <div onClick={() => goToThisLink('geo_covid')} data-for='info-tool-tip' data-tip='geo_covid'>
            <img src={geo_covid_url} alt='Geo Covid' />
            <div>Geo Covid</div>
          </div>
          <div onClick={() => goToThisLink('highway_dodge')} data-for='info-tool-tip' data-tip='highway_dodge'>
            <img src={highway_dodge_url} alt='Highway Dodge' />
            <div>Highway Dodge</div>
          </div>
          <div onClick={() => goToThisLink('bee_chat')} data-for='info-tool-tip' data-tip='bee_chat'>
            <img src={bee_chat_url} alt="Bee Chat" />
            <div>BeeChat</div>
          </div>
          <div onClick={() => goToThisLink('la_auto')} data-for='info-tool-tip' data-tip='la_auto'>
            <img src={la_auto_detail_url} alt="LA Auto Detail" />
            <div>LA Auto Detail</div>
          </div>
          <div onClick={() => goToThisLink('wallify')} data-for='info-tool-tip' data-tip='wallify'>
            <img src={wallify_url} alt="Wallify" />
            <div>Wallify</div>
          </div>
          <div onClick={() => goToThisLink('color_app')} data-for='info-tool-tip' data-tip='color_app'>
            <img src={color_app_url} alt="Color App" />
            <div>ColorApp</div>
          </div>
          <div onClick={() => goToThisLink('portfolio_site')} data-for='info-tool-tip' data-tip='portfolio_site'>
            <img src={portfolio_site_url} alt="Portfolio Site" />
            <div>Potfolio Site</div>
          </div>
          <div onClick={() => goToThisLink('old_portfolio')} data-for='info-tool-tip' data-tip='old_portfolio'>
            <img src={old_portfolio_url} alt="Old Portfolio Site" />
            <div>Old Potfolio Site</div>
          </div>
          <div onClick={() => goToThisLink('laptops_catalog')} data-for='info-tool-tip' data-tip='laptops_catalog'>
            <img src={laptops_catalog_url} alt="Laptops Catalog" />
            <div>Laptops Catalog</div>
          </div>
        </div>
        <ReactTooltip className='tool-tip' id='info-tool-tip' getContent={(dataTip) => setDataTip(dataTip)} >
          <div>
            <span>Technologies Used: </span>
            {popup}
          </div>
        </ReactTooltip>
      </div>
    </div>
  );
};

export default Projects;
