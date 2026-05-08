import { Link } from "react-router-dom";
import { ArrowRight, Microscope } from "lucide-react";
import { baCards } from "../data/businessAnalysis";
import { PlanningCard } from "../components/PlanningCard";

export default function BusinessAnalysisHome() {
  return (
    <div className="page ba-home" data-testid="business-analysis-home-page">
      <section className="home-hero startup-hero">
        <div className="hero-copy reveal">
          <p className="eyebrow"><Microscope size={14} /> Business Analyst</p>
          <h1>Eight BA workhorses on one screen — BRD, traceability, process flow, data dictionary, gap, stakeholders, use case, acceptance.</h1>
          <p>The classic toolkit a contract or in-house BA reaches for week one of any engagement. Pre-loaded with realistic Open Banking examples.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/business-analysis/brd">Build BRD <ArrowRight size={17} /></Link>
            <Link className="secondary-button" to="/business-analysis/process-flow">Map As-Is / To-Be</Link>
          </div>
        </div>
        <aside className="startup-preview-stack reveal" style={{ animationDelay: "120ms" }}>
          <div className="startup-mini-page"><span>01</span><strong>BRD · Traceability</strong></div>
          <div className="startup-mini-page"><span>02</span><strong>Process · Data dictionary</strong></div>
          <div className="startup-mini-page"><span>03</span><strong>Use case · Acceptance criteria</strong></div>
        </aside>
      </section>
      <section className="tool-grid-section">
        <div className="section-kicker">
          <span>Business Analysis directory</span>
          <h2>Eight templates plus IR35, day-rate, and consulting contract for contract BAs.</h2>
        </div>
        <div className="tool-grid">
          {baCards.map((tool, index) => <PlanningCard key={tool.id} tool={tool} index={index} />)}
        </div>
      </section>
    </div>
  );
}
