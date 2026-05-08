import { useMemo } from "react";
import { Plus, Trash2, Grid3x3, Download, Copy, AlertTriangle } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultRaci } from "../data/projectManagement";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const cycleAssignment = (current) => {
  const order = ["", "R", "A", "C", "I"];
  const idx = order.indexOf(current || "");
  return order[(idx + 1) % order.length];
};

export default function RaciMatrix() {
  const [matrix, setMatrix] = useLocalStorage("pm-raci", defaultRaci());
  const previewId = "raci-preview";

  const update = (field, value) => setMatrix({ ...matrix, [field]: value });

  const updateRoleLabel = (id, label) => setMatrix({ ...matrix, roles: matrix.roles.map((r) => (r.id === id ? { ...r, label } : r)) });
  const removeRole = (id) => {
    if (matrix.roles.length <= 1) return;
    setMatrix({
      ...matrix,
      roles: matrix.roles.filter((r) => r.id !== id),
      tasks: matrix.tasks.map((t) => {
        const next = { ...t.assignments };
        delete next[id];
        return { ...t, assignments: next };
      }),
    });
  };
  const addRole = () => {
    const id = newId("role");
    setMatrix({ ...matrix, roles: [...matrix.roles, { id, label: "New role" }] });
  };

  const updateTask = (id, label) => setMatrix({ ...matrix, tasks: matrix.tasks.map((t) => (t.id === id ? { ...t, label } : t)) });
  const removeTask = (id) => setMatrix({ ...matrix, tasks: matrix.tasks.filter((t) => t.id !== id) });
  const addTask = () => setMatrix({ ...matrix, tasks: [...matrix.tasks, { id: newId("tsk"), label: "New task", assignments: {} }] });

  const cycleCell = (taskId, roleId) => {
    setMatrix({
      ...matrix,
      tasks: matrix.tasks.map((t) => (t.id !== taskId ? t : { ...t, assignments: { ...t.assignments, [roleId]: cycleAssignment(t.assignments[roleId]) } })),
    });
  };

  const issues = useMemo(() => {
    return matrix.tasks.map((task) => {
      const accountables = Object.values(task.assignments).filter((v) => v === "A").length;
      let issue = null;
      if (accountables === 0) issue = "No Accountable role";
      else if (accountables > 1) issue = `${accountables} Accountable roles — should be exactly one`;
      return { id: task.id, label: task.label, issue };
    });
  }, [matrix.tasks]);

  const flagged = issues.filter((i) => i.issue);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="raci-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Grid3x3 size={14} /> Project Manager</p>
          <h1>RACI Matrix</h1>
          <p>Tasks vs. roles — click a cell to cycle through R / A / C / I / blank. The board flags any task missing an Accountable, or with more than one.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(matrix.projectName || "raci").replace(/\s+/g, "-")}-raci.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Project</h2>
        <div className="hiring-form-grid">
          <label>Project<input value={matrix.projectName} onChange={(event) => update("projectName", event.target.value)} /></label>
          <label>Date<input type="date" value={matrix.date} onChange={(event) => update("date", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="raci-grid-panel">
        <div className="panel-heading">
          <h2>RACI grid</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="secondary-button" onClick={addRole}><Plus size={16} /> Role</button>
            <button className="secondary-button" onClick={addTask}><Plus size={16} /> Task</button>
          </div>
        </div>
        <p className="form-message">Click a cell to cycle through R (Responsible) → A (Accountable, exactly one) → C (Consulted) → I (Informed) → blank.</p>
        <div className="competitor-grid-wrap">
          <table className="competitor-grid raci-grid">
            <thead>
              <tr>
                <th>Task</th>
                {matrix.roles.map((r) => (
                  <th key={r.id}>
                    <input value={r.label} onChange={(event) => updateRoleLabel(r.id, event.target.value)} />
                    <button className="icon-button mini" onClick={() => removeRole(r.id)} disabled={matrix.roles.length === 1} aria-label="Remove role"><Trash2 size={12} /></button>
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {matrix.tasks.map((task) => {
                const issue = issues.find((i) => i.id === task.id)?.issue;
                return (
                  <tr key={task.id} className={issue ? "raci-issue" : ""} data-testid={`raci-task-${task.id}`}>
                    <td><input value={task.label} onChange={(event) => updateTask(task.id, event.target.value)} /></td>
                    {matrix.roles.map((r) => {
                      const value = task.assignments[r.id] || "";
                      return (
                        <td key={r.id} className="raci-cell" onClick={() => cycleCell(task.id, r.id)} data-testid={`raci-cell-${task.id}-${r.id}`}>
                          <span className={`raci-mark raci-${value || "empty"}`}>{value || "·"}</span>
                        </td>
                      );
                    })}
                    <td><button className="icon-button" onClick={() => removeTask(task.id)} aria-label="Remove task"><Trash2 size={14} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {flagged.length > 0 && (
          <div className="status-banner warn" data-testid="raci-issues-banner">
            <AlertTriangle size={18} />
            <span>{flagged.length} task{flagged.length === 1 ? "" : "s"} need{flagged.length === 1 ? "s" : ""} attention. Each task should have exactly one Accountable.</span>
          </div>
        )}
        {flagged.length > 0 && (
          <ul className="check-list" data-testid="raci-issues-list">
            {flagged.map((row) => <li key={row.id} className="fail"><strong>{row.label}</strong><span>{row.issue}</span></li>)}
          </ul>
        )}
      </section>

      <section className="calculator-panel">
        <h2>Matrix preview</h2>
        <div id={previewId} className="hiring-document" data-testid="raci-preview">
          <header>
            <p className="eyebrow">RACI Matrix</p>
            <h1>{matrix.projectName}</h1>
            <p>{matrix.date}</p>
          </header>
          <table className="legal-cookie-table">
            <thead>
              <tr><th>Task</th>{matrix.roles.map((r) => <th key={r.id}>{r.label}</th>)}</tr>
            </thead>
            <tbody>
              {matrix.tasks.map((task) => (
                <tr key={task.id}>
                  <td><strong>{task.label}</strong></td>
                  {matrix.roles.map((r) => <td key={r.id}>{task.assignments[r.id] || "—"}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          {flagged.length > 0 && (
            <>
              <h3>Issues to resolve</h3>
              <ul>{flagged.map((row) => <li key={row.id}><strong>{row.label}</strong> — {row.issue}</li>)}</ul>
            </>
          )}
        </div>
      </section>

      <PremiumCapture source="raci-matrix" />
    </div>
  );
}
