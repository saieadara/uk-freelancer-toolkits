import { FileEdit, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultChangeRequest } from "../data/projectManagement";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const fields = [
  { id: "crNumber", label: "Change request number" },
  { id: "projectName", label: "Project" },
  { id: "raisedBy", label: "Raised by" },
  { id: "raisedDate", label: "Raised date", type: "date" },
  { id: "decisionDate", label: "Decision date (target)", type: "date" },
  { id: "changeSummary", label: "What's changing", textarea: true },
  { id: "reason", label: "Reason for change", textarea: true },
  { id: "scopeImpact", label: "Impact on scope", textarea: true },
  { id: "costImpact", label: "Impact on cost", textarea: true },
  { id: "timeImpact", label: "Impact on time", textarea: true },
  { id: "riskImpact", label: "Impact on risk", textarea: true },
  { id: "alternativesConsidered", label: "Alternatives considered", textarea: true },
  { id: "recommendation", label: "Recommendation", textarea: true },
  { id: "approverName", label: "Approver name" },
  { id: "approverTitle", label: "Approver title" },
];

const statusOptions = ["Pending", "Approved", "Rejected", "Withdrawn"];

export default function ChangeRequest() {
  const [cr, setCr] = useLocalStorage("pm-change-request", defaultChangeRequest());
  const previewId = "change-request-preview";

  const update = (field, value) => setCr({ ...cr, [field]: value });
  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="change-request-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><FileEdit size={14} /> Project Manager</p>
          <h1>Change Request Form</h1>
          <p>What's changing, impact on scope / cost / time / risk, recommendation, and sign-off lines. Use one CR per discrete change.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(cr.crNumber || "cr").replace(/\s+/g, "-")}-change-request.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Change request fields</h2>
        <div className="hiring-form-grid">
          {fields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={cr[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`cr-field-${field.id}`} />
                : <input type={field.type || "text"} value={cr[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`cr-field-${field.id}`} />}
            </label>
          ))}
          <label>Status<select value={cr.status} onChange={(event) => update("status", event.target.value)}>{statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Form preview</h2>
        <div id={previewId} className="hiring-document" data-testid="change-request-preview">
          <header>
            <p className="eyebrow">Change Request {cr.crNumber}</p>
            <h1>{cr.projectName}</h1>
            <p>Raised {cr.raisedDate} by {cr.raisedBy} · decision target {cr.decisionDate} · status {cr.status}</p>
          </header>

          <h3>1. What's changing</h3>
          <p>{cr.changeSummary}</p>

          <h3>2. Reason</h3>
          <p>{cr.reason}</p>

          <h3>3. Impact</h3>
          <p><strong>Scope:</strong> {cr.scopeImpact}</p>
          <p><strong>Cost:</strong> {cr.costImpact}</p>
          <p><strong>Time:</strong> {cr.timeImpact}</p>
          <p><strong>Risk:</strong> {cr.riskImpact}</p>

          <h3>4. Alternatives considered</h3>
          <p>{cr.alternativesConsidered}</p>

          <h3>5. Recommendation</h3>
          <p>{cr.recommendation}</p>

          <h3>6. Sign-off</h3>
          <div className="hiring-signature-grid">
            <div>
              <p className="signature-line">Raised by {cr.raisedBy}</p>
              <p>Date: {cr.raisedDate}</p>
            </div>
            <div>
              <p className="signature-line">Approved by {cr.approverName}</p>
              <p>{cr.approverTitle} · Date: ____________________</p>
            </div>
          </div>
        </div>
      </section>

      <PremiumCapture source="change-request" />
    </div>
  );
}
