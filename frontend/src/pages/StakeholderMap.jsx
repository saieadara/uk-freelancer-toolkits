import { Plus, Trash2, Users, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultStakeholderMap } from "../data/businessAnalysis";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `sh-${Math.random().toString(36).slice(2, 8)}`;

const quadrantOf = (power, interest) => `${power >= 5 ? "high" : "low"}-${interest >= 5 ? "high" : "low"}`;

export default function StakeholderMap() {
  const [map, setMap] = useLocalStorage("ba-stakeholder-map", defaultStakeholderMap());
  const previewId = "stakeholder-map-preview";

  const update = (field, value) => setMap({ ...map, [field]: value });
  const updateStakeholder = (id, field, value) => setMap({ ...map, stakeholders: map.stakeholders.map((s) => (s.id === id ? { ...s, [field]: field === "name" || field === "role" || field === "strategy" ? value : Math.max(0, Math.min(10, Number(value))) } : s)) });
  const removeStakeholder = (id) => setMap({ ...map, stakeholders: map.stakeholders.filter((s) => s.id !== id) });
  const addStakeholder = () => setMap({ ...map, stakeholders: [...map.stakeholders, { id: newId(), name: "New stakeholder", role: "", power: 5, interest: 5, strategy: "" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  const grouped = (key) => map.stakeholders.filter((s) => quadrantOf(s.power, s.interest) === key);

  return (
    <div className="page narrow-page" data-testid="stakeholder-map-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Users size={14} /> Business Analyst</p>
          <h1>Stakeholder Map</h1>
          <p>Place each stakeholder on a Power × Interest 2×2 with an engagement strategy. Manage closely · keep satisfied · keep informed · monitor.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(map.projectName || "stakeholder-map").replace(/\s+/g, "-")}-stakeholder-map.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Project</h2>
        <div className="hiring-form-grid">
          <label>Project<input value={map.projectName} onChange={(event) => update("projectName", event.target.value)} /></label>
          <label>Date<input type="date" value={map.date} onChange={(event) => update("date", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="stakeholder-list-panel">
        <div className="panel-heading">
          <h2>Stakeholders</h2>
          <button className="secondary-button" onClick={addStakeholder}><Plus size={16} /> Add stakeholder</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid">
            <thead><tr><th>Name</th><th>Role</th><th>Power 0-10</th><th>Interest 0-10</th><th>Engagement strategy</th><th></th></tr></thead>
            <tbody>
              {map.stakeholders.map((s) => (
                <tr key={s.id}>
                  <td><input value={s.name} onChange={(event) => updateStakeholder(s.id, "name", event.target.value)} /></td>
                  <td><input value={s.role} onChange={(event) => updateStakeholder(s.id, "role", event.target.value)} /></td>
                  <td><input type="number" min="0" max="10" value={s.power} onChange={(event) => updateStakeholder(s.id, "power", event.target.value)} /></td>
                  <td><input type="number" min="0" max="10" value={s.interest} onChange={(event) => updateStakeholder(s.id, "interest", event.target.value)} /></td>
                  <td><input value={s.strategy} onChange={(event) => updateStakeholder(s.id, "strategy", event.target.value)} /></td>
                  <td><button className="icon-button" onClick={() => removeStakeholder(s.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel" data-testid="stakeholder-grid-panel">
        <h2>Power / Interest grid</h2>
        <div className="twobytwo-plot stakeholder-plot" data-testid="stakeholder-plot">
          <span className="axis-label axis-y-high">High power</span>
          <span className="axis-label axis-y-low">Low power</span>
          <span className="axis-label axis-x-low">Low interest</span>
          <span className="axis-label axis-x-high">High interest</span>
          <span className="axis-title axis-y">Power →</span>
          <span className="axis-title axis-x">Interest →</span>

          <div className="twobytwo-quadrant top-left">{map.quadrants["high-low"]?.label}</div>
          <div className="twobytwo-quadrant top-right">{map.quadrants["high-high"]?.label}</div>
          <div className="twobytwo-quadrant bottom-left">{map.quadrants["low-low"]?.label}</div>
          <div className="twobytwo-quadrant bottom-right">{map.quadrants["low-high"]?.label}</div>

          {map.stakeholders.map((s) => {
            const left = (Number(s.interest || 0) / 10) * 100;
            const bottom = (Number(s.power || 0) / 10) * 100;
            return (
              <div key={s.id} className="twobytwo-dot" style={{ left: `${left}%`, bottom: `${bottom}%` }}>
                <span className="dot" />
                <span className="dot-label">{s.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Engagement plan preview</h2>
        <div id={previewId} className="hiring-document" data-testid="stakeholder-map-preview">
          <header>
            <p className="eyebrow">Stakeholder Map · Power / Interest</p>
            <h1>{map.projectName}</h1>
            <p>{map.date}</p>
          </header>

          {[
            { id: "high-high", label: map.quadrants["high-high"]?.label },
            { id: "high-low", label: map.quadrants["high-low"]?.label },
            { id: "low-high", label: map.quadrants["low-high"]?.label },
            { id: "low-low", label: map.quadrants["low-low"]?.label },
          ].map((q) => (
            <div key={q.id}>
              <h3>{q.label}</h3>
              <ul>
                {grouped(q.id).map((s) => <li key={s.id}><strong>{s.name}</strong> ({s.role}) — {s.strategy}</li>)}
                {grouped(q.id).length === 0 && <li>—</li>}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <PremiumCapture source="stakeholder-map" />
    </div>
  );
}
