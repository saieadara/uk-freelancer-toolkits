import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";
import { productCards } from "../data/product";
import { PlanningCard } from "../components/PlanningCard";

export default function ProductHome() {
  return (
    <div className="page product-home" data-testid="product-home-page">
      <section className="home-hero startup-hero">
        <div className="hero-copy reveal">
          <p className="eyebrow"><ClipboardList size={14} /> Product Management</p>
          <h1>Run product like a discipline — short PRDs, clear scope, owned outcomes.</h1>
          <p>Generate one-page PRDs (Problem, User, Scope, Out-of-scope, Success metric, Risks) for every shortlisted feature. Comes pre-loaded with the current shortlist: PWA, Wizard, Comparator, Open Banking, OCR — owned by Bob.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/product/prd-generator">Open PRD generator <ArrowRight size={17} /></Link>
            <Link className="secondary-button" to="/ops/okr-tracker">Track OKRs</Link>
          </div>
        </div>
        <aside className="startup-preview-stack reveal" style={{ animationDelay: "120ms" }}>
          <div className="startup-mini-page"><span>01</span><strong>Problem · User</strong></div>
          <div className="startup-mini-page"><span>02</span><strong>Scope · Out-of-scope</strong></div>
          <div className="startup-mini-page"><span>03</span><strong>Metric · Risks</strong></div>
        </aside>
      </section>
      <section className="tool-grid-section">
        <div className="section-kicker">
          <span>Product directory</span>
          <h2>Tools that keep product decisions short, evidence-led, and shippable.</h2>
        </div>
        <div className="tool-grid">
          {productCards.map((tool, index) => <PlanningCard key={tool.id} tool={tool} index={index} />)}
        </div>
      </section>
    </div>
  );
}
