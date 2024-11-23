import React from "react";
import Projects from "../common/projects";

// Image Imports
import sunshine_url from "../../images/sunshine-meme.gif";
import geo_covid_url from "../../images/geo-covid.JPG";
import highway_dodge_url from "../../images/highway_dodge.JPG";
import bee_chat_url from "../../images/bee-chat.JPG";
import la_auto_detail_url from "../../images/la-auto-detail.JPG";
import wallify_url from "../../images/wallify.JPG";
import color_app_url from "../../images/color-app.JPG";
import digital_resume_url from "../../images/digital-resume.jpg";
import portfolio_site_url from "../../images/portfolio-site.JPG";
import eonet_viewer_url from "../../images/eonet-viewer.JPG";

const oldProjectsData = [
    { title: 'Resume Assignment', url: 'https://github.com/skurnal2/ResumeAssignment', image: digital_resume_url },
    { title: 'Sunshine Meme Generator', url: 'https://skurnal2.github.io/Sunshine-Meme-Generator/', image: sunshine_url },
    { title: 'Geo COVID Tracker', url: 'https://geocovid.netlify.app/', image: geo_covid_url },
    { title: 'Highway Dodge', url: 'https://github.com/skurnal2/HighwayDodge', image: highway_dodge_url },
    { title: 'Bee Chat', url: 'https://github.com/skurnal2/ReactProjects/tree/master/bee-chat-web', image: bee_chat_url },
    { title: 'LA Auto Detail', url: 'http://laautodetail.com/', image: la_auto_detail_url },
    { title: 'Wallify', url: 'https://github.com/skurnal2/ReactProjects/tree/master/wallify', image: wallify_url },
    { title: 'Color App', url: 'https://github.com/skurnal2/ColorApp', image: color_app_url },
    { title: 'Portfolio Website', url: 'https://github.com/skurnal2/portfolio-website-sid', image: portfolio_site_url },
    { title: 'EONET Viewer', url: 'https://eonet-viewer.netlify.app/', image: eonet_viewer_url }
]


const OldProjects = () => {
    return(
        <Projects title="Old Projects" data={oldProjectsData}/>
    );
}

export default OldProjects;