import { useMemo } from "react";
import { Plus, Trash2, Map, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultMilestoneRoadmap } from "../data/projectManagement";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `m-${Math.random().toString(36).slice(2, 8)}`;

const swimLanes = ["Plan", "Build", "Compliance", "Launch"];

export default function MilestoneRoadmap() {
  const [roadmap, setRoadmap] = useLocalStorage("pm-milestone-roadmap", defaultMilestoneRoadmap());
  const previewId = "milestone-roadmap-preview";

  const update = (field, value) => setRoadmap({ ...roadmap, [field]: typeof roadmap[field] === "number" ? Number(value) : value });

  const updateMilestone = (id, field, value) => {
    setRoadmap({
      ...roadmap,
      milestones: roadmap.milestones.map((m) => (m.id === id ? { ...m, [field]: field === "weekOffset" ? Math.max(0, Number(value)) : (field === "complete" ? value : value) } : m)),
    });
  };
  const removeMilestone = (id) => setRoadmap({ ...roadmap, milestones: roadmap.milestones.filter((m) => m.id !== id) });
  const addMilestone = () => setRoadmap({ ...roadmap, milestones: [...roadmap.milestones, { id: newId(), label: "New milestone", weekOffset: 1, lane: "Plan", complete: false, note: "" }] });

  const totalWeeks = Math.max(roadmap.totalWeeks || 12, ...roadmap.milestones.map((m) => Number(m.weekOffset || 0)));
  const weekTicks = useMemo(() => Array.from({ length: totalWeeks + 1 }, (_, i) => i), [totalWeeks]);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="milestone-roadmap-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Map size={14} /> Project Manager</p>
          <h1>Milestone Roadmap One-Pager</h1>
          <p>A clean horizontal timeline of milestones per swim-lane — designed to fit on one slide and land cleanly with execs. Not a full Gantt.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(roadmap.projectName || "roadmap").replace(/\s+/g, "-")}-milestone-roadmap.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Roadmap header</h2>
        <div className="hiring-form-grid">
          <label>Project<input value={roadmap.projectName} onChange={(event) => update("projectName", event.target.value)} /></label>
          <label>PM<input value={roadmap.pm} onChange={(event) => update("pm", event.target.value)} /></label>
          <label>Date<input type="date" value={roadmap.date} onChange={(event) => update("date", event.target.value)} /></label>
          <label>Total weeks<input type="number" min="1" value={roadmap.totalWeeks} onChange={(event) => update("totalWeeks", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="milestone-list-panel">
        <div className="panel-heading">
          <h2>Milestones</h2>
          <button className="secondary-button" onClick={addMilestone}><Plus size={16} /> Add milestone</button>
        </div>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid">
            <thead><tr><th>Label</th><th>Week</th><th>Lane</th><th>Note</th><th>Done</th><th></th></tr></thead>
            <tbody>
              {roadmap.milestones.map((m) => (
                <tr key={m.id}>
                  <td><input value={m.label} onChange={(event) => updateMilestone(m.id, "label", event.target.value)} /></td>
                  <td><input type="number" min="0" value={m.weekOffset} onChange={(event) => updateMilestone(m.id, "weekOffset", event.target.value)} /></td>
                  <td><select value={m.lane} onChange={(event) => updateMilestone(m.id, "lane", event.target.value)}>{swimLanes.map((l) => <option key={l} value={l}>{l}</option>)}</select></td>
                  <td><input value={m.note} onChange={(event) => updateMilestone(m.id, "note", event.target.value)} /></td>
                  <td><input type="checkbox" checked={!!m.complete} onChange={(event) => updateMilestone(m.id, "complete", event.target.checked)} /></td>
                  <td><button className="icon-button" onClick={() => removeMilestone(m.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="calculator-panel" data-testid="milestone-canvas-panel">
        <h2>Roadmap canvas</h2>
        <div className="roadmap-canvas">
          <div className="roadmap-axis" style={{ gridTemplateColumns: `120px repeat(${totalWeeks}, minmax(40px, 1fr))` }}>
            <div className="roadmap-axis-corner">Lane</div>
            {weekTicks.slice(0, -1).map((w) => <div key={w} className="roadmap-week">W{w + 1}</div>)}
          </div>
          {swimLanes.map((lane) => {
            const inLane = roadmap.milestones.filter((m) => m.lane === lane);
            return (
              <div key={lane} className="roadmap-lane" style={{ gridTemplateColumns: `120px repeat(${totalWeeks}, minmax(40px, 1fr))` }}>
                <div className="roadmap-lane-label">{lane}</div>
                <div className="roadmap-track" style={{ gridColumn: `2 / span ${totalWeeks}` }}>
                  {inLane.map((m) => {
                    const left = (Number(m.weekOffset || 0) / totalWeeks) * 100;
                    return (
                      <div key={m.id} className={`roadmap-milestone ${m.complete ? "complete" : ""}`} style={{ left: `${left}%` }} data-testid={`milestone-${m.id}`}>
                        <span className="diamond" />
                        <span className="milestone-label">{m.label}{m.note ? ` · ${m.note}` : ""}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Roadmap preview</h2>
        <div id={previewId} className="hiring-document" data-testid="milestone-roadmap-preview">
          <header>
            <p className="eyebrow">Milestone Roadmap</p>
            <h1>{roadmap.projectName}</h1>
            <p>{roadmap.date} · PM {roadmap.pm} · {totalWeeks} weeks</p>
          </header>
          {swimLanes.map((lane) => {
            const inLane = roadmap.milestones.filter((m) => m.lane === lane);
            if (inLane.length === 0) return null;
            return (
              <div key={lane}>
                <h3>{lane}</h3>
                <ul>
                  {inLane.sort((a, b) => a.weekOffset - b.weekOffset).map((m) => (
                    <li key={m.id}><strong>W{m.weekOffset + 1}: {m.label}</strong>{m.complete ? " (done)" : ""}{m.note ? ` — ${m.note}` : ""}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <PremiumCapture source="milestone-roadmap" />
    </div>
  );
}
