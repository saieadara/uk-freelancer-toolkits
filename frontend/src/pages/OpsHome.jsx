import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { opsCards } from "../data/ops";
import { PlanningCard } from "../components/PlanningCard";

export default function OpsHome() {
  return (
    <div className="page ops-home" data-testid="ops-home-page">
      <section className="home-hero startup-hero">
        <div className="hero-copy reveal">
          <p className="eyebrow"><Compass size={14} /> Ops & Growth</p>
          <h1>Run the business deliberately — split equity, ship goals, talk to customers, beat competitors.</h1>
          <p>Co-founder agreements with vesting, OKR tracking, customer interview scripts, and a competitor analysis matrix. Move from idea to operating company.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/ops/founder-agreement">Build founder agreement <ArrowRight size={17} /></Link>
            <Link className="secondary-button" to="/ops/okr-tracker">Open OKR tracker</Link>
          </div>
        </div>
        <aside className="startup-preview-stack reveal" style={{ animationDelay: "120ms" }}>
          <div className="startup-mini-page"><span>01</span><strong>Founder agreement</strong></div>
          <div className="startup-mini-page"><span>02</span><strong>OKR tracker</strong></div>
          <div className="startup-mini-page"><span>03</span><strong>Interviews + matrix</strong></div>
        </aside>
      </section>
      <section className="tool-grid-section">
        <div className="section-kicker">
          <span>Ops directory</span>
          <h2>Operating habits that compound — equity, goals, customer voice, and positioning.</h2>
        </div>
        <div className="tool-grid">
          {opsCards.map((tool, index) => <PlanningCard key={tool.id} tool={tool} index={index} />)}
        </div>
      </section>
    </div>
  );
}
