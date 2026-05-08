import { Plus, Trash2, Activity, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultRagStatus } from "../data/projectManagement";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const statusOptions = [
  { value: "green", label: "Green · on track" },
  { value: "amber", label: "Amber · at risk" },
  { value: "red", label: "Red · off track" },
];

export default function RagStatusReport() {
  const [report, setReport] = useLocalStorage("pm-rag-status", defaultRagStatus());
  const previewId = "rag-status-preview";

  const update = (field, value) => setReport({ ...report, [field]: value });

  const updateWorkstream = (id, field, value) => setReport({ ...report, workstreams: report.workstreams.map((w) => (w.id === id ? { ...w, [field]: value } : w)) });
  const removeWorkstream = (id) => setReport({ ...report, workstreams: report.workstreams.filter((w) => w.id !== id) });
  const addWorkstream = () => setReport({ ...report, workstreams: [...report.workstreams, { id: newId("ws"), name: "New workstream", status: "green", commentary: "" }] });

  const updateDecision = (id, field, value) => setReport({ ...report, decisions: report.decisions.map((d) => (d.id === id ? { ...d, [field]: value } : d)) });
  const removeDecision = (id) => setReport({ ...report, decisions: report.decisions.filter((d) => d.id !== id) });
  const addDecision = () => setReport({ ...report, decisions: [...report.decisions, { id: newId("dec"), label: "New decision needed", owner: "", needBy: new Date().toISOString().slice(0, 10) }] });

  const updateBlocker = (id, field, value) => setReport({ ...report, blockers: report.blockers.map((b) => (b.id === id ? { ...b, [field]: value } : b)) });
  const removeBlocker = (id) => setReport({ ...report, blockers: report.blockers.filter((b) => b.id !== id) });
  const addBlocker = () => setReport({ ...report, blockers: [...report.blockers, { id: newId("blk"), label: "New blocker", owner: "" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="rag-status-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Activity size={14} /> Project Manager</p>
          <h1>RAG Status Report</h1>
          <p>Weekly traffic-light per workstream, decisions needed, and blockers. PDF + email-ready in one screen.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(report.projectName || "rag").replace(/\s+/g, "-")}-rag-status-${report.reportingWeek}.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Report header</h2>
        <div className="hiring-form-grid">
          <label>Project<input value={report.projectName} onChange={(event) => update("projectName", event.target.value)} /></label>
          <label>Reporting week<input type="date" value={report.reportingWeek} onChange={(event) => update("reportingWeek", event.target.value)} /></label>
          <label>PM<input value={report.pm} onChange={(event) => update("pm", event.target.value)} /></label>
          <label>Overall status<select value={report.overall} onChange={(event) => update("overall", event.target.value)}>{statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></label>
          <label className="hiring-field-wide">Headline summary<textarea rows={3} value={report.summary} onChange={(event) => update("summary", event.target.value)} /></label>
        </div>
        <div className={`status-banner rag-banner rag-${report.overall}`} data-testid="rag-overall-banner">
          <span>Overall: <strong>{statusOptions.find((o) => o.value === report.overall)?.label}</strong></span>
        </div>
      </section>

      <section className="calculator-panel" data-testid="rag-workstreams-panel">
        <div className="panel-heading">
          <h2>Workstreams</h2>
          <button className="secondary-button" onClick={addWorkstream}><Plus size={16} /> Add workstream</button>
        </div>
        <div className="line-items">
          {report.workstreams.map((w) => (
            <div key={w.id} className={`line-item-row rag-row rag-${w.status}`} data-testid={`rag-ws-${w.id}`}>
              <input value={w.name} onChange={(event) => updateWorkstream(w.id, "name", event.target.value)} placeholder="Workstream" />
              <select value={w.status} onChange={(event) => updateWorkstream(w.id, "status", event.target.value)}>{statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>
              <input value={w.commentary} onChange={(event) => updateWorkstream(w.id, "commentary", event.target.value)} placeholder="Commentary" />
              <button className="icon-button" onClick={() => removeWorkstream(w.id)} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel" data-testid="rag-decisions-panel">
        <div className="panel-heading">
          <h2>Decisions needed</h2>
          <button className="secondary-button" onClick={addDecision}><Plus size={16} /> Add decision</button>
        </div>
        <div className="line-items">
          {report.decisions.map((d) => (
            <div key={d.id} className="line-item-row rag-decision-row">
              <input value={d.label} onChange={(event) => updateDecision(d.id, "label", event.target.value)} placeholder="Decision" />
              <input value={d.owner} onChange={(event) => updateDecision(d.id, "owner", event.target.value)} placeholder="Owner" />
              <input type="date" value={d.needBy} onChange={(event) => updateDecision(d.id, "needBy", event.target.value)} />
              <button className="icon-button" onClick={() => removeDecision(d.id)} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel" data-testid="rag-blockers-panel">
        <div className="panel-heading">
          <h2>Blockers</h2>
          <button className="secondary-button" onClick={addBlocker}><Plus size={16} /> Add blocker</button>
        </div>
        <div className="line-items">
          {report.blockers.map((b) => (
            <div key={b.id} className="line-item-row rag-blocker-row">
              <input value={b.label} onChange={(event) => updateBlocker(b.id, "label", event.target.value)} placeholder="Blocker" />
              <input value={b.owner} onChange={(event) => updateBlocker(b.id, "owner", event.target.value)} placeholder="Owner" />
              <button className="icon-button" onClick={() => removeBlocker(b.id)} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Status report preview</h2>
        <div id={previewId} className="hiring-document rag-document" data-testid="rag-status-preview">
          <header>
            <p className="eyebrow">Weekly RAG Status</p>
            <h1>{report.projectName}</h1>
            <p>Week of {report.reportingWeek} · PM {report.pm}</p>
          </header>

          <h2>Overall: <span className={`rag-pill rag-${report.overall}`}>{report.overall.toUpperCase()}</span></h2>
          <p>{report.summary}</p>

          <h3>Workstreams</h3>
          <table className="legal-cookie-table">
            <thead><tr><th>Workstream</th><th>Status</th><th>Commentary</th></tr></thead>
            <tbody>
              {report.workstreams.map((w) => (
                <tr key={w.id}><td><strong>{w.name}</strong></td><td><span className={`rag-pill rag-${w.status}`}>{w.status.toUpperCase()}</span></td><td>{w.commentary}</td></tr>
              ))}
            </tbody>
          </table>

          <h3>Decisions needed</h3>
          <ul>
            {report.decisions.map((d) => <li key={d.id}><strong>{d.label}</strong> — owner {d.owner}, need by {d.needBy}</li>)}
            {report.decisions.length === 0 && <li>—</li>}
          </ul>

          <h3>Blockers</h3>
          <ul>
            {report.blockers.map((b) => <li key={b.id}><strong>{b.label}</strong> — owner {b.owner}</li>)}
            {report.blockers.length === 0 && <li>—</li>}
          </ul>
        </div>
      </section>

      <PremiumCapture source="rag-status-report" />
    </div>
  );
}
