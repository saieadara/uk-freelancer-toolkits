import { Plus, Trash2, Download, Copy, FileText } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";
import { exportRcaPptx } from "../utils/pptx";

const newId = () => `why-${Math.random().toString(36).slice(2, 8)}`;

const defaultRca = () => ({
  problem: "Customer activation rate dropped from 32% to 24% in the last 30 days.",
  detectedDate: new Date().toISOString().slice(0, 10),
  owner: "Lead BA",
  whys: [
    { id: newId(), question: "Why did activation drop?", answer: "First-export completion is down (was 56%, now 41%)." },
    { id: newId(), question: "Why is first-export completion down?", answer: "Users abandon at the document-customisation step." },
    { id: newId(), question: "Why are they abandoning?", answer: "The new colour-picker introduced an extra step before the export button." },
    { id: newId(), question: "Why was an extra step introduced?", answer: "Brand customisation shipped without measuring activation impact behind a flag." },
    { id: newId(), question: "Why didn't we flag it?", answer: "Activation isn't on the pre-deploy regression checklist." },
  ],
  rootCause: "Activation isn't part of the pre-deploy regression checklist, so behaviour-changing UX additions ship without an A/B safety net.",
  countermeasure: "Add activation rate (and 4 other key funnel metrics) to the deploy gate. Any UX change to the document-builder ships behind a feature flag with a 5-day A/B before default-on.",
  owner2: "Lead Engineer",
  deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  fishboneEnabled: true,
  fishbone: {
    people: "New designer onboarded recently — onboarding didn't include the deployment regression checklist.",
    process: "No mandatory feature flagging on UX changes. No activation regression test.",
    technology: "Feature flag library exists but isn't wired into the document-builder.",
    materials: "Brand colour picker shipped without UX research validation.",
    environment: "End-of-quarter pressure pushed change directly to production.",
    measurement: "Activation funnel metrics not in standard release dashboards.",
  },
});

const fishboneCategories = [
  { id: "people", label: "People" },
  { id: "process", label: "Process" },
  { id: "technology", label: "Technology" },
  { id: "materials", label: "Materials" },
  { id: "environment", label: "Environment" },
  { id: "measurement", label: "Measurement" },
];

export default function RootCauseAnalysis() {
  const [rca, setRca] = useLocalStorage("strategy-rca", defaultRca());
  const previewId = "rca-preview";

  const update = (field, value) => setRca({ ...rca, [field]: value });
  const updateWhy = (id, field, value) => setRca({ ...rca, whys: rca.whys.map((w) => (w.id === id ? { ...w, [field]: value } : w)) });
  const removeWhy = (id) => {
    if (rca.whys.length <= 1) return;
    setRca({ ...rca, whys: rca.whys.filter((w) => w.id !== id) });
  };
  const addWhy = () => setRca({ ...rca, whys: [...rca.whys, { id: newId(), question: `Why ${rca.whys.length + 1}?`, answer: "" }] });

  const updateFishbone = (id, value) => setRca({ ...rca, fishbone: { ...rca.fishbone, [id]: value } });

  const copyDoc = async () => {
    try { await navigator.clipboard.writeText(document.getElementById(previewId)?.innerText || ""); } catch (_e) {}
  };

  return (
    <div className="m-page" id={previewId} data-testid="rca-page">
      <header className="m-head">
        <div className="m-head-left">
          <p className="m-eyebrow">5 Whys + Fishbone · root cause</p>
          <textarea className="m-title" value={rca.problem} onChange={(e) => update("problem", e.target.value)} placeholder="Problem statement (specific, observable)" rows={2} />
          <div className="m-fields">
            <label className="m-field"><span className="m-field-label">Detected</span><input type="date" value={rca.detectedDate} onChange={(e) => update("detectedDate", e.target.value)} /></label>
            <label className="m-field"><span className="m-field-label">Owner</span><input value={rca.owner} onChange={(e) => update("owner", e.target.value)} /></label>
            <label className="m-toggle-row" style={{ alignSelf: "end", paddingBottom: 6 }}>
              <input type="checkbox" checked={!!rca.fishboneEnabled} onChange={(e) => update("fishboneEnabled", e.target.checked)} /> Fishbone
            </label>
          </div>
        </div>
        <div className="m-actions">
          <button className="m-button" onClick={copyDoc}><Copy size={14} /> Copy</button>
          <button className="m-button" onClick={() => exportRcaPptx(rca)}><FileText size={14} /> PPT</button>
          <button className="m-button m-button-primary" onClick={() => downloadElementAsPdf(previewId, `rca-${rca.detectedDate}.pdf`)}><Download size={14} /> PDF</button>
        </div>
      </header>

      <section>
        <p className="m-label" style={{ marginBottom: 8 }}>Why cascade</p>
        <div className="m-rca-cascade" data-testid="rca-cascade">
          {rca.whys.map((why, index) => (
            <div key={why.id} className="m-rca-step" data-testid={`rca-step-${index}`}>
              <span className="m-rca-num">Why {index + 1}</span>
              <input className="m-rca-q" value={why.question} onChange={(e) => updateWhy(why.id, "question", e.target.value)} />
              <textarea className="m-rca-a" value={why.answer} onChange={(e) => updateWhy(why.id, "answer", e.target.value)} placeholder="Answer / evidence" />
              <button className="m-icon-button" onClick={() => removeWhy(why.id)} disabled={rca.whys.length === 1} style={{ justifySelf: "end" }}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
        <button className="m-button m-button-ghost" onClick={addWhy} style={{ marginTop: 6 }} data-testid="rca-add"><Plus size={14} /> Add why</button>
      </section>

      {rca.fishboneEnabled && (
        <section>
          <p className="m-label" style={{ marginBottom: 8 }}>Fishbone — contributing factors</p>
          <div className="m-fish" data-testid="fishbone">
            <div className="m-fish-bones">
              {fishboneCategories.map((category) => (
                <div key={category.id} className="m-fish-bone" data-testid={`fishbone-${category.id}`}>
                  <span className="m-fish-bone-label">{category.label}</span>
                  <textarea className="m-textarea" value={rca.fishbone[category.id] || ""} onChange={(e) => updateFishbone(category.id, e.target.value)} placeholder={category.label.toLowerCase()} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="m-rca-action">
        <label className="m-field">
          <span className="m-field-label">Root cause + countermeasure</span>
          <textarea className="m-textarea" value={rca.rootCause} onChange={(e) => update("rootCause", e.target.value)} placeholder="Root cause" rows={2} />
          <textarea className="m-textarea" value={rca.countermeasure} onChange={(e) => update("countermeasure", e.target.value)} placeholder="Countermeasure" rows={2} style={{ marginTop: 6 }} />
        </label>
        <label className="m-field">
          <span className="m-field-label">Action owner</span>
          <input value={rca.owner2} onChange={(e) => update("owner2", e.target.value)} />
        </label>
        <label className="m-field">
          <span className="m-field-label">Deadline</span>
          <input type="date" value={rca.deadline} onChange={(e) => update("deadline", e.target.value)} />
        </label>
      </div>

      <PremiumCapture source="root-cause-analysis" />
    </div>
  );
}
