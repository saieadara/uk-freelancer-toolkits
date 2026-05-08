import { Plus, Trash2, Grid2x2, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultSwot } from "../data/strategy";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `b-${Math.random().toString(36).slice(2, 8)}`;

const quadrants = [
  { id: "strengths", label: "Strengths", subtitle: "Internal · positive", className: "swot-strengths" },
  { id: "weaknesses", label: "Weaknesses", subtitle: "Internal · negative", className: "swot-weaknesses" },
  { id: "opportunities", label: "Opportunities", subtitle: "External · positive", className: "swot-opportunities" },
  { id: "threats", label: "Threats", subtitle: "External · negative", className: "swot-threats" },
];

export default function SwotMatrix() {
  const [swot, setSwot] = useLocalStorage("strategy-swot", defaultSwot());
  const previewId = "swot-preview";

  const update = (field, value) => setSwot({ ...swot, [field]: value });

  const updateBullet = (quadrant, id, text) => {
    setSwot({ ...swot, [quadrant]: swot[quadrant].map((b) => (b.id === id ? { ...b, text } : b)) });
  };
  const removeBullet = (quadrant, id) => setSwot({ ...swot, [quadrant]: swot[quadrant].filter((b) => b.id !== id) });
  const addBullet = (quadrant) => setSwot({ ...swot, [quadrant]: [...swot[quadrant], { id: newId(), text: "" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="swot-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Grid2x2 size={14} /> Strategy Consultant</p>
          <h1>SWOT 2×2</h1>
          <p>Type the four quadrants — Strengths, Weaknesses, Opportunities, Threats — and export a polished matrix.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(swot.title || "swot").replace(/\s+/g, "-")}-swot.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Brief</h2>
        <div className="hiring-form-grid">
          <label>Title<input value={swot.title} onChange={(event) => update("title", event.target.value)} /></label>
          <label>Date<input type="date" value={swot.date} onChange={(event) => update("date", event.target.value)} /></label>
          <label className="hiring-field-wide">Context<input value={swot.context} onChange={(event) => update("context", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="swot-grid-panel">
        <h2>SWOT 2×2 (edit any cell)</h2>
        <div className="swot-grid" data-testid="swot-grid">
          {quadrants.map((q) => (
            <div key={q.id} className={`swot-cell ${q.className}`} data-testid={`swot-cell-${q.id}`}>
              <div className="swot-cell-head">
                <h3>{q.label}</h3>
                <span>{q.subtitle}</span>
                <button className="icon-button" onClick={() => addBullet(q.id)} aria-label={`Add to ${q.label}`}><Plus size={14} /></button>
              </div>
              <ul>
                {swot[q.id].map((bullet) => (
                  <li key={bullet.id}>
                    <input value={bullet.text} onChange={(event) => updateBullet(q.id, bullet.id, event.target.value)} placeholder="Add a point…" />
                    <button className="icon-button mini" onClick={() => removeBullet(q.id, bullet.id)} aria-label="Remove"><Trash2 size={12} /></button>
                  </li>
                ))}
                {swot[q.id].length === 0 && <li className="empty">No items.</li>}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Polished matrix preview</h2>
        <div id={previewId} className="hiring-document swot-document" data-testid="swot-preview">
          <header>
            <p className="eyebrow">SWOT Analysis</p>
            <h1>{swot.title}</h1>
            <p>{swot.date} · {swot.context}</p>
          </header>
          <div className="swot-grid swot-grid-print">
            {quadrants.map((q) => (
              <div key={q.id} className={`swot-cell swot-cell-print ${q.className}`}>
                <h3>{q.label}</h3>
                <ul>
                  {swot[q.id].map((b) => <li key={b.id}>{b.text}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PremiumCapture source="swot-matrix" />
    </div>
  );
}
