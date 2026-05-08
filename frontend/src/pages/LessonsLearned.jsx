import { Plus, Trash2, BookOpen, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultLessonsLearned } from "../data/projectManagement";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `ll-${Math.random().toString(36).slice(2, 8)}`;

const categories = ["What worked", "What didn't", "Recommendation"];

export default function LessonsLearned() {
  const [log, setLog] = useLocalStorage("pm-lessons-learned", defaultLessonsLearned());
  const previewId = "lessons-learned-preview";

  const update = (field, value) => setLog({ ...log, [field]: value });
  const updateRow = (id, field, value) => setLog({ ...log, rows: log.rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)) });
  const removeRow = (id) => setLog({ ...log, rows: log.rows.filter((r) => r.id !== id) });
  const addRow = (category = "What worked") => setLog({ ...log, rows: [...log.rows, { id: newId(), category, label: "", detail: "", recommendation: "" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="lessons-learned-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><BookOpen size={14} /> Project Manager</p>
          <h1>Lessons-learned Log</h1>
          <p>What worked, what didn't, what you'd recommend next time. Run at end of phase or end of project — share before memory fades.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(log.projectName || "lessons").replace(/\s+/g, "-")}-lessons-learned.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Log header</h2>
        <div className="hiring-form-grid">
          <label>Project<input value={log.projectName} onChange={(event) => update("projectName", event.target.value)} /></label>
          <label>Phase<input value={log.phase} onChange={(event) => update("phase", event.target.value)} /></label>
          <label>Date<input type="date" value={log.date} onChange={(event) => update("date", event.target.value)} /></label>
          <label>PM<input value={log.pm} onChange={(event) => update("pm", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="lessons-grid-panel">
        <div className="panel-heading">
          <h2>Lessons</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <button key={c} className="secondary-button" onClick={() => addRow(c)}><Plus size={14} /> {c}</button>
            ))}
          </div>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid">
            <thead><tr><th>Category</th><th>Label</th><th>Detail</th><th>Recommendation</th><th></th></tr></thead>
            <tbody>
              {log.rows.map((r) => (
                <tr key={r.id}>
                  <td><select value={r.category} onChange={(event) => updateRow(r.id, "category", event.target.value)}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></td>
                  <td><input value={r.label} onChange={(event) => updateRow(r.id, "label", event.target.value)} /></td>
                  <td><input value={r.detail} onChange={(event) => updateRow(r.id, "detail", event.target.value)} /></td>
                  <td><input value={r.recommendation} onChange={(event) => updateRow(r.id, "recommendation", event.target.value)} /></td>
                  <td><button className="icon-button" onClick={() => removeRow(r.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Log preview</h2>
        <div id={previewId} className="hiring-document" data-testid="lessons-learned-preview">
          <header>
            <p className="eyebrow">Lessons Learned · {log.phase}</p>
            <h1>{log.projectName}</h1>
            <p>{log.date} · PM {log.pm}</p>
          </header>
          {categories.map((c) => {
            const rows = log.rows.filter((r) => r.category === c);
            if (rows.length === 0) return null;
            return (
              <div key={c}>
                <h3>{c}</h3>
                <ul>
                  {rows.map((r) => <li key={r.id}><strong>{r.label}</strong> — {r.detail} <em>(Recommendation: {r.recommendation})</em></li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <PremiumCapture source="lessons-learned" />
    </div>
  );
}
