import { Link } from "react-router-dom";
import { ArrowRight, Rocket } from "lucide-react";
import { startupCards } from "../data/startupPlan";
import { PlanningCard } from "../components/PlanningCard";

export default function StartupHome() {
  return (
    <div className="page startup-home" data-testid="startup-home-page">
      <section className="home-hero startup-hero" data-testid="startup-hero-section">
        <div className="hero-copy reveal" data-testid="startup-hero-copy">
          <p className="eyebrow" data-testid="startup-hero-eyebrow"><Rocket size={14} /> Startup Toolkit</p>
          <h1 data-testid="startup-hero-title">Turn a business idea into a polished plan you can edit, export, and share.</h1>
          <p data-testid="startup-hero-description">A focused toolkit for founders who need structured documents, not blank pages. Start with the business plan generator.</p>
          <div className="hero-actions" data-testid="startup-hero-actions">
            <Link className="primary-button" to="/startup/business-plan-generator" data-testid="startup-primary-business-plan-cta">Create business plan <ArrowRight size={17} /></Link>
            <Link className="secondary-button" to="/planning/startup-expense-calculator" data-testid="startup-secondary-expense-cta">Open expense calculator</Link>
          </div>
        </div>
        <aside className="startup-preview-stack reveal" data-testid="startup-hero-preview" style={{ animationDelay: "120ms" }}>
          <div className="startup-mini-page"><span>01</span><strong>Vision & Mission</strong></div>
          <div className="startup-mini-page"><span>02</span><strong>Ideal Client</strong></div>
          <div className="startup-mini-page"><span>03</span><strong>Financial Outlook</strong></div>
        </aside>
      </section>
      <section className="tool-grid-section" data-testid="startup-tool-directory-section">
        <div className="section-kicker" data-testid="startup-tool-directory-heading">
          <span>Startup directory</span>
          <h2>Document generators and planning tools for early-stage founders.</h2>
        </div>
        <div className="tool-grid" data-testid="startup-tool-card-grid">
          {startupCards.map((tool, index) => <PlanningCard key={tool.id} tool={tool} index={index} />)}
        </div>
      </section>
    </div>
  );
}