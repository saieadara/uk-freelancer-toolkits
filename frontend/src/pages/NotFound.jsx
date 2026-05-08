import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page narrow-page" data-testid="not-found-page">
      <section className="tool-intro" data-testid="not-found-intro-section">
        <div>
          <p className="eyebrow" data-testid="not-found-eyebrow">Tool not available</p>
          <h1 data-testid="not-found-title">This tool is not in the toolkit yet.</h1>
          <p data-testid="not-found-description">Choose an available calculator from the Budget & Planning Toolkit or return to the main freelancer tools.</p>
        </div>
      </section>
      <div className="hero-actions" data-testid="not-found-actions">
        <Link className="primary-button" to="/planning" data-testid="not-found-planning-link">Open Planning Toolkit <ArrowRight size={17} /></Link>
        <Link className="secondary-button" to="/" data-testid="not-found-home-link">Back to UK Freelancer Toolkit</Link>
      </div>
    </div>
  );
}