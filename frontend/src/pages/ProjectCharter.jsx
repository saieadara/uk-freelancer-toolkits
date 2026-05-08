import { ClipboardCheck, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultProjectCharter } from "../data/strategy";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const fields = [
  { id: "projectName", label: "Project name" },
  { id: "sponsor", label: "Sponsor" },
  { id: "manager", label: "Project manager" },
  { id: "startDate", label: "Start date", type: "date" },
  { id: "endDate", label: "End date", type: "date" },
  { id: "budget", label: "Budget" },
  { id: "goal", label: "Goal", textarea: true },
  { id: "scopeIn", label: "Scope (in)", textarea: true },
  { id: "scopeOut", label: "Scope (out)", textarea: true },
  { id: "objectives", label: "Objectives", textarea: true },
  { id: "deliverables", label: "Deliverables", textarea: true },
  { id: "milestones", label: "Milestones", textarea: true },
  { id: "risks", label: "Risks", textarea: true },
  { id: "governance", label: "Governance", textarea: true },
  { id: "successCriteria", label: "Success criteria", textarea: true },
];

export default function ProjectCharter() {
  const [charter, setCharter] = useLocalStorage("strategy-project-charter", defaultProjectCharter());
  const previewId = "project-charter-preview";

  const update = (field, value) => setCharter({ ...charter, [field]: value });
  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="project-charter-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><ClipboardCheck size={14} /> Strategy Consultant</p>
          <h1>Project Charter</h1>
          <p>One-page charter covering scope, objectives, deliverables, timeline, budget, governance, and risks. Sign-off ready.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(charter.projectName || "project").replace(/\s+/g, "-")}-charter.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Charter fields</h2>
        <div className="hiring-form-grid">
          {fields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={charter[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`charter-field-${field.id}`} />
                : <input type={field.type || "text"} value={charter[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`charter-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Charter preview</h2>
        <div id={previewId} className="hiring-document" data-testid="project-charter-preview">
          <header>
            <p className="eyebrow">Project Charter</p>
            <h1>{charter.projectName}</h1>
            <p>{charter.startDate} → {charter.endDate} · sponsor {charter.sponsor} · manager {charter.manager} · budget {charter.budget}</p>
          </header>

          <h3>1. Goal</h3>
          <p>{charter.goal}</p>

          <h3>2. Scope (in)</h3>
          <p>{charter.scopeIn}</p>

          <h3>3. Scope (out)</h3>
          <p>{charter.scopeOut}</p>

          <h3>4. Objectives</h3>
          <p>{charter.objectives}</p>

          <h3>5. Deliverables</h3>
          <p>{charter.deliverables}</p>

          <h3>6. Milestones</h3>
          <p>{charter.milestones}</p>

          <h3>7. Risks</h3>
          <p>{charter.risks}</p>

          <h3>8. Governance</h3>
          <p>{charter.governance}</p>

          <h3>9. Success criteria</h3>
          <p>{charter.successCriteria}</p>
        </div>
      </section>

      <PremiumCapture source="project-charter" />
    </div>
  );
}
