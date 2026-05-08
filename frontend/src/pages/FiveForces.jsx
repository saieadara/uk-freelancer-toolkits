import { useMemo } from "react";
import { Swords, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultFiveForces, fiveForces } from "../data/strategy";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const interpret = (avg) => {
  if (avg >= 4) return { label: "Unattractive industry", tone: "warn", note: "Strong forces compress profit pools — competitive advantage is fragile. Pick segments carefully." };
  if (avg >= 3) return { label: "Mixed industry attractiveness", tone: "warn", note: "Some forces are pressing. Strategy should target the weakest forces and build moats." };
  return { label: "Attractive industry", tone: "ok", note: "Most forces are tolerable. Build a clear, defensible position — execute fast." };
};

export default function FiveForcesAnalysis() {
  const [state, setState] = useLocalStorage("strategy-five-forces", defaultFiveForces());
  const previewId = "five-forces-preview";

  const update = (field, value) => setState({ ...state, [field]: value });
  const setForce = (id, field, value) => {
    setState({ ...state, scores: { ...state.scores, [id]: { ...state.scores[id], [field]: value } } });
  };

  const total = useMemo(() => fiveForces.reduce((sum, f) => sum + Number(state.scores[f.id]?.score || 0), 0), [state.scores]);
  const average = useMemo(() => total / fiveForces.length, [total]);
  const verdict = interpret(average);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="five-forces-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Swords size={14} /> Strategy Consultant</p>
          <h1>Porter's Five Forces</h1>
          <p>Score each of the five forces 1–5 (1 = weak, 5 = very strong). The aggregate verdict tells you whether the industry is structurally attractive.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(state.industry || "five-forces").replace(/\s+/g, "-")}-five-forces.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Industry context</h2>
        <div className="hiring-form-grid">
          <label>Industry<input value={state.industry} onChange={(event) => update("industry", event.target.value)} data-testid="forces-industry-input" /></label>
          <label>Date<input type="date" value={state.date} onChange={(event) => update("date", event.target.value)} /></label>
          <label className="hiring-field-wide">Scope / segment<input value={state.scope} onChange={(event) => update("scope", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="five-forces-grid-panel">
        <h2>Score each force</h2>
        <div className="forces-list">
          {fiveForces.map((f) => {
            const score = Number(state.scores[f.id]?.score || 0);
            return (
              <div key={f.id} className="force-row" data-testid={`force-${f.id}`}>
                <div className="force-row-head">
                  <h3>{f.label}</h3>
                  <span className="force-score">{score} / 5</span>
                </div>
                <p className="form-message">{f.question}</p>
                <input type="range" min="1" max="5" value={score} onChange={(event) => setForce(f.id, "score", Number(event.target.value))} className="force-slider" data-testid={`force-slider-${f.id}`} />
                <div className="force-bar-track"><div className="force-bar-fill" style={{ width: `${(score / 5) * 100}%` }} /></div>
                <textarea rows={2} value={state.scores[f.id]?.note || ""} onChange={(event) => setForce(f.id, "note", event.target.value)} placeholder="Note the evidence and judgement behind the score." data-testid={`force-note-${f.id}`} />
              </div>
            );
          })}
        </div>

        <div className="result-grid forces-summary">
          <div><span>Total</span><strong>{total} / 25</strong></div>
          <div><span>Average</span><strong>{average.toFixed(1)} / 5</strong></div>
          <div><span>Verdict</span><strong>{verdict.label}</strong></div>
        </div>
        <p className={`form-message ${verdict.tone === "ok" ? "" : "warn"}`}>{verdict.note}</p>
      </section>

      <section className="calculator-panel">
        <h2>Document preview</h2>
        <div id={previewId} className="hiring-document" data-testid="five-forces-preview">
          <header>
            <p className="eyebrow">Five Forces Analysis</p>
            <h1>{state.industry}</h1>
            <p>{state.date} · {state.scope}</p>
          </header>

          <h2>Verdict: {verdict.label} ({average.toFixed(1)} / 5)</h2>
          <p>{verdict.note}</p>

          <table className="legal-cookie-table">
            <thead><tr><th>Force</th><th>Score</th><th>Reasoning</th></tr></thead>
            <tbody>
              {fiveForces.map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.label}</strong></td>
                  <td>{state.scores[f.id]?.score} / 5</td>
                  <td>{state.scores[f.id]?.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PremiumCapture source="five-forces" />
    </div>
  );
}
