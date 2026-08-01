import { Linkedin, MessageSquare, Sparkles } from "lucide-react";

const LINKEDIN_URL = "https://www.linkedin.com/in/sai-eadara1996/";

const services = [
  "Custom business dashboards",
  "Building SaaS-based products",
  "Document and PDF automation",
  "Invoice, quote, CRM, and stock systems",
  "Business analysis and project management support",
  "Weekly improvements and support plans",
];

export default function Contact() {
  return (
    <div className="page narrow-page" data-testid="contact-page">
      <section className="tool-intro" data-testid="contact-intro">
        <div>
          <p className="eyebrow" data-testid="contact-eyebrow">Contact us</p>
          <h1 data-testid="contact-title">Tell us what admin you want to automate.</h1>
          <p data-testid="contact-description">
            Use this page to enquire about a custom web app, business dashboard, document generator,
            or automation package for your business.
          </p>
        </div>
      </section>

      <section className="contact-layout" data-testid="contact-content">
        <div className="contact-panel">
          <h2><MessageSquare size={24} /> Project enquiry</h2>
          <p>
            Connect with me on LinkedIn and send a message with your business type, current process,
            and the result you want. For example: &quot;I run a product business and need stock, sales,
            invoices, tasks, and reports in one place.&quot;
          </p>
          <a
            className="primary-button"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="contact-linkedin-link"
          >
            <Linkedin size={17} /> Connect on LinkedIn
          </a>
        </div>

        <div className="contact-panel">
          <h2><Sparkles size={24} /> What we can build</h2>
          <ul>
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
          <p className="contact-note">
            Typical projects can start as a focused prototype, then grow into a hosted system with
            database, authentication, reporting, and CI/CD updates.
          </p>
        </div>
      </section>
    </div>
  );
}
