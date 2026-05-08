import { useMemo } from "react";
import { Plus, Trash2, AlertTriangle, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultRiskRegister } from "../data/projectManagement";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `rsk-${Math.random().toString(36).slice(2, 8)}`;

const severity = (score) => {
  if (score >= 16) return { label: "Critical", className: "fail" };
  if (score >= 9) return { label: "High", className: "fail" };
  if (score >= 5) return { label: "Medium", className: "" };
  return { label: "Low", className: "pass" };
};

export default function RiskRegister() {
  const [register, setRegister] = useLocalStorage("pm-risk-register", defaultRiskRegister());
  const previewId = "risk-register-preview";

  const update = (field, value) => setRegister({ ...register, [field]: value });
  const updateRow = (id, field, value) => {
    const numericFields = ["probability", "impact"];
    setRegister({ ...register, risks: register.risks.map((r) => (r.id === id ? { ...r, [field]: numericFields.includes(field) ? Math.max(1, Math.min(5, Number(value))) : value } : r)) });
  };
  const removeRow = (id) => setRegister({ ...register, risks: register.risks.filter((r) => r.id !== id) });
  const addRow = () => setRegister({ ...register, risks: [...register.risks, { id: newId(), risk: "New risk", probability: 3, impact: 3, owner: "", mitigation: "" }] });

  const sorted = useMemo(() => {
    return register.risks
      .map((r) => ({ ...r, score: Number(r.probability || 0) * Number(r.impact || 0) }))
      .sort((a, b) => b.score - a.score);
  }, [register.risks]);

  const summary = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    sorted.forEach((r) => { counts[severity(r.score).label] += 1; });
    return counts;
  }, [sorted]);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="risk-register-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><AlertTriangle size={14} /> Project Manager</p>
          <h1>Risk Register</h1>
          <p>Risk, probability (1–5), impact (1–5), owner, mitigation. Score = P × I; the table sorts highest first and labels each risk Critical / High / Medium / Low.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(register.projectName || "risks").replace(/\s+/g, "-")}-risk-register.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Register</h2>
        <div className="hiring-form-grid">
          <label>Project<input value={register.projectName} onChange={(event) => update("projectName", event.target.value)} /></label>
          <label>Date<input type="date" value={register.date} onChange={(event) => update("date", event.target.value)} /></label>
        </div>
        <div className="result-grid">
          <div><span>Critical</span><strong>{summary.Critical}</strong></div>
          <div><span>High</span><strong>{summary.High}</strong></div>
          <div><span>Medium</span><strong>{summary.Medium}</strong></div>
          <div><span>Low</span><strong>{summary.Low}</strong></div>
        </div>
      </section>

      <section className="calculator-panel" data-testid="risk-register-grid-panel">
        <div className="panel-heading">
          <h2>Risks (auto-sorted)</h2>
          <button className="secondary-button" onClick={addRow}><Plus size={16} /> Add risk</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid risk-grid">
            <thead><tr><th>Risk</th><th>P (1-5)</th><th>I (1-5)</th><th>Score</th><th>Severity</th><th>Owner</th><th>Mitigation</th><th></th></tr></thead>
            <tbody>
              {sorted.map((r) => {
                const sev = severity(r.score);
                return (
                  <tr key={r.id} className={`risk-row risk-row-${sev.label.toLowerCase()}`} data-testid={`risk-row-${r.id}`}>
                    <td><input value={r.risk} onChange={(event) => updateRow(r.id, "risk", event.target.value)} /></td>
                    <td><input type="number" min="1" max="5" value={r.probability} onChange={(event) => updateRow(r.id, "probability", event.target.value)} /></td>
                    <td><input type="number" min="1" max="5" value={r.impact} onChange={(event) => updateRow(r.id, "impact", event.target.value)} /></td>
                    <td><strong>{r.score}</strong></td>
                    <td>{sev.label}</td>
                    <td><input value={r.owner} onChange={(event) => updateRow(r.id, "owner", event.target.value)} /></td>
                    <td><input value={r.mitigation} onChange={(event) => updateRow(r.id, "mitigation", event.target.value)} /></td>
                    <td><button className="icon-button" onClick={() => removeRow(r.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Register preview</h2>
        <div id={previewId} className="hiring-document" data-testid="risk-register-preview">
          <header>
            <p className="eyebrow">Risk Register</p>
            <h1>{register.projectName}</h1>
            <p>{register.date} · {sorted.length} risks · {summary.Critical} critical · {summary.High} high</p>
          </header>
          <table className="legal-cookie-table">
            <thead><tr><th>#</th><th>Risk</th><th>P</th><th>I</th><th>Score</th><th>Severity</th><th>Owner</th><th>Mitigation</th></tr></thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td><strong>{r.risk}</strong></td>
                  <td>{r.probability}</td>
                  <td>{r.impact}</td>
                  <td>{r.score}</td>
                  <td>{severity(r.score).label}</td>
                  <td>{r.owner}</td>
                  <td>{r.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PremiumCapture source="risk-register" />
    </div>
  );
}
