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
    {
        title: "Resume Assignment",
        url: "https://github.com/skurnal2/ResumeAssignment",
        image: digital_resume_url,
        content: ["JQuery", "JSON"],
        key: "resume_assignment",
    },
    {
        title: "Sunshine Meme Generator",
        url: "https://skurnal2.github.io/Sunshine-Meme-Generator/",
        image: sunshine_url,
        content: ["ReactJs", "SVGs"],
        key: "sunshine_meme_generator",
    },
    {
        title: "Geo COVID Tracker",
        url: "https://geocovid.netlify.app/",
        image: geo_covid_url,
        content: ["Google Maps API", "ReactJs", "React-Bootstrap"],
        key: "geo_covid_tracker",
    },
    {
        title: "Highway Dodge",
        url: "https://github.com/skurnal2/HighwayDodge",
        image: highway_dodge_url,
        content: ["Android Studio", "LibGDX", "Java"],
        key: "highway_dodge",
    },
    {
        title: "Bee Chat",
        url: "https://github.com/skurnal2/ReactProjects/tree/master/bee-chat-web",
        image: bee_chat_url,
        content: ["ReactJs", "REST Api", "PHP", "Axios", "Framer Motion"],
        key: "bee_chat",
    },
    {
        title: "LA Auto Detail",
        url: "http://laautodetail.com/",
        image: la_auto_detail_url,
        content: ["ASP.Net (C#)", "MySQL", "Entity Framework", "LINQ", "JQuery"],
        key: "la_auto_detail",
    },
    {
        title: "Wallify",
        url: "https://github.com/skurnal2/ReactProjects/tree/master/wallify",
        image: wallify_url,
        content: ["React Native"],
        key: "wallify",
    },
    {
        title: "Color App",
        url: "https://github.com/skurnal2/ColorApp",
        image: color_app_url,
        content: ["Swift (XCode)", "REST Api"],
        key: "color_app",
    },
    {
        title: "Portfolio Website",
        url: "https://github.com/skurnal2/portfolio-website-sid",
        image: portfolio_site_url,
        content: ["ReactJs", "SASS", "React Router"],
        key: "portfolio_website",
    },
    {
        title: "EONET Viewer",
        url: "https://eonet-viewer.netlify.app/",
        image: eonet_viewer_url,
        content: ["React.js", "Rest API (EONET NASA)", "Google Maps JavaScript API"],
        key: "eonet_viewer",
    },
];

const OldProjects = ({
    containerProps,
    projectItemProps
}) => {
    return(
        <Projects title="Old Projects" data={oldProjectsData} containerProps={containerProps} projectItemProps={projectItemProps}/>
    );
}

export default OldProjects;