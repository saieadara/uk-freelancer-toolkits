import { useMemo } from "react";
import { Plus, Trash2, ListOrdered, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultRiceBoard, impactScale } from "../data/product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `rice-${Math.random().toString(36).slice(2, 8)}`;

const calcScore = (row) => {
  const reach = Number(row.reach || 0);
  const impact = Number(row.impact || 0);
  const confidence = Number(row.confidence || 0) / 100;
  const effort = Number(row.effort || 0);
  if (effort <= 0) return 0;
  return (reach * impact * confidence) / effort;
};

export default function RicePrioritisation() {
  const [board, setBoard] = useLocalStorage("product-rice-board", defaultRiceBoard());
  const previewId = "rice-preview";

  const update = (field, value) => setBoard({ ...board, [field]: value });

  const updateRow = (id, field, value) => {
    setBoard({ ...board, features: board.features.map((row) => (row.id === id ? { ...row, [field]: field === "name" ? value : Number(value) } : row)) });
  };

  const removeRow = (id) => {
    if (board.features.length <= 1) return;
    setBoard({ ...board, features: board.features.filter((row) => row.id !== id) });
  };

  const addRow = () => setBoard({ ...board, features: [...board.features, { id: newId(), name: "New feature", reach: 1000, impact: 1, confidence: 70, effort: 3 }] });

  const ranked = useMemo(() => {
    return board.features
      .map((row) => ({ ...row, score: calcScore(row) }))
      .sort((a, b) => b.score - a.score);
  }, [board.features]);

  const copyText = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="rice-prioritisation-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><ListOrdered size={14} /> Product Management</p>
          <h1>RICE Prioritisation</h1>
          <p>Score each candidate feature on Reach, Impact, Confidence, and Effort. The board ranks live. Score = (Reach × Impact × Confidence) ÷ Effort.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyText}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(board.productName || "rice").replace(/\s+/g, "-")}-rice-board.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel" data-testid="rice-meta-panel">
        <h2>Board details</h2>
        <div className="hiring-form-grid">
          <label>Product / surface<input value={board.productName} onChange={(event) => update("productName", event.target.value)} data-testid="rice-product-input" /></label>
          <label>Period<input value={board.period} onChange={(event) => update("period", event.target.value)} data-testid="rice-period-input" /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="rice-editor-panel">
        <div className="panel-heading">
          <h2>Features (edit any cell — board re-ranks live)</h2>
          <button className="secondary-button" onClick={addRow} data-testid="rice-add-feature"><Plus size={16} /> Add feature</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid rice-grid" data-testid="rice-edit-grid">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Reach<br /><small>users / period</small></th>
                <th>Impact<br /><small>0.25 / 0.5 / 1 / 2 / 3</small></th>
                <th>Confidence<br /><small>%</small></th>
                <th>Effort<br /><small>person-months</small></th>
                <th>Score</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {board.features.map((row) => (
                <tr key={row.id} data-testid={`rice-row-${row.id}`}>
                  <td><input value={row.name} onChange={(event) => updateRow(row.id, "name", event.target.value)} /></td>
                  <td><input type="number" min="0" value={row.reach} onChange={(event) => updateRow(row.id, "reach", event.target.value)} /></td>
                  <td>
                    <select value={row.impact} onChange={(event) => updateRow(row.id, "impact", event.target.value)}>
                      {impactScale.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </td>
                  <td><input type="number" min="0" max="100" value={row.confidence} onChange={(event) => updateRow(row.id, "confidence", event.target.value)} /></td>
                  <td><input type="number" min="0.1" step="0.1" value={row.effort} onChange={(event) => updateRow(row.id, "effort", event.target.value)} /></td>
                  <td><strong>{calcScore(row).toFixed(1)}</strong></td>
                  <td><button className="icon-button" onClick={() => removeRow(row.id)} aria-label="Remove" disabled={board.features.length === 1}><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel" data-testid="rice-ranking-panel">
        <h2>Live ranking</h2>
        <ul className="check-list" data-testid="rice-ranking-list">
          {ranked.map((row, index) => (
            <li key={row.id} className="pass" data-testid={`rice-rank-${index}`}>
              <strong>{index + 1}. {row.name}</strong>
              <span>RICE score: {row.score.toFixed(1)} · reach {row.reach} · impact {row.impact} · conf {row.confidence}% · effort {row.effort}pm</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="calculator-panel">
        <h2>Document preview</h2>
        <div id={previewId} className="hiring-document" data-testid="rice-preview">
          <header>
            <p className="eyebrow">RICE Prioritisation</p>
            <h1>{board.productName}</h1>
            <p>{board.period} · {board.features.length} candidate{board.features.length === 1 ? "" : "s"}</p>
          </header>
          <table className="legal-cookie-table">
            <thead>
              <tr><th>Rank</th><th>Feature</th><th>Reach</th><th>Impact</th><th>Confidence</th><th>Effort</th><th>Score</th></tr>
            </thead>
            <tbody>
              {ranked.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.reach}</td>
                  <td>{row.impact}</td>
                  <td>{row.confidence}%</td>
                  <td>{row.effort}pm</td>
                  <td>{row.score.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PremiumCapture source="rice-prioritisation" />
    </div>
  );
}
