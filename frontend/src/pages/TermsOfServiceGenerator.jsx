import { Download, Copy, Scale } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultTermsOfService } from "../data/legal";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const fields = [
  { id: "companyName", label: "Company name" },
  { id: "companyNumber", label: "Companies House no." },
  { id: "companyAddress", label: "Company address", textarea: true },
  { id: "websiteUrl", label: "Website URL" },
  { id: "contactEmail", label: "Support contact email" },
  { id: "effectiveDate", label: "Effective date", type: "date" },
  { id: "serviceDescription", label: "Service description", textarea: true },
  { id: "acceptance", label: "Acceptance clause", textarea: true },
  { id: "accountTerms", label: "Account terms", textarea: true },
  { id: "payment", label: "Payment terms", textarea: true },
  { id: "ip", label: "Intellectual property", textarea: true },
  { id: "acceptableUse", label: "Acceptable use", textarea: true },
  { id: "termination", label: "Termination", textarea: true },
  { id: "liability", label: "Liability", textarea: true },
  { id: "warranties", label: "Warranties / disclaimers", textarea: true },
  { id: "indemnity", label: "Indemnity", textarea: true },
  { id: "governingLaw", label: "Governing law clause", textarea: true },
  { id: "contactNotice", label: "Notices & changes", textarea: true },
];

export default function TermsOfServiceGenerator() {
  const [terms, setTerms] = useLocalStorage("legal-terms-of-service", defaultTermsOfService());
  const previewId = "terms-of-service-preview";
  const update = (field, value) => setTerms({ ...terms, [field]: value });
  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="terms-of-service-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Scale size={14} /> Compliance & Legal</p>
          <h1>Terms of Service Generator</h1>
          <p>Standard terms covering use, payment, intellectual property, liability cap, and termination — for a UK SaaS or service website. Always have a UK-qualified lawyer review before publishing.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(terms.companyName || "company").replace(/\s+/g, "-")}-terms-of-service.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Terms fields</h2>
        <div className="hiring-form-grid">
          {fields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={terms[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`tos-field-${field.id}`} />
                : <input type={field.type || "text"} value={terms[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`tos-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Terms preview</h2>
        <div id={previewId} className="hiring-document" data-testid="terms-of-service-preview">
          <header>
            <p className="eyebrow">Terms of Service</p>
            <h1>{terms.companyName} Terms of Service</h1>
            <p>Effective {terms.effectiveDate} · {terms.websiteUrl}</p>
          </header>

          <h3>1. The Service</h3>
          <p>{terms.serviceDescription}</p>

          <h3>2. Acceptance</h3>
          <p>{terms.acceptance}</p>

          <h3>3. Accounts</h3>
          <p>{terms.accountTerms}</p>

          <h3>4. Fees & payment</h3>
          <p>{terms.payment}</p>

          <h3>5. Intellectual property</h3>
          <p>{terms.ip}</p>

          <h3>6. Acceptable use</h3>
          <p>{terms.acceptableUse}</p>

          <h3>7. Termination</h3>
          <p>{terms.termination}</p>

          <h3>8. Warranties & disclaimers</h3>
          <p>{terms.warranties}</p>

          <h3>9. Liability</h3>
          <p>{terms.liability}</p>

          <h3>10. Indemnity</h3>
          <p>{terms.indemnity}</p>

          <h3>11. Governing law & jurisdiction</h3>
          <p>{terms.governingLaw}</p>

          <h3>12. Notices & changes</h3>
          <p>{terms.contactNotice}</p>

          <p>Contact: {terms.contactEmail} · {terms.companyName}, company no. {terms.companyNumber}, {terms.companyAddress}</p>
        </div>
      </section>

      <PremiumCapture source="terms-of-service-generator" />
    </div>
  );
}
