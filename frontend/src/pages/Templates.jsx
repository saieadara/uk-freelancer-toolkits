import { Link, useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { templatePages } from "../data/tools";
import { PremiumCapture } from "../components/PremiumCapture";
import { downloadElementAsPdf } from "../utils/pdf";

export default function Templates() {
  return (
    <div className="page" data-testid="templates-page">
      <section className="tool-intro" data-testid="templates-intro-section">
        <div>
          <p className="eyebrow" data-testid="templates-intro-eyebrow">Download pages</p>
          <h1 data-testid="templates-intro-title">Free UK freelancer templates</h1>
          <p data-testid="templates-intro-description">Download clean document templates or move straight into the live generators when you need totals and PDF output.</p>
        </div>
      </section>
      <div className="template-grid" data-testid="template-card-grid">
        {templatePages.map((template) => (
          <Link className="template-card" key={template.slug} to={`/templates/${template.slug}`} data-testid={`template-card-${template.slug}`}>
            <span data-testid={`template-keyword-${template.slug}`}>{template.keyword}</span>
            <h2 data-testid={`template-title-${template.slug}`}>{template.title}</h2>
            <p data-testid={`template-description-${template.slug}`}>{template.description}</p>
          </Link>
        ))}
      </div>
      <PremiumCapture source="templates-index" />
    </div>
  );
}

export function TemplatePage() {
  const { slug } = useParams();
  const template = templatePages.find((item) => item.slug === slug) || templatePages[0];
  const previewId = `template-preview-${template.slug}`;
  return (
    <div className="tool-page" data-testid={`template-page-${template.slug}`}>
      <section className="tool-intro" data-testid={`template-intro-${template.slug}`}>
        <div>
          <p className="eyebrow" data-testid={`template-keyword-heading-${template.slug}`}>{template.keyword}</p>
          <h1 data-testid={`template-page-title-${template.slug}`}>{template.title}</h1>
          <p data-testid={`template-page-description-${template.slug}`}>{template.description}</p>
        </div>
        <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${template.slug}.pdf`)} data-testid={`template-download-button-${template.slug}`}><Download size={17} /> Download PDF</button>
      </section>
      <section className="builder-preview-layout template-layout" data-testid={`template-layout-${template.slug}`}>
        <div className="builder-panel template-copy" data-testid={`template-copy-${template.slug}`}>
          <h2 data-testid={`template-when-title-${template.slug}`}>When to use it</h2>
          <p data-testid={`template-when-copy-${template.slug}`}>{template.description} If you need calculations, VAT handling, or a finished document, use the live tool instead.</p>
          <Link className="secondary-button" to={template.toolPath} data-testid={`template-live-tool-link-${template.slug}`}>{template.cta}</Link>
        </div>
        <div className="preview-panel" data-testid={`template-preview-panel-${template.slug}`}>
          <article id={previewId} className="paper-preview template-preview-paper" data-testid={`template-preview-paper-${template.slug}`}>
            <header className="paper-header"><div><h1 data-testid={`template-preview-title-${template.slug}`}>{template.documentType}</h1><p data-testid={`template-preview-number-${template.slug}`}>DOC-001</p></div><div className="paper-party text-right"><strong>Your Business Name</strong><span>Your address\nUnited Kingdom</span></div></header>
            <section className="paper-meta"><div><span className="paper-label">Client</span><strong>Client Name</strong><span>Client address\nUnited Kingdom</span></div><div className="paper-dates"><span>Issue date: YYYY-MM-DD</span><span>Reference: ________</span></div></section>
            <table className="paper-table"><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody><tr><td>Service description</td><td>1</td><td>£0.00</td><td>£0.00</td></tr><tr><td>Additional work</td><td>1</td><td>£0.00</td><td>£0.00</td></tr></tbody></table>
            <section className="paper-totals"><div><span>Subtotal</span><strong>£0.00</strong></div><div><span>VAT</span><strong>£0.00</strong></div><div className="total-line"><span>Total</span><strong>£0.00</strong></div></section>
          </article>
        </div>
      </section>
      <PremiumCapture source={`template-${template.slug}`} />
    </div>
  );
}