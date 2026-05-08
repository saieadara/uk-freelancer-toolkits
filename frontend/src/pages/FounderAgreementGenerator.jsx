import { useMemo } from "react";
import { Download, Copy, Plus, Trash2, Handshake } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultFounderAgreement } from "../data/ops";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `founder-${Math.random().toString(36).slice(2, 8)}`;

const baseFields = [
  { id: "companyName", label: "Company name" },
  { id: "effectiveDate", label: "Effective date", type: "date" },
  { id: "governingLaw", label: "Governing law" },
  { id: "vestingSummary", label: "Vesting summary", textarea: true },
  { id: "ipAssignment", label: "IP assignment", textarea: true },
  { id: "decisionMaking", label: "Decision making", textarea: true },
  { id: "exitClause", label: "Founder exit / leaver clause", textarea: true },
];

export default function FounderAgreementGenerator() {
  const [agreement, setAgreement] = useLocalStorage("ops-founder-agreement", defaultFounderAgreement());
  const previewId = "founder-agreement-preview";

  const update = (field, value) => setAgreement({ ...agreement, [field]: value });

  const updateFounder = (id, field, value) => {
    setAgreement({ ...agreement, founders: agreement.founders.map((row) => (row.id === id ? { ...row, [field]: value } : row)) });
  };
  const removeFounder = (id) => {
    if (agreement.founders.length <= 1) return;
    setAgreement({ ...agreement, founders: agreement.founders.filter((row) => row.id !== id) });
  };
  const addFounder = () => {
    setAgreement({ ...agreement, founders: [...agreement.founders, { id: newId(), name: `Founder ${agreement.founders.length + 1}`, role: "Role", equityPercent: 0, sharesGranted: 0, vestingMonths: 48, cliffMonths: 12, fullTime: true }] });
  };

  const equityTotal = useMemo(() => agreement.founders.reduce((sum, f) => sum + Number(f.equityPercent || 0), 0), [agreement.founders]);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="founder-agreement-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Handshake size={14} /> Ops & Growth</p>
          <h1>Founder Agreement & Vesting</h1>
          <p>Document founder equity splits, roles, vesting schedules, IP assignment, and the leaver clause. Add as a founder side-letter alongside your articles of association.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(agreement.companyName || "company").replace(/\s+/g, "-")}-founder-agreement.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Agreement basics</h2>
        <div className="hiring-form-grid">
          {baseFields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={agreement[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`founder-field-${field.id}`} />
                : <input type={field.type || "text"} value={agreement[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`founder-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <div className="panel-heading">
          <h2>Founders</h2>
          <button className="secondary-button" onClick={addFounder}><Plus size={16} /> Add founder</button>
        </div>
        <div className="line-items">
          {agreement.founders.map((founder) => (
            <div key={founder.id} className="founder-card">
              <div className="hiring-form-grid">
                <label>Name<input value={founder.name} onChange={(event) => updateFounder(founder.id, "name", event.target.value)} /></label>
                <label className="hiring-field-wide">Role<input value={founder.role} onChange={(event) => updateFounder(founder.id, "role", event.target.value)} /></label>
                <label>Equity %<input type="number" value={founder.equityPercent} onChange={(event) => updateFounder(founder.id, "equityPercent", event.target.value)} /></label>
                <label>Shares granted<input type="number" value={founder.sharesGranted} onChange={(event) => updateFounder(founder.id, "sharesGranted", event.target.value)} /></label>
                <label>Vesting months<input type="number" value={founder.vestingMonths} onChange={(event) => updateFounder(founder.id, "vestingMonths", event.target.value)} /></label>
                <label>Cliff months<input type="number" value={founder.cliffMonths} onChange={(event) => updateFounder(founder.id, "cliffMonths", event.target.value)} /></label>
                <label className="checkbox-row hiring-field-wide">
                  <input type="checkbox" checked={!!founder.fullTime} onChange={(event) => updateFounder(founder.id, "fullTime", event.target.checked)} />
                  <span>Full-time commitment</span>
                </label>
              </div>
              <button className="text-button danger" onClick={() => removeFounder(founder.id)} disabled={agreement.founders.length === 1}><Trash2 size={14} /> Remove founder</button>
            </div>
          ))}
        </div>
        <p className={`form-message ${equityTotal !== 100 ? "warn" : ""}`}>Total equity allocated: <strong>{equityTotal}%</strong>{equityTotal !== 100 ? ` — should sum to 100%.` : "."}</p>
      </section>

      <section className="calculator-panel">
        <h2>Agreement preview</h2>
        <div id={previewId} className="hiring-document" data-testid="founder-agreement-preview">
          <header>
            <p className="eyebrow">Founder Agreement</p>
            <h1>{agreement.companyName}</h1>
            <p>Effective {agreement.effectiveDate} · governed by {agreement.governingLaw}</p>
          </header>

          <p>This Agreement is made between the founders listed below ("Founders") in respect of <strong>{agreement.companyName}</strong> ("the Company").</p>

          <h3>1. Founders, roles, and equity</h3>
          <table className="legal-cookie-table">
            <thead><tr><th>Founder</th><th>Role</th><th>Equity %</th><th>Shares</th><th>Vesting</th><th>FT</th></tr></thead>
            <tbody>
              {agreement.founders.map((f) => (
                <tr key={f.id}>
                  <td>{f.name}</td>
                  <td>{f.role}</td>
                  <td>{f.equityPercent}%</td>
                  <td>{Number(f.sharesGranted || 0).toLocaleString()}</td>
                  <td>{f.vestingMonths}mo / {f.cliffMonths}mo cliff</td>
                  <td>{f.fullTime ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>2. Vesting</h3>
          <p>{agreement.vestingSummary}</p>

          <h3>3. Intellectual property</h3>
          <p>{agreement.ipAssignment}</p>

          <h3>4. Decision making</h3>
          <p>{agreement.decisionMaking}</p>

          <h3>5. Founder departures</h3>
          <p>{agreement.exitClause}</p>

          <h3>6. Governing law</h3>
          <p>This Agreement is governed by the laws of {agreement.governingLaw}.</p>

          <div className="hiring-signature-grid">
            {agreement.founders.map((f) => (
              <div key={f.id}>
                <p className="signature-line">Signed by {f.name}</p>
                <p>Date: {agreement.effectiveDate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PremiumCapture source="founder-agreement-generator" />
    </div>
  );
}
