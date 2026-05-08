import { Plus, Trash2, CheckSquare, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultAcceptanceCriteria } from "../data/businessAnalysis";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `ac-${Math.random().toString(36).slice(2, 8)}`;

export default function AcceptanceCriteria() {
  const [sheet, setSheet] = useLocalStorage("ba-acceptance-criteria", defaultAcceptanceCriteria());
  const previewId = "acceptance-criteria-preview";

  const update = (field, value) => setSheet({ ...sheet, [field]: value });
  const updateRow = (id, field, value) => setSheet({ ...sheet, rows: sheet.rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)) });
  const removeRow = (id) => setSheet({ ...sheet, rows: sheet.rows.filter((r) => r.id !== id) });
  const addRow = () => {
    const next = sheet.rows.length + 1;
    const acId = `AC-${String(next).padStart(3, "0")}`;
    setSheet({ ...sheet, rows: [...sheet.rows, { id: newId(), acId, given: "", when: "", then: "", testId: "" }] });
  };

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="acceptance-criteria-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><CheckSquare size={14} /> Business Analyst</p>
          <h1>Acceptance Criteria Sheet</h1>
          <p>BDD-style Given / When / Then per criterion, each linked to a story id and a test id so coverage stays honest.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(sheet.storyId || "story").replace(/\s+/g, "-")}-acceptance-criteria.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Story</h2>
        <div className="hiring-form-grid">
          <label>Story title<input value={sheet.storyTitle} onChange={(event) => update("storyTitle", event.target.value)} /></label>
          <label>Story ID<input value={sheet.storyId} onChange={(event) => update("storyId", event.target.value)} /></label>
          <label>BA<input value={sheet.ba} onChange={(event) => update("ba", event.target.value)} /></label>
          <label>Date<input type="date" value={sheet.date} onChange={(event) => update("date", event.target.value)} /></label>
          <label className="hiring-field-wide">Context<textarea rows={2} value={sheet.context} onChange={(event) => update("context", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="acceptance-criteria-rows-panel">
        <div className="panel-heading">
          <h2>Acceptance criteria</h2>
          <button className="secondary-button" onClick={addRow}><Plus size={16} /> Add criterion</button>
        </div>
        <div className="ac-list">
          {sheet.rows.map((r, index) => (
            <div key={r.id} className="ac-card" data-testid={`ac-${index}`}>
              <div className="panel-heading">
                <input className="ac-id" value={r.acId} onChange={(event) => updateRow(r.id, "acId", event.target.value)} placeholder="AC-001" />
                <input className="ac-test-id" value={r.testId} onChange={(event) => updateRow(r.id, "testId", event.target.value)} placeholder="Linked test id" />
                <button className="icon-button" onClick={() => removeRow(r.id)} aria-label="Remove"><Trash2 size={14} /></button>
              </div>
              <label><span className="ac-keyword">Given</span><textarea rows={2} value={r.given} onChange={(event) => updateRow(r.id, "given", event.target.value)} placeholder="Initial context / preconditions" /></label>
              <label><span className="ac-keyword">When</span><textarea rows={2} value={r.when} onChange={(event) => updateRow(r.id, "when", event.target.value)} placeholder="Action under test" /></label>
              <label><span className="ac-keyword">Then</span><textarea rows={2} value={r.then} onChange={(event) => updateRow(r.id, "then", event.target.value)} placeholder="Expected outcome" /></label>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Sheet preview</h2>
        <div id={previewId} className="hiring-document" data-testid="acceptance-criteria-preview">
          <header>
            <p className="eyebrow">Acceptance Criteria · {sheet.storyId}</p>
            <h1>{sheet.storyTitle}</h1>
            <p>{sheet.date} · BA {sheet.ba}</p>
          </header>
          <p>{sheet.context}</p>
          <table className="legal-cookie-table">
            <thead><tr><th>AC ID</th><th>Given</th><th>When</th><th>Then</th><th>Test ID</th></tr></thead>
            <tbody>
              {sheet.rows.map((r) => (
                <tr key={r.id}><td><strong>{r.acId}</strong></td><td>{r.given}</td><td>{r.when}</td><td>{r.then}</td><td>{r.testId}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PremiumCapture source="acceptance-criteria" />
    </div>
  );
}
