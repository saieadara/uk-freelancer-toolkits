import { Download, Copy, Handshake } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultOfferLetter } from "../data/hiring";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const fields = [
  { id: "companyName", label: "Company name" },
  { id: "companyAddress", label: "Company address", textarea: true },
  { id: "signerName", label: "Signer name" },
  { id: "signerTitle", label: "Signer title" },
  { id: "candidateName", label: "Candidate name" },
  { id: "candidateAddress", label: "Candidate address", textarea: true },
  { id: "jobTitle", label: "Job title" },
  { id: "reportingTo", label: "Reporting to" },
  { id: "startDate", label: "Start date", type: "date" },
  { id: "workLocation", label: "Work location" },
  { id: "salary", label: "Salary" },
  { id: "bonus", label: "Bonus / variable", textarea: true },
  { id: "equity", label: "Equity / options", textarea: true },
  { id: "benefits", label: "Benefits", textarea: true },
  { id: "probation", label: "Probation period" },
  { id: "responseDeadline", label: "Response deadline", type: "date" },
  { id: "conditions", label: "Conditions of offer", textarea: true },
  { id: "closingNote", label: "Closing note", textarea: true },
];

export default function OfferLetterGenerator() {
  const [letter, setLetter] = useLocalStorage("hiring-offer-letter", defaultOfferLetter());
  const previewId = "offer-letter-preview";
  const update = (field, value) => setLetter({ ...letter, [field]: value });
  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="offer-letter-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Handshake size={14} /> Hiring & Contracts</p>
          <h1>Offer Letter Template</h1>
          <p>Send a structured offer with role, salary, start date, and acceptance instructions before issuing the full contract.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(letter.candidateName || "candidate").replace(/\s+/g, "-")}-offer-letter.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Letter fields</h2>
        <div className="hiring-form-grid">
          {fields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={letter[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`offer-field-${field.id}`} />
                : <input type={field.type || "text"} value={letter[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`offer-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Letter preview</h2>
        <div id={previewId} className="hiring-document" data-testid="offer-letter-preview-document">
          <header>
            <h1>{letter.companyName}</h1>
            <p>{letter.companyAddress}</p>
          </header>
          <p>{new Date().toISOString().slice(0, 10)}</p>
          <p><strong>{letter.candidateName}</strong><br />{letter.candidateAddress}</p>
          <h2>Offer of Employment — {letter.jobTitle}</h2>
          <p>Dear {letter.candidateName.split(" ")[0]},</p>
          <p>We are delighted to offer you the position of <strong>{letter.jobTitle}</strong> at {letter.companyName}, reporting to {letter.reportingTo}. Your start date will be {letter.startDate}, working from {letter.workLocation}.</p>

          <h3>Compensation</h3>
          <p>Base salary: {letter.salary}.</p>
          <p>Bonus: {letter.bonus}</p>
          <p>Equity: {letter.equity}</p>

          <h3>Benefits</h3>
          <p>{letter.benefits}</p>

          <h3>Probation</h3>
          <p>This role has a probation period of {letter.probation}.</p>

          <h3>Conditions</h3>
          <p>{letter.conditions}</p>

          <h3>Acceptance</h3>
          <p>To accept this offer, please sign and return a copy of this letter by {letter.responseDeadline}. Following acceptance you will receive the formal employment contract for signature before your start date.</p>

          <p>{letter.closingNote}</p>
          <p>Yours sincerely,</p>
          <div className="hiring-signature-grid">
            <div>
              <p className="signature-line">{letter.signerName}</p>
              <p>{letter.signerTitle}, {letter.companyName}</p>
            </div>
            <div>
              <p className="signature-line">Accepted by {letter.candidateName}</p>
              <p>Date: ____________________</p>
            </div>
          </div>
        </div>
      </section>

      <PremiumCapture source="offer-letter-generator" />
    </div>
  );
}
