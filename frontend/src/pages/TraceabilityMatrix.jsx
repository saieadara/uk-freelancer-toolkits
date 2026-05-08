import { Plus, Trash2, ListTree, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultTraceability } from "../data/businessAnalysis";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `row-${Math.random().toString(36).slice(2, 8)}`;

export default function TraceabilityMatrix() {
  const [matrix, setMatrix] = useLocalStorage("ba-traceability", defaultTraceability());
  const previewId = "traceability-preview";

  const update = (field, value) => setMatrix({ ...matrix, [field]: value });
  const updateRow = (id, field, value) => setMatrix({ ...matrix, rows: matrix.rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)) });
  const removeRow = (id) => setMatrix({ ...matrix, rows: matrix.rows.filter((r) => r.id !== id) });
  const addRow = () => setMatrix({ ...matrix, rows: [...matrix.rows, { id: newId(), reqId: "", requirement: "", design: "", testCase: "", approver: "", status: "Not started" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="traceability-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><ListTree size={14} /> Business Analyst</p>
          <h1>Requirements Traceability Matrix</h1>
          <p>Each requirement → design element → test case → approver. Spot coverage gaps before they bite at UAT.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(matrix.projectName || "rtm").replace(/\s+/g, "-")}-traceability.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Matrix details</h2>
        <div className="hiring-form-grid">
          <label>Project<input value={matrix.projectName} onChange={(event) => update("projectName", event.target.value)} /></label>
          <label>Baseline<input value={matrix.baseline} onChange={(event) => update("baseline", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="traceability-grid-panel">
        <div className="panel-heading">
          <h2>Traceability rows</h2>
          <button className="secondary-button" onClick={addRow}><Plus size={16} /> Add row</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid">
            <thead><tr><th>Req ID</th><th>Requirement</th><th>Design</th><th>Test case</th><th>Approver</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {matrix.rows.map((r) => (
                <tr key={r.id}>
                  <td><input value={r.reqId} onChange={(event) => updateRow(r.id, "reqId", event.target.value)} /></td>
                  <td><input value={r.requirement} onChange={(event) => updateRow(r.id, "requirement", event.target.value)} /></td>
                  <td><input value={r.design} onChange={(event) => updateRow(r.id, "design", event.target.value)} /></td>
                  <td><input value={r.testCase} onChange={(event) => updateRow(r.id, "testCase", event.target.value)} /></td>
                  <td><input value={r.approver} onChange={(event) => updateRow(r.id, "approver", event.target.value)} /></td>
                  <td><select value={r.status} onChange={(event) => updateRow(r.id, "status", event.target.value)}><option>Not started</option><option>In progress</option><option>Implemented</option><option>Verified</option></select></td>
                  <td><button className="icon-button" onClick={() => removeRow(r.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Matrix preview</h2>
        <div id={previewId} className="hiring-document" data-testid="traceability-preview">
          <header>
            <p className="eyebrow">Requirements Traceability Matrix</p>
            <h1>{matrix.projectName}</h1>
            <p>{matrix.baseline}</p>
          </header>
          <table className="legal-cookie-table">
            <thead><tr><th>Req ID</th><th>Requirement</th><th>Design</th><th>Test case</th><th>Approver</th><th>Status</th></tr></thead>
            <tbody>
              {matrix.rows.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.reqId}</strong></td>
                  <td>{r.requirement}</td>
                  <td>{r.design}</td>
                  <td>{r.testCase}</td>
                  <td>{r.approver}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PremiumCapture source="traceability-matrix" />
    </div>
  );
}
