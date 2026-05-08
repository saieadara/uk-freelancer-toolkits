import { useMemo } from "react";
import { Download, Copy, Plus, Trash2, Trophy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultCompetitorMatrix } from "../data/ops";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export default function CompetitorMatrix() {
  const [matrix, setMatrix] = useLocalStorage("ops-competitor-matrix", defaultCompetitorMatrix());
  const previewId = "competitor-matrix-preview";

  const update = (field, value) => setMatrix({ ...matrix, [field]: value });

  const addCriterion = () => {
    const next = [...matrix.criteria, { id: newId("crit"), label: "New criterion", weight: 10 }];
    setMatrix({ ...matrix, criteria: next });
  };
  const updateCriterion = (id, field, value) => {
    setMatrix({ ...matrix, criteria: matrix.criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c)) });
  };
  const removeCriterion = (id) => {
    if (matrix.criteria.length <= 1) return;
    const idx = matrix.criteria.findIndex((c) => c.id === id);
    setMatrix({
      ...matrix,
      criteria: matrix.criteria.filter((c) => c.id !== id),
      competitors: matrix.competitors.map((comp) => {
        const scores = { ...comp.scores };
        delete scores[idx];
        const reindexed = {};
        Object.entries(scores).forEach(([k, v]) => {
          const ki = Number(k);
          reindexed[ki > idx ? ki - 1 : ki] = v;
        });
        return { ...comp, scores: reindexed };
      }),
    });
  };

  const addCompetitor = () => {
    const blank = {};
    matrix.criteria.forEach((_, i) => { blank[i] = 5; });
    setMatrix({ ...matrix, competitors: [...matrix.competitors, { id: newId("comp"), name: "New competitor", isUs: false, scores: blank, notes: "" }] });
  };
  const updateCompetitor = (id, field, value) => {
    setMatrix({ ...matrix, competitors: matrix.competitors.map((c) => (c.id === id ? { ...c, [field]: value } : c)) });
  };
  const updateScore = (id, criterionIndex, value) => {
    setMatrix({ ...matrix, competitors: matrix.competitors.map((c) => (c.id === id ? { ...c, scores: { ...c.scores, [criterionIndex]: Number(value) } } : c)) });
  };
  const removeCompetitor = (id) => setMatrix({ ...matrix, competitors: matrix.competitors.filter((c) => c.id !== id) });

  const totals = useMemo(() => {
    const totalWeight = matrix.criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0) || 1;
    return matrix.competitors.map((comp) => {
      const weighted = matrix.criteria.reduce((sum, c, idx) => {
        const score = Number(comp.scores?.[idx] ?? 0);
        return sum + score * (Number(c.weight || 0) / totalWeight);
      }, 0);
      return { id: comp.id, name: comp.name, isUs: comp.isUs, weighted };
    }).sort((a, b) => b.weighted - a.weighted);
  }, [matrix]);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="competitor-matrix-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Trophy size={14} /> Ops & Growth</p>
          <h1>Competitor Analysis Matrix</h1>
          <p>Score competitors 0-10 against the criteria your customers care about, weight the criteria, and see the weighted ranking. Use it for positioning, sales battlecards, and roadmap prioritisation.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(matrix.productName || "matrix").replace(/\s+/g, "-")}-competitor-matrix.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Setup</h2>
        <div className="hiring-form-grid">
          <label>Your product<input value={matrix.productName} onChange={(event) => update("productName", event.target.value)} /></label>
          <label>Customer segment<input value={matrix.segment} onChange={(event) => update("segment", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel">
        <div className="panel-heading">
          <h2>Criteria & weights</h2>
          <button className="secondary-button" onClick={addCriterion}><Plus size={16} /> Add criterion</button>
        </div>
        <div className="line-items">
          {matrix.criteria.map((c) => (
            <div key={c.id} className="line-item-row criterion-row">
              <input value={c.label} onChange={(event) => updateCriterion(c.id, "label", event.target.value)} placeholder="Criterion" />
              <input type="number" min="0" max="100" value={c.weight} onChange={(event) => updateCriterion(c.id, "weight", event.target.value)} placeholder="Weight %" />
              <button className="icon-button" onClick={() => removeCriterion(c.id)} aria-label="Remove criterion" disabled={matrix.criteria.length === 1}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <div className="panel-heading">
          <h2>Competitors (score 0-10)</h2>
          <button className="secondary-button" onClick={addCompetitor}><Plus size={16} /> Add competitor</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid">
            <thead>
              <tr>
                <th>Competitor</th>
                {matrix.criteria.map((c) => <th key={c.id}>{c.label}<br /><small>{c.weight}%</small></th>)}
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {matrix.competitors.map((comp) => (
                <tr key={comp.id} className={comp.isUs ? "us-row" : ""}>
                  <td>
                    <input value={comp.name} onChange={(event) => updateCompetitor(comp.id, "name", event.target.value)} />
                    <label className="checkbox-row mini"><input type="checkbox" checked={!!comp.isUs} onChange={(event) => updateCompetitor(comp.id, "isUs", event.target.checked)} /><span>This is us</span></label>
                  </td>
                  {matrix.criteria.map((c, idx) => (
                    <td key={c.id}>
                      <input type="number" min="0" max="10" value={comp.scores?.[idx] ?? 0} onChange={(event) => updateScore(comp.id, idx, event.target.value)} />
                    </td>
                  ))}
                  <td><input value={comp.notes} onChange={(event) => updateCompetitor(comp.id, "notes", event.target.value)} placeholder="Strengths / weaknesses" /></td>
                  <td><button className="icon-button" onClick={() => removeCompetitor(comp.id)} aria-label="Remove competitor"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Weighted ranking</h3>
        <ul className="check-list">
          {totals.map((row, index) => (
            <li key={row.id} className={row.isUs ? "pass" : ""}>
              <strong>{index + 1}. {row.name}{row.isUs ? " (us)" : ""}</strong>
              <span>Weighted score: {row.weighted.toFixed(2)} / 10</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="calculator-panel">
        <h2>Matrix preview</h2>
        <div id={previewId} className="hiring-document" data-testid="competitor-matrix-preview">
          <header>
            <p className="eyebrow">Competitor Matrix</p>
            <h1>{matrix.productName}</h1>
            <p>Segment: {matrix.segment}</p>
          </header>
          <table className="legal-cookie-table">
            <thead>
              <tr>
                <th>Competitor</th>
                {matrix.criteria.map((c) => <th key={c.id}>{c.label} ({c.weight}%)</th>)}
                <th>Weighted</th>
              </tr>
            </thead>
            <tbody>
              {matrix.competitors.map((comp) => {
                const totalWeight = matrix.criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0) || 1;
                const weighted = matrix.criteria.reduce((sum, c, idx) => sum + Number(comp.scores?.[idx] ?? 0) * (Number(c.weight || 0) / totalWeight), 0);
                return (
                  <tr key={comp.id}>
                    <td><strong>{comp.name}</strong>{comp.isUs ? " (us)" : ""}</td>
                    {matrix.criteria.map((c, idx) => <td key={c.id}>{comp.scores?.[idx] ?? 0}</td>)}
                    <td>{weighted.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h3>Notes</h3>
          <ul>
            {matrix.competitors.map((comp) => <li key={comp.id}><strong>{comp.name}:</strong> {comp.notes || "—"}</li>)}
          </ul>
        </div>
      </section>

      <PremiumCapture source="competitor-matrix" />
    </div>
  );
}
