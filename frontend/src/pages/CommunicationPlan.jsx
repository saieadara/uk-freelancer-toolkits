import { Plus, Trash2, MessageSquare, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultCommsPlan } from "../data/projectManagement";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `c-${Math.random().toString(36).slice(2, 8)}`;

export default function CommunicationPlan() {
  const [plan, setPlan] = useLocalStorage("pm-comms-plan", defaultCommsPlan());
  const previewId = "comms-plan-preview";

  const update = (field, value) => setPlan({ ...plan, [field]: value });
  const updateRow = (id, field, value) => setPlan({ ...plan, rows: plan.rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)) });
  const removeRow = (id) => setPlan({ ...plan, rows: plan.rows.filter((r) => r.id !== id) });
  const addRow = () => setPlan({ ...plan, rows: [...plan.rows, { id: newId(), audience: "", message: "", channel: "", frequency: "", owner: "" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="comms-plan-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><MessageSquare size={14} /> Project Manager</p>
          <h1>Stakeholder Communication Plan</h1>
          <p>Audience, message, channel, frequency, owner. The plan you commit to in week one and update at every stage gate.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(plan.projectName || "comms-plan").replace(/\s+/g, "-")}-comms-plan.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Plan header</h2>
        <div className="hiring-form-grid">
          <label>Project<input value={plan.projectName} onChange={(event) => update("projectName", event.target.value)} /></label>
          <label>Date<input type="date" value={plan.date} onChange={(event) => update("date", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="comms-rows-panel">
        <div className="panel-heading">
          <h2>Communications</h2>
          <button className="secondary-button" onClick={addRow}><Plus size={16} /> Add row</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid">
            <thead><tr><th>Audience</th><th>Message</th><th>Channel</th><th>Frequency</th><th>Owner</th><th></th></tr></thead>
            <tbody>
              {plan.rows.map((r) => (
                <tr key={r.id}>
                  <td><input value={r.audience} onChange={(event) => updateRow(r.id, "audience", event.target.value)} /></td>
                  <td><input value={r.message} onChange={(event) => updateRow(r.id, "message", event.target.value)} /></td>
                  <td><input value={r.channel} onChange={(event) => updateRow(r.id, "channel", event.target.value)} /></td>
                  <td><input value={r.frequency} onChange={(event) => updateRow(r.id, "frequency", event.target.value)} /></td>
                  <td><input value={r.owner} onChange={(event) => updateRow(r.id, "owner", event.target.value)} /></td>
                  <td><button className="icon-button" onClick={() => removeRow(r.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Plan preview</h2>
        <div id={previewId} className="hiring-document" data-testid="comms-plan-preview">
          <header>
            <p className="eyebrow">Communication Plan</p>
            <h1>{plan.projectName}</h1>
            <p>{plan.date}</p>
          </header>
          <table className="legal-cookie-table">
            <thead><tr><th>Audience</th><th>Message</th><th>Channel</th><th>Frequency</th><th>Owner</th></tr></thead>
            <tbody>
              {plan.rows.map((r) => (
                <tr key={r.id}><td><strong>{r.audience}</strong></td><td>{r.message}</td><td>{r.channel}</td><td>{r.frequency}</td><td>{r.owner}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PremiumCapture source="comms-plan" />
    </div>
  );
}
