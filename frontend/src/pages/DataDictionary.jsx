import { Plus, Trash2, Database, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultDataDictionary } from "../data/businessAnalysis";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `fld-${Math.random().toString(36).slice(2, 8)}`;

export default function DataDictionary() {
  const [dict, setDict] = useLocalStorage("ba-data-dictionary", defaultDataDictionary());
  const previewId = "data-dictionary-preview";

  const update = (field, value) => setDict({ ...dict, [field]: value });
  const updateField = (id, field, value) => setDict({ ...dict, fields: dict.fields.map((f) => (f.id === id ? { ...f, [field]: value } : f)) });
  const removeField = (id) => setDict({ ...dict, fields: dict.fields.filter((f) => f.id !== id) });
  const addField = () => setDict({ ...dict, fields: [...dict.fields, { id: newId(), name: "new_field", type: "string", source: "", owner: "", definition: "" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="data-dictionary-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Database size={14} /> Business Analyst</p>
          <h1>Data Dictionary</h1>
          <p>Field name, type, source, owner, and a one-sentence definition. The reference document for any data project, integration, or migration.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(dict.domain || "dictionary").replace(/\s+/g, "-")}-data-dictionary.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Domain</h2>
        <div className="hiring-form-grid">
          <label>Domain<input value={dict.domain} onChange={(event) => update("domain", event.target.value)} /></label>
          <label>Source system<input value={dict.source} onChange={(event) => update("source", event.target.value)} /></label>
          <label>Owner<input value={dict.owner} onChange={(event) => update("owner", event.target.value)} /></label>
          <label>Date<input type="date" value={dict.date} onChange={(event) => update("date", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="data-dictionary-grid-panel">
        <div className="panel-heading">
          <h2>Fields</h2>
          <button className="secondary-button" onClick={addField}><Plus size={16} /> Add field</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid">
            <thead><tr><th>Name</th><th>Type</th><th>Source</th><th>Owner</th><th>Definition</th><th></th></tr></thead>
            <tbody>
              {dict.fields.map((f) => (
                <tr key={f.id}>
                  <td><input value={f.name} onChange={(event) => updateField(f.id, "name", event.target.value)} /></td>
                  <td><input value={f.type} onChange={(event) => updateField(f.id, "type", event.target.value)} /></td>
                  <td><input value={f.source} onChange={(event) => updateField(f.id, "source", event.target.value)} /></td>
                  <td><input value={f.owner} onChange={(event) => updateField(f.id, "owner", event.target.value)} /></td>
                  <td><input value={f.definition} onChange={(event) => updateField(f.id, "definition", event.target.value)} /></td>
                  <td><button className="icon-button" onClick={() => removeField(f.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Dictionary preview</h2>
        <div id={previewId} className="hiring-document" data-testid="data-dictionary-preview">
          <header>
            <p className="eyebrow">Data Dictionary</p>
            <h1>{dict.domain}</h1>
            <p>{dict.date} · source {dict.source} · owner {dict.owner}</p>
          </header>
          <table className="legal-cookie-table">
            <thead><tr><th>Field</th><th>Type</th><th>Source</th><th>Owner</th><th>Definition</th></tr></thead>
            <tbody>
              {dict.fields.map((f) => (
                <tr key={f.id}><td><strong>{f.name}</strong></td><td>{f.type}</td><td>{f.source}</td><td>{f.owner}</td><td>{f.definition}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PremiumCapture source="data-dictionary" />
    </div>
  );
}
