import { useMemo } from "react";
import { Plus, Trash2, Scale, Download, Copy, CheckCircle2 } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultOptionsMemo } from "../data/strategy";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `opt-${Math.random().toString(36).slice(2, 8)}`;

export default function OptionsMemo() {
  const [memo, setMemo] = useLocalStorage("strategy-options-memo", defaultOptionsMemo());
  const previewId = "options-memo-preview";

  const update = (field, value) => setMemo({ ...memo, [field]: value });

  const updateOption = (id, field, value) => {
    setMemo({
      ...memo,
      options: memo.options.map((opt) => {
        if (opt.id !== id) {
          return field === "isRecommended" && value === true ? { ...opt, isRecommended: false } : opt;
        }
        return { ...opt, [field]: value };
      }),
    });
  };
  const removeOption = (id) => {
    if (memo.options.length <= 2) return;
    setMemo({ ...memo, options: memo.options.filter((o) => o.id !== id) });
  };
  const addOption = () => {
    const nextLetter = String.fromCharCode(65 + memo.options.length);
    setMemo({
      ...memo,
      options: [...memo.options, { id: newId(), label: `${nextLetter}. New option`, summary: "", pros: "", cons: "", cost: "", risk: "Medium", isRecommended: false }],
    });
  };

  const recommended = useMemo(() => memo.options.find((o) => o.isRecommended), [memo.options]);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="options-memo-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Scale size={14} /> Strategy Consultant</p>
          <h1>Options Memo</h1>
          <p>Compare 2–4 options with trade-offs, cost, and risk. Tick exactly one as recommended — the memo always closes with a clear recommendation.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(memo.title || "options").replace(/\s+/g, "-")}-options-memo.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Memo brief</h2>
        <div className="hiring-form-grid">
          <label>Title<input value={memo.title} onChange={(event) => update("title", event.target.value)} /></label>
          <label>Decision owner<input value={memo.decisionOwner} onChange={(event) => update("decisionOwner", event.target.value)} /></label>
          <label>Decision date<input type="date" value={memo.decisionDate} onChange={(event) => update("decisionDate", event.target.value)} /></label>
          <label className="hiring-field-wide">Context<textarea rows={3} value={memo.context} onChange={(event) => update("context", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="options-memo-options-panel">
        <div className="panel-heading">
          <h2>Options</h2>
          <button className="secondary-button" onClick={addOption}><Plus size={16} /> Add option</button>
        </div>
        <div className="options-list">
          {memo.options.map((opt, index) => (
            <div key={opt.id} className={`option-card ${opt.isRecommended ? "recommended" : ""}`} data-testid={`option-${index}`}>
              <div className="panel-heading">
                <input className="option-label" value={opt.label} onChange={(event) => updateOption(opt.id, "label", event.target.value)} />
                <button className="icon-button" onClick={() => removeOption(opt.id)} aria-label="Remove" disabled={memo.options.length <= 2}><Trash2 size={14} /></button>
              </div>
              <div className="hiring-form-grid">
                <label className="hiring-field-wide">Summary<textarea rows={2} value={opt.summary} onChange={(event) => updateOption(opt.id, "summary", event.target.value)} /></label>
                <label className="hiring-field-wide">Pros<textarea rows={2} value={opt.pros} onChange={(event) => updateOption(opt.id, "pros", event.target.value)} /></label>
                <label className="hiring-field-wide">Cons<textarea rows={2} value={opt.cons} onChange={(event) => updateOption(opt.id, "cons", event.target.value)} /></label>
                <label>Cost<input value={opt.cost} onChange={(event) => updateOption(opt.id, "cost", event.target.value)} /></label>
                <label>Risk<select value={opt.risk} onChange={(event) => updateOption(opt.id, "risk", event.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
                <label className="checkbox-row hiring-field-wide">
                  <input type="checkbox" checked={!!opt.isRecommended} onChange={(event) => updateOption(opt.id, "isRecommended", event.target.checked)} />
                  <span>Mark as recommended option</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Recommendation</h2>
        <div className="hiring-form-grid">
          <label className="hiring-field-wide">Recommendation summary<textarea rows={3} value={memo.recommendation} onChange={(event) => update("recommendation", event.target.value)} /></label>
        </div>
        {recommended && (
          <div className="status-banner ok">
            <CheckCircle2 size={18} />
            <span>Recommending <strong>{recommended.label}</strong>. The memo will close with this option.</span>
          </div>
        )}
        {!recommended && (
          <div className="status-banner warn"><span>No option marked as recommended. Tick exactly one option above before circulating.</span></div>
        )}
      </section>

      <section className="calculator-panel">
        <h2>Memo preview</h2>
        <div id={previewId} className="hiring-document" data-testid="options-memo-preview">
          <header>
            <p className="eyebrow">Options Memo</p>
            <h1>{memo.title}</h1>
            <p>{memo.decisionDate} · owner {memo.decisionOwner}</p>
          </header>

          <h3>Context</h3>
          <p>{memo.context}</p>

          <h3>Options at a glance</h3>
          <table className="legal-cookie-table">
            <thead><tr><th>Option</th><th>Cost</th><th>Risk</th><th>Recommended</th></tr></thead>
            <tbody>
              {memo.options.map((opt) => (
                <tr key={opt.id}>
                  <td><strong>{opt.label}</strong> — {opt.summary}</td>
                  <td>{opt.cost}</td>
                  <td>{opt.risk}</td>
                  <td>{opt.isRecommended ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {memo.options.map((opt) => (
            <div key={opt.id}>
              <h3>{opt.label}</h3>
              <p>{opt.summary}</p>
              <p><strong>Pros:</strong> {opt.pros}</p>
              <p><strong>Cons:</strong> {opt.cons}</p>
              <p><strong>Cost:</strong> {opt.cost} · <strong>Risk:</strong> {opt.risk}</p>
            </div>
          ))}

          <h3>Recommendation</h3>
          <p>{memo.recommendation}</p>
          {recommended && <p><strong>Pick: {recommended.label}.</strong></p>}
        </div>
      </section>

      <PremiumCapture source="options-memo" />
    </div>
  );
}
