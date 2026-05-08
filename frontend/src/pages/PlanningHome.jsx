import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { planningCards } from "../data/planningTools";
import { PlanningCard } from "../components/PlanningCard";

export default function PlanningHome() {
  return (
    <div className="page planning-home" data-testid="planning-home-page">
      <section className="home-hero planning-hero" data-testid="planning-hero-section">
        <div className="hero-copy reveal" data-testid="planning-hero-copy">
          <p className="eyebrow" data-testid="planning-hero-eyebrow"><LayoutGrid size={14} /> Budget & Planning Toolkit</p>
          <h1 data-testid="planning-hero-title">Plan money, milestones, and focus before the week gets messy.</h1>
          <p data-testid="planning-hero-description">A separate toolkit for everyday budgeting, wedding planning, business costs, startup expenses, goal execution, and screen-time reduction.</p>
          <div className="hero-actions" data-testid="planning-hero-actions">
            <Link className="primary-button" to="/planning/uk-budget-planner" data-testid="planning-primary-budget-cta">Open UK budget planner <ArrowRight size={17} /></Link>
            <Link className="secondary-button" to="/planning/goal-productivity-calculator" data-testid="planning-secondary-goal-cta">Plan a goal</Link>
            <Link className="secondary-button" to="/planning/digital-detox-calculator" data-testid="planning-secondary-detox-cta">Calculate detox time</Link>
          </div>
        </div>
        <aside className="planning-ledger reveal" data-testid="planning-hero-ledger" style={{ animationDelay: "120ms" }}>
          <div className="ledger-row"><span>Budget</span><strong>£3,200</strong></div>
          <div className="ledger-row"><span>Planned</span><strong>£2,940</strong></div>
          <div className="ledger-row is-good"><span>Remaining</span><strong>£260</strong></div>
          <div className="ledger-note" data-testid="planning-hero-ledger-note">Downloadable summaries included</div>
        </aside>
      </section>

      <section className="tool-grid-section" data-testid="planning-tool-directory-section">
        <div className="section-kicker" data-testid="planning-tool-directory-heading">
          <span>Planning directory</span>
          <h2>Focused calculators for budgets, goals, productivity, and digital detox.</h2>
        </div>
        <div className="tool-grid" data-testid="planning-tool-card-grid">
          {planningCards.map((tool, index) => <PlanningCard key={tool.id} tool={tool} index={index} />)}
        </div>
      </section>
    </div>
  );
}