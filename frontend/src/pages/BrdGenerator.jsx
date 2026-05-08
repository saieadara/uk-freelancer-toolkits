import { Plus, Trash2, FileText, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultBrd } from "../data/businessAnalysis";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const baseFields = [
  { id: "projectName", label: "Project name" },
  { id: "sponsor", label: "Sponsor" },
  { id: "ba", label: "Business analyst" },
  { id: "date", label: "Date", type: "date" },
  { id: "businessNeed", label: "Business need", textarea: true },
  { id: "objectives", label: "Objectives", textarea: true },
  { id: "scopeIn", label: "Scope (in)", textarea: true },
  { id: "scopeOut", label: "Scope (out)", textarea: true },
  { id: "assumptions", label: "Assumptions", textarea: true },
  { id: "constraints", label: "Constraints", textarea: true },
  { id: "approvers", label: "Approvers", textarea: true },
];

export default function BrdGenerator() {
  const [brd, setBrd] = useLocalStorage("ba-brd", defaultBrd());
  const previewId = "brd-preview";

  const update = (field, value) => setBrd({ ...brd, [field]: value });

  const updateFunctional = (id, field, value) => {
    setBrd({ ...brd, functional: brd.functional.map((r) => (r.id === id ? { ...r, [field]: value } : r)) });
  };
  const removeFunctional = (id) => setBrd({ ...brd, functional: brd.functional.filter((r) => r.id !== id) });
  const addFunctional = () => setBrd({ ...brd, functional: [...brd.functional, { id: newId("FR"), area: "", text: "", priority: "Should" }] });

  const updateNonFunctional = (id, field, value) => {
    setBrd({ ...brd, nonFunctional: brd.nonFunctional.map((r) => (r.id === id ? { ...r, [field]: value } : r)) });
  };
  const removeNonFunctional = (id) => setBrd({ ...brd, nonFunctional: brd.nonFunctional.filter((r) => r.id !== id) });
  const addNonFunctional = () => setBrd({ ...brd, nonFunctional: [...brd.nonFunctional, { id: newId("NF"), category: "", text: "", target: "" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="brd-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><FileText size={14} /> Business Analyst</p>
          <h1>Business Requirements Document (BRD)</h1>
          <p>Need, scope, functional + non-functional requirements, assumptions, constraints, and approvers. Guided so nothing slips.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(brd.projectName || "brd").replace(/\s+/g, "-")}-brd.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Document basics</h2>
        <div className="hiring-form-grid">
          {baseFields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={brd[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`brd-field-${field.id}`} />
                : <input type={field.type || "text"} value={brd[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`brd-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel" data-testid="brd-functional-panel">
        <div className="panel-heading">
          <h2>Functional requirements</h2>
          <button className="secondary-button" onClick={addFunctional}><Plus size={16} /> Add</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid">
            <thead><tr><th>ID</th><th>Area</th><th>Requirement</th><th>Priority</th><th></th></tr></thead>
            <tbody>
              {brd.functional.map((r) => (
                <tr key={r.id}>
                  <td><input value={r.id} onChange={(event) => updateFunctional(r.id, "id", event.target.value)} /></td>
                  <td><input value={r.area} onChange={(event) => updateFunctional(r.id, "area", event.target.value)} /></td>
                  <td><input value={r.text} onChange={(event) => updateFunctional(r.id, "text", event.target.value)} /></td>
                  <td><select value={r.priority} onChange={(event) => updateFunctional(r.id, "priority", event.target.value)}><option>Must</option><option>Should</option><option>Could</option><option>Won't</option></select></td>
                  <td><button className="icon-button" onClick={() => removeFunctional(r.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel" data-testid="brd-non-functional-panel">
        <div className="panel-heading">
          <h2>Non-functional requirements</h2>
          <button className="secondary-button" onClick={addNonFunctional}><Plus size={16} /> Add</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid">
            <thead><tr><th>ID</th><th>Category</th><th>Requirement</th><th>Target</th><th></th></tr></thead>
            <tbody>
              {brd.nonFunctional.map((r) => (
                <tr key={r.id}>
                  <td><input value={r.id} onChange={(event) => updateNonFunctional(r.id, "id", event.target.value)} /></td>
                  <td><input value={r.category} onChange={(event) => updateNonFunctional(r.id, "category", event.target.value)} /></td>
                  <td><input value={r.text} onChange={(event) => updateNonFunctional(r.id, "text", event.target.value)} /></td>
                  <td><input value={r.target} onChange={(event) => updateNonFunctional(r.id, "target", event.target.value)} /></td>
                  <td><button className="icon-button" onClick={() => removeNonFunctional(r.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>BRD preview</h2>
        <div id={previewId} className="hiring-document" data-testid="brd-preview">
          <header>
            <p className="eyebrow">Business Requirements Document</p>
            <h1>{brd.projectName}</h1>
            <p>{brd.date} · sponsor {brd.sponsor} · BA {brd.ba}</p>
          </header>

          <h3>1. Business need</h3>
          <p>{brd.businessNeed}</p>

          <h3>2. Objectives</h3>
          <p>{brd.objectives}</p>

          <h3>3. Scope</h3>
          <p><strong>In:</strong> {brd.scopeIn}</p>
          <p><strong>Out:</strong> {brd.scopeOut}</p>

          <h3>4. Assumptions</h3>
          <p>{brd.assumptions}</p>

          <h3>5. Constraints</h3>
          <p>{brd.constraints}</p>

          <h3>6. Functional requirements</h3>
          <table className="legal-cookie-table">
            <thead><tr><th>ID</th><th>Area</th><th>Requirement</th><th>Priority</th></tr></thead>
            <tbody>
              {brd.functional.map((r) => <tr key={r.id}><td>{r.id}</td><td>{r.area}</td><td>{r.text}</td><td>{r.priority}</td></tr>)}
            </tbody>
          </table>

          <h3>7. Non-functional requirements</h3>
          <table className="legal-cookie-table">
            <thead><tr><th>ID</th><th>Category</th><th>Requirement</th><th>Target</th></tr></thead>
            <tbody>
              {brd.nonFunctional.map((r) => <tr key={r.id}><td>{r.id}</td><td>{r.category}</td><td>{r.text}</td><td>{r.target}</td></tr>)}
            </tbody>
          </table>

          <h3>8. Approvers</h3>
          <p>{brd.approvers}</p>
        </div>
      </section>

      <PremiumCapture source="brd-generator" />
    </div>
  );
}
