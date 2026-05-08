import { useMemo } from "react";
import { Briefcase, Download, Copy, ShieldCheck, AlertTriangle } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultIr35, ir35Questions } from "../data/product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

export default function Ir35Determinator() {
  const [state, setState] = useLocalStorage("product-ir35", defaultIr35());
  const previewId = "ir35-preview";

  const update = (field, value) => setState({ ...state, [field]: value });
  const setAnswer = (id, value) => setState({ ...state, answers: { ...state.answers, [id]: value } });

  const totalPossible = useMemo(() => ir35Questions.reduce((sum, q) => sum + q.pointsForOutside, 0), []);
  const score = useMemo(() => ir35Questions.reduce((sum, q) => sum + (state.answers[q.id] === "outside" ? q.pointsForOutside : 0), 0), [state.answers]);
  const percent = useMemo(() => Math.round((score / totalPossible) * 100), [score, totalPossible]);
  const determination = useMemo(() => {
    if (percent >= 75) return { label: "Likely Outside IR35", tone: "ok", note: "Most CEST-style indicators point to genuine self-employment. Document the substitution clause, control evidence, and financial risk in the contract." };
    if (percent >= 45) return { label: "Borderline — review with care", tone: "warn", note: "Mixed signals. Tighten substitution and control language; consider a written status determination from a specialist before signing." };
    return { label: "Likely Inside IR35", tone: "fail", note: "Most indicators look like deemed employment. The fee payer must operate PAYE on the deemed direct payment. Consider an umbrella or PAYE engagement instead." };
  }, [percent]);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="ir35-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Briefcase size={14} /> Product Management · contractors</p>
          <h1>IR35 Determinator</h1>
          <p>CEST-style indicative read for product manager contractors. Five core factors — substitution, control, mutuality of obligation, financial risk, integration. Always pair with a written status determination from a qualified adviser.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(state.client || "ir35").replace(/\s+/g, "-")}-ir35-read.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Engagement</h2>
        <div className="hiring-form-grid">
          <label>Role<input value={state.role} onChange={(event) => update("role", event.target.value)} data-testid="ir35-role-input" /></label>
          <label>Client<input value={state.client} onChange={(event) => update("client", event.target.value)} data-testid="ir35-client-input" /></label>
          <label>Engagement length (months)<input type="number" value={state.engagementMonths} onChange={(event) => update("engagementMonths", Number(event.target.value))} /></label>
          <label className="hiring-field-wide">Notes<input value={state.notes} onChange={(event) => update("notes", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="ir35-questions-panel">
        <h2>Determination factors</h2>
        <div className="ir35-question-list">
          {ir35Questions.map((q) => (
            <div key={q.id} className="ir35-question" data-testid={`ir35-q-${q.id}`}>
              <div className="ir35-question-head">
                <h3>{q.label}</h3>
                <span className="ir35-question-weight">weight {q.pointsForOutside}</span>
              </div>
              <p>{q.question}</p>
              <div className="segmented hiring-segmented ir35-segmented">
                <button className={state.answers[q.id] === "inside" ? "active" : ""} onClick={() => setAnswer(q.id, "inside")} data-testid={`ir35-${q.id}-inside`}>Inside · {q.optionInsideLabel}</button>
                <button className={state.answers[q.id] === "outside" ? "active" : ""} onClick={() => setAnswer(q.id, "outside")} data-testid={`ir35-${q.id}-outside`}>Outside · {q.optionOutsideLabel}</button>
              </div>
            </div>
          ))}
        </div>

        <div className={`status-banner ${determination.tone === "ok" ? "ok" : "warn"}`} data-testid="ir35-result-banner">
          {determination.tone === "ok" ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
          <span>{determination.label} — outside-leaning score {score.toFixed(1)} / {totalPossible} ({percent}%)</span>
        </div>
        <p className="form-message">{determination.note}</p>
      </section>

      <section className="calculator-panel">
        <h2>Determination summary</h2>
        <div id={previewId} className="hiring-document" data-testid="ir35-preview">
          <header>
            <p className="eyebrow">IR35 Indicative Read</p>
            <h1>{state.role} — {state.client}</h1>
            <p>{state.engagementMonths} month engagement · score {score.toFixed(1)} / {totalPossible} ({percent}%)</p>
          </header>

          <h2>Result: {determination.label}</h2>
          <p>{determination.note}</p>

          <h3>Factor breakdown</h3>
          <table className="legal-cookie-table">
            <thead><tr><th>Factor</th><th>Direction</th><th>Weight</th><th>Counted</th></tr></thead>
            <tbody>
              {ir35Questions.map((q) => (
                <tr key={q.id}>
                  <td><strong>{q.label}</strong></td>
                  <td>{state.answers[q.id] === "outside" ? "Outside" : "Inside"}</td>
                  <td>{q.pointsForOutside}</td>
                  <td>{state.answers[q.id] === "outside" ? q.pointsForOutside : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Disclaimer</h3>
          <p>This is an indicative product-management contractor read, not a formal status determination. Use HMRC's CEST tool and a qualified adviser before signing.</p>
        </div>
      </section>

      <PremiumCapture source="ir35-determinator" />
    </div>
  );
}
