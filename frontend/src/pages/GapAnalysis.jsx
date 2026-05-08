import { Plus, Trash2, GitCompareArrows, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultGapAnalysis } from "../data/businessAnalysis";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `gap-${Math.random().toString(36).slice(2, 8)}`;

export default function GapAnalysis() {
  const [analysis, setAnalysis] = useLocalStorage("ba-gap-analysis", defaultGapAnalysis());
  const previewId = "gap-analysis-preview";

  const update = (field, value) => setAnalysis({ ...analysis, [field]: value });
  const updateRow = (id, field, value) => setAnalysis({ ...analysis, rows: analysis.rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)) });
  const removeRow = (id) => setAnalysis({ ...analysis, rows: analysis.rows.filter((r) => r.id !== id) });
  const addRow = () => setAnalysis({ ...analysis, rows: [...analysis.rows, { id: newId(), current: "", future: "", gap: "", action: "", owner: "", deadline: "", priority: "Medium" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="gap-analysis-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><GitCompareArrows size={14} /> Business Analyst</p>
          <h1>Gap Analysis</h1>
          <p>Current state, future state, gap, action, owner, deadline. Each row is a closeable item, not an abstract observation.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(analysis.area || "gap-analysis").replace(/\s+/g, "-")}-gap-analysis.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Scope</h2>
        <div className="hiring-form-grid">
          <label>Area<input value={analysis.area} onChange={(event) => update("area", event.target.value)} /></label>
          <label>Date<input type="date" value={analysis.date} onChange={(event) => update("date", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="gap-analysis-grid-panel">
        <div className="panel-heading">
          <h2>Gaps</h2>
          <button className="secondary-button" onClick={addRow}><Plus size={16} /> Add gap</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid">
            <thead><tr><th>Current</th><th>Future</th><th>Gap</th><th>Action</th><th>Owner</th><th>Deadline</th><th>Priority</th><th></th></tr></thead>
            <tbody>
              {analysis.rows.map((r) => (
                <tr key={r.id}>
                  <td><input value={r.current} onChange={(event) => updateRow(r.id, "current", event.target.value)} /></td>
                  <td><input value={r.future} onChange={(event) => updateRow(r.id, "future", event.target.value)} /></td>
                  <td><input value={r.gap} onChange={(event) => updateRow(r.id, "gap", event.target.value)} /></td>
                  <td><input value={r.action} onChange={(event) => updateRow(r.id, "action", event.target.value)} /></td>
                  <td><input value={r.owner} onChange={(event) => updateRow(r.id, "owner", event.target.value)} /></td>
                  <td><input value={r.deadline} onChange={(event) => updateRow(r.id, "deadline", event.target.value)} /></td>
                  <td><select value={r.priority} onChange={(event) => updateRow(r.id, "priority", event.target.value)}><option>High</option><option>Medium</option><option>Low</option></select></td>
                  <td><button className="icon-button" onClick={() => removeRow(r.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Gap analysis preview</h2>
        <div id={previewId} className="hiring-document" data-testid="gap-analysis-preview">
          <header>
            <p className="eyebrow">Gap Analysis</p>
            <h1>{analysis.area}</h1>
            <p>{analysis.date}</p>
          </header>
          <table className="legal-cookie-table">
            <thead><tr><th>Current</th><th>Future</th><th>Gap</th><th>Action</th><th>Owner</th><th>Deadline</th><th>Priority</th></tr></thead>
            <tbody>
              {analysis.rows.map((r) => (
                <tr key={r.id}><td>{r.current}</td><td>{r.future}</td><td><strong>{r.gap}</strong></td><td>{r.action}</td><td>{r.owner}</td><td>{r.deadline}</td><td>{r.priority}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PremiumCapture source="gap-analysis" />
    </div>
  );
}
