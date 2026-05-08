import { Plus, Trash2, ScrollText, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultUseCase } from "../data/businessAnalysis";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const baseFields = [
  { id: "ucId", label: "Use case ID" },
  { id: "title", label: "Title" },
  { id: "ba", label: "Business analyst" },
  { id: "date", label: "Date", type: "date" },
  { id: "primaryActor", label: "Primary actor" },
  { id: "supportingActors", label: "Supporting actors", textarea: true },
  { id: "trigger", label: "Trigger", textarea: true },
  { id: "preconditions", label: "Preconditions", textarea: true },
  { id: "postconditionsSuccess", label: "Postconditions (success)", textarea: true },
  { id: "postconditionsFailure", label: "Postconditions (failure)", textarea: true },
  { id: "businessRules", label: "Business rules", textarea: true },
  { id: "notes", label: "Notes", textarea: true },
];

export default function UseCaseSpec() {
  const [uc, setUc] = useLocalStorage("ba-use-case", defaultUseCase());
  const previewId = "use-case-preview";

  const update = (field, value) => setUc({ ...uc, [field]: value });
  const updateLine = (key, index, value) => update(key, uc[key].map((line, i) => (i === index ? value : line)));
  const addLine = (key) => update(key, [...uc[key], "New step"]);
  const removeLine = (key, index) => update(key, uc[key].filter((_, i) => i !== index));

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="use-case-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><ScrollText size={14} /> Business Analyst</p>
          <h1>Use Case Specification</h1>
          <p>Actor, preconditions, main flow, alternate flow, postconditions, business rules. The BA classic in a single editable screen.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(uc.ucId || "use-case").replace(/\s+/g, "-")}-${(uc.title || "spec").replace(/\s+/g, "-")}.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Use case fields</h2>
        <div className="hiring-form-grid">
          {baseFields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={uc[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`uc-field-${field.id}`} />
                : <input type={field.type || "text"} value={uc[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`uc-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel" data-testid="use-case-flows-panel">
        <div className="panel-heading">
          <h2>Main flow</h2>
          <button className="secondary-button" onClick={() => addLine("mainFlow")}><Plus size={16} /> Add step</button>
        </div>
        <div className="line-items">
          {uc.mainFlow.map((step, index) => (
            <div key={index} className="line-item-row main-flow-row" data-testid={`main-step-${index}`}>
              <span className="step-number">{index + 1}</span>
              <input value={step} onChange={(event) => updateLine("mainFlow", index, event.target.value)} />
              <button className="icon-button" onClick={() => removeLine("mainFlow", index)} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>

        <div className="panel-heading" style={{ marginTop: 16 }}>
          <h2>Alternate / exception flows</h2>
          <button className="secondary-button" onClick={() => addLine("alternateFlows")}><Plus size={16} /> Add</button>
        </div>
        <div className="line-items">
          {uc.alternateFlows.map((step, index) => (
            <div key={index} className="line-item-row alternate-flow-row" data-testid={`alt-step-${index}`}>
              <input value={step} onChange={(event) => updateLine("alternateFlows", index, event.target.value)} />
              <button className="icon-button" onClick={() => removeLine("alternateFlows", index)} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Use case preview</h2>
        <div id={previewId} className="hiring-document" data-testid="use-case-preview">
          <header>
            <p className="eyebrow">Use Case Specification</p>
            <h1>{uc.ucId} — {uc.title}</h1>
            <p>{uc.date} · BA {uc.ba}</p>
          </header>

          <h3>Primary actor</h3>
          <p>{uc.primaryActor}</p>

          <h3>Supporting actors</h3>
          <p>{uc.supportingActors}</p>

          <h3>Trigger</h3>
          <p>{uc.trigger}</p>

          <h3>Preconditions</h3>
          <p>{uc.preconditions}</p>

          <h3>Main flow</h3>
          <ol>{uc.mainFlow.map((step, i) => <li key={i}>{step}</li>)}</ol>

          <h3>Alternate / exception flows</h3>
          <ul>{uc.alternateFlows.map((step, i) => <li key={i}>{step}</li>)}</ul>

          <h3>Postconditions (success)</h3>
          <p>{uc.postconditionsSuccess}</p>

          <h3>Postconditions (failure)</h3>
          <p>{uc.postconditionsFailure}</p>

          <h3>Business rules</h3>
          <p>{uc.businessRules}</p>

          <h3>Notes</h3>
          <p>{uc.notes}</p>
        </div>
      </section>

      <PremiumCapture source="use-case-spec" />
    </div>
  );
}
