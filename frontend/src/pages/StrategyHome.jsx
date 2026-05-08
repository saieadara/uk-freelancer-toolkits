import { Link } from "react-router-dom";
import { ArrowRight, Crosshair } from "lucide-react";
import { strategyCards } from "../data/strategy";
import { PlanningCard } from "../components/PlanningCard";

export default function StrategyHome() {
  return (
    <div className="page strategy-home" data-testid="strategy-home-page">
      <section className="home-hero startup-hero">
        <div className="hero-copy reveal">
          <p className="eyebrow"><Crosshair size={14} /> Strategy Consultant</p>
          <h1>Eight consulting workhorses on one screen — SWOT, Five Forces, market sizing, 2×2, exec summary, issue tree, charter, options memo.</h1>
          <p>The classic toolkit a strategy consultant reaches for in week one of any engagement, fast and exportable. Pre-loaded with realistic Northstar examples.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/strategy/exec-summary">Draft exec summary <ArrowRight size={17} /></Link>
            <Link className="secondary-button" to="/strategy/two-by-two">Open 2×2 matrix</Link>
          </div>
        </div>
        <aside className="startup-preview-stack reveal" style={{ animationDelay: "120ms" }}>
          <div className="startup-mini-page"><span>01</span><strong>SWOT · Five Forces</strong></div>
          <div className="startup-mini-page"><span>02</span><strong>Market sizing · 2×2</strong></div>
          <div className="startup-mini-page"><span>03</span><strong>Charter · options memo</strong></div>
        </aside>
      </section>
      <section className="tool-grid-section">
        <div className="section-kicker">
          <span>Strategy directory</span>
          <h2>Eight templates plus a cross-sell to IR35, day-rate, and consulting contract for independent consultants.</h2>
        </div>
        <div className="tool-grid">
          {strategyCards.map((tool, index) => <PlanningCard key={tool.id} tool={tool} index={index} />)}
        </div>
      </section>
    </div>
  );
}
