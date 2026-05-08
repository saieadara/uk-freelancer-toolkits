import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { pmCards } from "../data/projectManagement";
import { PlanningCard } from "../components/PlanningCard";

export default function ProjectManagementHome() {
  return (
    <div className="page pm-home" data-testid="project-management-home-page">
      <section className="home-hero startup-hero">
        <div className="hero-copy reveal">
          <p className="eyebrow"><ClipboardCheck size={14} /> Project Manager</p>
          <h1>Eight delivery workhorses on one screen — charter, RACI, risks, RAG, comms, change, lessons, roadmap.</h1>
          <p>The toolkit a permanent or interim PM reaches for week one of any project. Pre-loaded with realistic Open Banking examples that you can re-skin in five minutes.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/project-management/rag-status">Run weekly status <ArrowRight size={17} /></Link>
            <Link className="secondary-button" to="/project-management/risk-register">Open risk register</Link>
          </div>
        </div>
        <aside className="startup-preview-stack reveal" style={{ animationDelay: "120ms" }}>
          <div className="startup-mini-page"><span>01</span><strong>Charter · RACI</strong></div>
          <div className="startup-mini-page"><span>02</span><strong>Risks · RAG · Change</strong></div>
          <div className="startup-mini-page"><span>03</span><strong>Comms · Lessons · Roadmap</strong></div>
        </aside>
      </section>
      <section className="tool-grid-section">
        <div className="section-kicker">
          <span>Project Manager directory</span>
          <h2>Eight templates plus IR35, day-rate, and contract review for interim PMs.</h2>
        </div>
        <div className="tool-grid">
          {pmCards.map((tool, index) => <PlanningCard key={tool.id} tool={tool} index={index} />)}
        </div>
      </section>
    </div>
  );
}
