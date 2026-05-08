import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { hiringCards } from "../data/hiring";
import { PlanningCard } from "../components/PlanningCard";

export default function HiringHome() {
  return (
    <div className="page hiring-home" data-testid="hiring-home-page">
      <section className="home-hero startup-hero" data-testid="hiring-hero-section">
        <div className="hero-copy reveal">
          <p className="eyebrow"><Users size={14} /> Hiring & Contracts</p>
          <h1>Hire your first employees and contractors with confidence.</h1>
          <p>UK-aware employment contracts, offer letters, EMI option grants, and NDAs. Fill in the fields, preview the document, and export to PDF or copy to your editor of choice.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/hiring/employment-contract">Create employment contract <ArrowRight size={17} /></Link>
            <Link className="secondary-button" to="/hiring/nda">Generate NDA</Link>
          </div>
        </div>
        <aside className="startup-preview-stack reveal" style={{ animationDelay: "120ms" }}>
          <div className="startup-mini-page"><span>01</span><strong>Offer letter</strong></div>
          <div className="startup-mini-page"><span>02</span><strong>Employment contract</strong></div>
          <div className="startup-mini-page"><span>03</span><strong>EMI grant + NDA</strong></div>
        </aside>
      </section>
      <section className="tool-grid-section">
        <div className="section-kicker">
          <span>Hiring directory</span>
          <h2>Documents you'll need from first hire to first option grant.</h2>
        </div>
        <div className="tool-grid">
          {hiringCards.map((tool, index) => <PlanningCard key={tool.id} tool={tool} index={index} />)}
        </div>
      </section>
    </div>
  );
}
