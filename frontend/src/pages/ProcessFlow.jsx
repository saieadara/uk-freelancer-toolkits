import { Plus, Trash2, Workflow, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultProcessFlow } from "../data/businessAnalysis";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export default function ProcessFlow() {
  const [flow, setFlow] = useLocalStorage("ba-process-flow", defaultProcessFlow());
  const previewId = "process-flow-preview";

  const update = (field, value) => setFlow({ ...flow, [field]: value });

  const updateStep = (col, id, field, value) => {
    setFlow({ ...flow, [col]: flow[col].map((s) => (s.id === id ? { ...s, [field]: value } : s)) });
  };
  const removeStep = (col, id) => setFlow({ ...flow, [col]: flow[col].filter((s) => s.id !== id) });
  const addStep = (col) => setFlow({ ...flow, [col]: [...flow[col], { id: newId("st"), label: "New step", actor: "" }] });

  const updateGap = (id, field, value) => setFlow({ ...flow, gaps: flow.gaps.map((g) => (g.id === id ? { ...g, [field]: value } : g)) });
  const removeGap = (id) => setFlow({ ...flow, gaps: flow.gaps.filter((g) => g.id !== id) });
  const addGap = () => setFlow({ ...flow, gaps: [...flow.gaps, { id: newId("gap"), label: "New gap", impact: "" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="process-flow-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Workflow size={14} /> Business Analyst</p>
          <h1>As-Is / To-Be Process Flow</h1>
          <p>Side-by-side numbered steps for current and future state. Use the gap callouts to make the case for change explicit.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(flow.processName || "process").replace(/\s+/g, "-")}-process-flow.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Process details</h2>
        <div className="hiring-form-grid">
          <label>Process<input value={flow.processName} onChange={(event) => update("processName", event.target.value)} /></label>
          <label>Owner<input value={flow.owner} onChange={(event) => update("owner", event.target.value)} /></label>
          <label>Date<input type="date" value={flow.date} onChange={(event) => update("date", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="process-flow-canvas-panel">
        <h2>Side-by-side flow</h2>
        <div className="process-flow-canvas">
          <div className="process-flow-col">
            <div className="panel-heading"><h3>As-Is</h3><button className="text-button" onClick={() => addStep("asIs")}><Plus size={14} /> Step</button></div>
            <ol className="process-flow-list">
              {flow.asIs.map((step, index) => (
                <li key={step.id} className="process-step" data-testid={`asis-step-${index}`}>
                  <div className="step-number">{index + 1}</div>
                  <div className="step-body">
                    <input value={step.label} onChange={(event) => updateStep("asIs", step.id, "label", event.target.value)} placeholder="Step description" />
                    <input value={step.actor} onChange={(event) => updateStep("asIs", step.id, "actor", event.target.value)} placeholder="Actor" />
                  </div>
                  <button className="icon-button mini" onClick={() => removeStep("asIs", step.id)} aria-label="Remove"><Trash2 size={12} /></button>
                </li>
              ))}
            </ol>
          </div>

          <div className="process-flow-col">
            <div className="panel-heading"><h3>To-Be</h3><button className="text-button" onClick={() => addStep("toBe")}><Plus size={14} /> Step</button></div>
            <ol className="process-flow-list">
              {flow.toBe.map((step, index) => (
                <li key={step.id} className="process-step" data-testid={`tobe-step-${index}`}>
                  <div className="step-number">{index + 1}</div>
                  <div className="step-body">
                    <input value={step.label} onChange={(event) => updateStep("toBe", step.id, "label", event.target.value)} placeholder="Step description" />
                    <input value={step.actor} onChange={(event) => updateStep("toBe", step.id, "actor", event.target.value)} placeholder="Actor" />
                  </div>
                  <button className="icon-button mini" onClick={() => removeStep("toBe", step.id)} aria-label="Remove"><Trash2 size={12} /></button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="calculator-panel" data-testid="process-flow-gaps-panel">
        <div className="panel-heading">
          <h2>Gap callouts</h2>
          <button className="secondary-button" onClick={addGap}><Plus size={16} /> Add gap</button>
        </div>
        <div className="line-items">
          {flow.gaps.map((gap, index) => (
            <div key={gap.id} className="line-item-row gap-row" data-testid={`gap-${index}`}>
              <input value={gap.label} onChange={(event) => updateGap(gap.id, "label", event.target.value)} placeholder="Gap" />
              <input value={gap.impact} onChange={(event) => updateGap(gap.id, "impact", event.target.value)} placeholder="Impact" />
              <button className="icon-button" onClick={() => removeGap(gap.id)} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Document preview</h2>
        <div id={previewId} className="hiring-document" data-testid="process-flow-preview">
          <header>
            <p className="eyebrow">Process Flow — As-Is / To-Be</p>
            <h1>{flow.processName}</h1>
            <p>{flow.date} · owner {flow.owner}</p>
          </header>

          <h3>As-Is</h3>
          <ol>{flow.asIs.map((s) => <li key={s.id}>{s.label}{s.actor ? ` — ${s.actor}` : ""}</li>)}</ol>

          <h3>To-Be</h3>
          <ol>{flow.toBe.map((s) => <li key={s.id}>{s.label}{s.actor ? ` — ${s.actor}` : ""}</li>)}</ol>

          <h3>Gap callouts</h3>
          <ul>{flow.gaps.map((g) => <li key={g.id}><strong>{g.label}</strong>{g.impact ? ` — ${g.impact}` : ""}</li>)}</ul>
        </div>
      </section>

      <PremiumCapture source="process-flow" />
    </div>
  );
}
