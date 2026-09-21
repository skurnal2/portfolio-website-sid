import React from "react";

// Cut down from ten. Every entry here is backed by a project further down the
// page — a list that claims everything reads as claiming nothing, and it was
// undercutting how specific the project write-ups are.
const services = [
  "Creative Web Development",
  "AI & RAG Systems",
  "AWS Cloud",
  "Mobile Development"
];

const Services = () => {
  return (
    <div className="services">
      <h4>What I do</h4>
      <div className="services-container">
        {services.map((service) => (
          <span key={service}>{service}</span>
        ))}
      </div>
    </div>
  );
};

export default Services;
