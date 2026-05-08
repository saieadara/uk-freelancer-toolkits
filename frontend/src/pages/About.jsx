import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, GraduationCap, Linkedin, FileText } from "lucide-react";
import saiProfilePhoto from "../assets/sai-eadara-profile.jpeg";

const skills = [
  "Business Analysis",
  "Data Strategy",
  "Process Mapping",
  "Requirements Gathering",
  "Product Documentation",
  "Dashboard Design",
  "Workflow Automation",
  "AI Adoption Research",
  "Small Business Systems",
];

const researchPapers = [
  {
    title: "AI Adoption Barriers in SMEs: Analyzing Through the Technology Organization Environment TOE Framework",
    href: "https://papers.ssrn.com/Sol3/Cf_Dev/AbsByAuth.cfm?per_id=11348209",
    description:
      "Research focused on the practical barriers that small and medium-sized businesses face when adopting AI, viewed through a structured technology, organization, and environment lens.",
  },
];

export default function About() {
  return (
    <div className="page about-page" data-testid="about-page">
      <section className="about-hero" data-testid="about-intro">
        <div className="about-portrait-card" data-testid="about-photo-card">
          <img className="about-portrait" src={saiProfilePhoto} alt="Sai Eadara" data-testid="about-founder-photo" />
          <div>
            <p className="eyebrow">Founder</p>
            <h2>Sai Eadara</h2>
            <p>Business Analyst & Data Strategist</p>
          </div>
          <a className="secondary-button" href="https://www.linkedin.com/in/sai-eadara1996/">
            <Linkedin size={17} /> LinkedIn
          </a>
        </div>

        <div className="about-hero-copy">
          <p className="eyebrow" data-testid="about-eyebrow">About Sai Eadara</p>
          <h1 data-testid="about-title">I build practical web apps and automations for business admin, data, and operations.</h1>
          <p>
            UK Freelancer Toolkit is my live product lab and portfolio. It shows how manual work like
            invoices, contracts, plans, dashboards, policies, product documents, and business reports can
            become guided tools that save time for freelancers, founders, and small businesses.
          </p>
          <p>
            My background combines business analysis, data strategy, research, and hands-on product
            building. The goal is simple: understand the workflow, remove repeated admin, and turn it
            into a clean system people can actually use.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/contact" data-testid="about-contact-link">
              Discuss a custom app <ArrowRight size={17} />
            </Link>
            <Link className="secondary-button" to="/startup/product-business-management" data-testid="about-demo-link">
              View dashboard demo
            </Link>
          </div>
        </div>
      </section>

      <section className="about-split-section" data-testid="about-credentials">
        <article className="about-panel">
          <p className="eyebrow"><GraduationCap size={14} /> Education</p>
          <h2>Nottingham Trent University</h2>
          <p>
            Academic foundation connected with business, data, and applied problem-solving, now used to
            design practical tools for real operational workflows.
          </p>
        </article>

        <article className="about-panel">
          <p className="eyebrow">Current focus</p>
          <h2>Business automation for small teams</h2>
          <p>
            I help turn spreadsheets, repeated documents, manual calculations, and disconnected admin
            steps into lightweight web apps, dashboards, and automation systems.
          </p>
        </article>
      </section>

      <section className="about-section" data-testid="about-skills">
        <div className="section-kicker">
          <span>Skills</span>
          <h2>Where analysis meets practical build work.</h2>
        </div>
        <div className="skill-cloud">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="about-section" data-testid="about-research">
        <div className="section-kicker">
          <span>Research papers</span>
          <h2>Research that supports the toolkit&apos;s automation mindset.</h2>
        </div>
        <div className="research-list">
          {researchPapers.map((paper) => (
            <article className="research-card" key={paper.title}>
              <FileText size={24} />
              <div>
                <h3>{paper.title}</h3>
                <p>{paper.description}</p>
                <a href={paper.href}>
                  View research profile <ExternalLink size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
