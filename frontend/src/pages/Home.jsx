import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { toolCards } from "../data/tools";
import { ToolCard } from "../components/ToolCard";
import { PremiumCapture } from "../components/PremiumCapture";

export default function Home() {
  return (
    <div className="page" data-testid="home-page">
      <section className="home-hero" data-testid="home-hero-section">
        <div className="hero-copy reveal" data-testid="home-hero-copy">
          <p className="eyebrow" data-testid="home-hero-eyebrow"><Sparkles size={14} /> UK-specific freelancer admin</p>
          <h1 data-testid="home-hero-title">Invoices, quotes, VAT and tax estimates without accounting software.</h1>
          <p data-testid="home-hero-description">A fast, clean toolkit for UK freelancers who need to open a tool, enter details, download or copy the result, and move on.</p>
          <div className="hero-actions" data-testid="home-hero-actions">
            <Link className="primary-button" to="/invoices" data-testid="home-primary-invoice-cta">Create VAT invoice <ArrowRight size={17} /></Link>
            <Link className="secondary-button" to="/vat-calculator" data-testid="home-secondary-vat-cta">Open VAT calculator</Link>
            <Link className="secondary-button" to="/quotes" data-testid="home-secondary-quote-cta">Create quote</Link>
          </div>
        </div>
        <aside className="hero-paper-stack reveal" data-testid="home-hero-preview" style={{ animationDelay: "120ms" }}>
          <div className="mini-paper" data-testid="home-mini-invoice-card">
            <span>INVOICE</span>
            <strong>£1,800.00</strong>
            <small>VAT included • Ready to export</small>
          </div>
          <div className="mini-metric" data-testid="home-speed-metric">Under 60 seconds for repeat use</div>
        </aside>
      </section>

      <section className="tool-grid-section" data-testid="home-tool-directory-section">
        <div className="section-kicker" data-testid="home-tool-directory-heading">
          <span>Toolkit directory</span>
          <h2>Single-purpose tools for one freelance workflow.</h2>
        </div>
        <div className="tool-grid" data-testid="home-tool-card-grid">
          {toolCards.map((tool, index) => <ToolCard key={tool.id} tool={tool} index={index} />)}
        </div>
      </section>

      <PremiumCapture source="homepage" />
    </div>
  );
}