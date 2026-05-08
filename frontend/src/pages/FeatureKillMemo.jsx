import { Skull, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultKillMemo } from "../data/product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const fields = [
  { id: "featureName", label: "Feature being sunset" },
  { id: "decisionDate", label: "Decision date", type: "date" },
  { id: "sunsetDate", label: "Sunset date", type: "date" },
  { id: "decisionOwner", label: "Decision owner" },
  { id: "approvers", label: "Approvers" },
  { id: "reason", label: "Why now (data + judgement)", textarea: true },
  { id: "affectedUsers", label: "Who is affected", textarea: true },
  { id: "migrationPath", label: "Migration path", textarea: true },
  { id: "alternativeOfferings", label: "Alternative offerings", textarea: true },
  { id: "rollbackPlan", label: "Rollback plan", textarea: true },
  { id: "successCriteria", label: "Success criteria for the kill", textarea: true },
];

export default function FeatureKillMemo() {
  const [memo, setMemo] = useLocalStorage("product-kill-memo", defaultKillMemo());
  const previewId = "kill-memo-preview";

  const update = (field, value) => setMemo({ ...memo, [field]: value });
  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="kill-memo-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Skull size={14} /> Product Management</p>
          <h1>Feature Kill Memo</h1>
          <p>One screen to capture exactly what you're sunsetting and why, who is affected, the migration path, and the criteria you'll judge the decision against later.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(memo.featureName || "feature").replace(/\s+/g, "-")}-kill-memo.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Memo fields</h2>
        <div className="hiring-form-grid">
          {fields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={memo[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`kill-field-${field.id}`} />
                : <input type={field.type || "text"} value={memo[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`kill-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Memo preview</h2>
        <div id={previewId} className="hiring-document" data-testid="kill-memo-preview">
          <header>
            <p className="eyebrow">Feature Kill Memo</p>
            <h1>{memo.featureName}</h1>
            <p>Decision {memo.decisionDate} · sunset on {memo.sunsetDate}</p>
          </header>

          <h3>1. Decision</h3>
          <p>We are sunsetting <strong>{memo.featureName}</strong>. Owner: {memo.decisionOwner}. Approvers: {memo.approvers}.</p>

          <h3>2. Why now</h3>
          <p>{memo.reason}</p>

          <h3>3. Who's affected</h3>
          <p>{memo.affectedUsers}</p>

          <h3>4. Migration path</h3>
          <p>{memo.migrationPath}</p>

          <h3>5. Alternative offerings</h3>
          <p>{memo.alternativeOfferings}</p>

          <h3>6. Rollback plan</h3>
          <p>{memo.rollbackPlan}</p>

          <h3>7. Success criteria for this decision</h3>
          <p>{memo.successCriteria}</p>

          <p>Sunset on: <strong>{memo.sunsetDate}</strong>.</p>
        </div>
      </section>

      <PremiumCapture source="feature-kill-memo" />
    </div>
  );
}
