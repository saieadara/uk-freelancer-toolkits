import { Plus, Trash2, FileText, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultExecSummary } from "../data/strategy";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const baseFields = [
  { id: "title", label: "Title" },
  { id: "audience", label: "Audience" },
  { id: "date", label: "Date", type: "date" },
  { id: "situation", label: "Situation", textarea: true },
  { id: "complication", label: "Complication", textarea: true },
  { id: "question", label: "Key question", textarea: true },
  { id: "answer", label: "Governing thought (the answer)", textarea: true },
  { id: "recommendation", label: "Recommendation", textarea: true },
];

export default function ExecSummary() {
  const [state, setState] = useLocalStorage("strategy-exec-summary", defaultExecSummary());
  const previewId = "exec-summary-preview";

  const update = (field, value) => setState({ ...state, [field]: value });

  const updateSupport = (id, field, value) => {
    setState({ ...state, supports: state.supports.map((s) => (s.id === id ? { ...s, [field]: value } : s)) });
  };
  const removeSupport = (id) => setState({ ...state, supports: state.supports.filter((s) => s.id !== id) });
  const addSupport = () => setState({ ...state, supports: [...state.supports, { id: newId("sup"), headline: "New supporting point", points: [""] }] });

  const updatePoint = (supId, index, value) => {
    setState({ ...state, supports: state.supports.map((s) => (s.id === supId ? { ...s, points: s.points.map((p, i) => (i === index ? value : p)) } : s)) });
  };
  const addPoint = (supId) => setState({ ...state, supports: state.supports.map((s) => (s.id === supId ? { ...s, points: [...s.points, ""] } : s)) });
  const removePoint = (supId, index) => setState({ ...state, supports: state.supports.map((s) => (s.id === supId ? { ...s, points: s.points.filter((_, i) => i !== index) } : s)) });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="exec-summary-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><FileText size={14} /> Strategy Consultant</p>
          <h1>McKinsey-style Exec Summary</h1>
          <p>Pyramid Principle on one screen — Situation, Complication, Question, Governing thought (Answer), and three supporting points each with sub-bullets.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(state.title || "exec-summary").replace(/\s+/g, "-")}-exec-summary.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Brief</h2>
        <div className="hiring-form-grid">
          {baseFields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={state[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`exec-field-${field.id}`} />
                : <input type={field.type || "text"} value={state[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`exec-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel" data-testid="exec-summary-supports-panel">
        <div className="panel-heading">
          <h2>Supporting points (3 typical)</h2>
          <button className="secondary-button" onClick={addSupport}><Plus size={16} /> Add support</button>
        </div>
        <div className="exec-supports-list">
          {state.supports.map((sup, index) => (
            <div key={sup.id} className="exec-support" data-testid={`exec-support-${index}`}>
              <div className="panel-heading">
                <input className="exec-support-headline" value={sup.headline} onChange={(event) => updateSupport(sup.id, "headline", event.target.value)} placeholder="Support headline" />
                <button className="icon-button" onClick={() => removeSupport(sup.id)} aria-label="Remove"><Trash2 size={14} /></button>
              </div>
              <div className="exec-points-list">
                {sup.points.map((p, i) => (
                  <div key={i} className="line-item-row exec-point-row">
                    <input value={p} onChange={(event) => updatePoint(sup.id, i, event.target.value)} placeholder="Sub-point / evidence" />
                    <button className="icon-button" onClick={() => removePoint(sup.id, i)} aria-label="Remove"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
              <button className="text-button" onClick={() => addPoint(sup.id)}><Plus size={14} /> Add evidence</button>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Pyramid preview</h2>
        <div id={previewId} className="hiring-document" data-testid="exec-summary-preview">
          <header>
            <p className="eyebrow">Executive Summary</p>
            <h1>{state.title}</h1>
            <p>{state.date} · {state.audience}</p>
          </header>

          <h3>Situation</h3>
          <p>{state.situation}</p>

          <h3>Complication</h3>
          <p>{state.complication}</p>

          <h3>Key question</h3>
          <p>{state.question}</p>

          <h3>Governing thought (answer)</h3>
          <p><strong>{state.answer}</strong></p>

          <h3>Supporting points</h3>
          {state.supports.map((sup, index) => (
            <div key={sup.id}>
              <p><strong>{index + 1}. {sup.headline}</strong></p>
              <ul>
                {sup.points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          ))}

          <h3>Recommendation</h3>
          <p>{state.recommendation}</p>
        </div>
      </section>

      <PremiumCapture source="exec-summary" />
    </div>
  );
}
