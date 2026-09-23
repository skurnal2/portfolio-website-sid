import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faRobot, faCloud, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import usePinnedStage from "../../hooks/usePinnedStage";
import "../../css/skills.scss";

// What I do and the toolkit, in one pinned section. No education or
// certifications here: Siddharth doesn't want an in-progress cert on the site.
// The toolkit matches the résumé's skills (~/Documents/Tasks/Jobs/builder/profile.mjs):
// only things he has used.
const FOCUS = [
  { icon: faLayerGroup, title: "Full-stack web apps", text: "Front end, APIs and databases, end to end." },
  { icon: faRobot, title: "AI and RAG systems", text: "Agents, retrieval and evaluation that ship." },
  { icon: faCloud, title: "Azure and AWS cloud", text: "Microservices, CI/CD and Kubernetes." },
  { icon: faMobileScreen, title: "Mobile development", text: "Flutter apps that work offline." },
];

const GROUPS = [
  { title: "Backend", items: ["C# / .NET 8", "ASP.NET Core", "Node.js", "Python", "REST APIs", "gRPC", "Kafka", "Microservices"] },
  { title: "Frontend", items: ["Angular", "React / Redux", "TypeScript", "Next.js", "Nx", "Transloco", "Tailwind / SASS", "Flutter"] },
  { title: "AI", items: ["RAG / Embeddings", "Agents / Tool Calling", "Evals / Guardrails", "MCP", "OpenAI / Gemini", "Pinecone", "Claude Code", "GitHub Copilot"] },
  { title: "Cloud & DevOps", items: ["Azure", "AWS", "Azure DevOps", "Kubernetes", "Argo CD", "Docker", "GitHub Actions", "CloudFormation"] },
  { title: "Data", items: ["SQL Server", "Azure SQL", "PostgreSQL", "Cosmos DB", "MySQL", "Redis", "Firebase", "MongoDB"] },
  { title: "Quality & Identity", items: ["Playwright", "Artillery", "Grafana k6", "Unit Testing", "OAuth2 / SSO / SAML", "RBAC / MFA", "Auth0", "WCAG 2.2"] },
];

const Skills = () => {
  const ref = useRef(null);
  // the top row arrives on approach; the rest are dealt in one by one while pinned
  usePinnedStage(ref, { item: ".tk-item", mode: "cascade", lead: 4, perItem: 160 });

  return (
    <section className="tk" id="skills" ref={ref} aria-labelledby="skills-title">
      <h4 id="skills-title" className="sec-head">
        <span className="sec-ring" aria-hidden="true" />
        <span className="sec-num" aria-hidden="true">03</span>
        <span className="sec-title">Skills</span>
        <span className="sec-sub" aria-hidden="true">What I work with</span>
        <span className="sec-rule" aria-hidden="true" />
      </h4>
      <div className="tk-focus">
        {FOCUS.map((f) => (
          <div className="tk-item tk-focus-card" key={f.title}>
            <span className="tk-icon"><FontAwesomeIcon icon={f.icon} /></span>
            <b>{f.title}</b>
            <span>{f.text}</span>
          </div>
        ))}
      </div>
      <div className="tk-body">
        <div className="tk-groups">
          {GROUPS.map((g) => (
            <div className="tk-item tk-group" key={g.title}>
              <h5>{g.title}</h5>
              <ul>{g.items.map((it) => <li className="skills-chip" key={it}>{it}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
