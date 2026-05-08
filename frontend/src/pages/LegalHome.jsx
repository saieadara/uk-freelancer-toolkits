import { Link } from "react-router-dom";
import { ArrowRight, Scale } from "lucide-react";
import { legalCards } from "../data/legal";
import { PlanningCard } from "../components/PlanningCard";

export default function LegalHome() {
  return (
    <div className="page legal-home" data-testid="legal-home-page">
      <section className="home-hero startup-hero">
        <div className="hero-copy reveal">
          <p className="eyebrow"><Scale size={14} /> Compliance & Legal</p>
          <h1>UK GDPR–ready policies and processor agreements without the legal-page bloat.</h1>
          <p>Privacy notices, cookie policies, terms of service, and Article 28 data processing agreements — generated from your details and ready to publish or send.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/legal/privacy-policy">Generate privacy policy <ArrowRight size={17} /></Link>
            <Link className="secondary-button" to="/legal/dpa">Open DPA template</Link>
          </div>
        </div>
        <aside className="startup-preview-stack reveal" style={{ animationDelay: "120ms" }}>
          <div className="startup-mini-page"><span>01</span><strong>Privacy notice</strong></div>
          <div className="startup-mini-page"><span>02</span><strong>Cookie policy</strong></div>
          <div className="startup-mini-page"><span>03</span><strong>Terms + DPA</strong></div>
        </aside>
      </section>
      <section className="tool-grid-section">
        <div className="section-kicker">
          <span>Legal directory</span>
          <h2>The four documents most UK SaaS and service businesses need from day one.</h2>
        </div>
        <div className="tool-grid">
          {legalCards.map((tool, index) => <PlanningCard key={tool.id} tool={tool} index={index} />)}
        </div>
      </section>
    </div>
  );
}
