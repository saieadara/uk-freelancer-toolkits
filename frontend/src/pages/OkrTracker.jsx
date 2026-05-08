import { useMemo } from "react";
import { Download, Copy, Plus, Trash2, Target } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultOkrTracker } from "../data/ops";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const progressPercent = (current, target) => {
  const c = Number(current || 0);
  const t = Number(target || 0);
  if (t === 0) return 0;
  return Math.max(0, Math.min(100, (c / t) * 100));
};

export default function OkrTracker({
  storageKey = "ops-okr-tracker",
  defaultFactory = defaultOkrTracker,
  eyebrowLabel = "Ops & Growth",
  pageTitle = "OKR Tracker",
  pageDescription = "Run a deliberate quarter. Set 2-3 objectives with measurable key results, update progress weekly, and export the goal sheet for sharing with the team.",
  themeFieldLabel = "Company theme",
  pageId = "okr-tracker-page",
  premiumSource = "okr-tracker",
} = {}) {
  const [tracker, setTracker] = useLocalStorage(storageKey, defaultFactory());
  const previewId = `${pageId}-preview`;

  const update = (field, value) => setTracker({ ...tracker, [field]: value });

  const updateObjective = (id, field, value) => {
    setTracker({ ...tracker, objectives: tracker.objectives.map((obj) => (obj.id === id ? { ...obj, [field]: value } : obj)) });
  };
  const removeObjective = (id) => setTracker({ ...tracker, objectives: tracker.objectives.filter((obj) => obj.id !== id) });
  const addObjective = () => setTracker({ ...tracker, objectives: [...tracker.objectives, { id: newId("obj"), title: "New objective", keyResults: [] }] });

  const updateKr = (objId, krId, field, value) => {
    setTracker({
      ...tracker,
      objectives: tracker.objectives.map((obj) => obj.id !== objId ? obj : {
        ...obj,
        keyResults: obj.keyResults.map((kr) => (kr.id === krId ? { ...kr, [field]: value } : kr)),
      }),
    });
  };
  const removeKr = (objId, krId) => {
    setTracker({
      ...tracker,
      objectives: tracker.objectives.map((obj) => obj.id !== objId ? obj : { ...obj, keyResults: obj.keyResults.filter((kr) => kr.id !== krId) }),
    });
  };
  const addKr = (objId) => {
    setTracker({
      ...tracker,
      objectives: tracker.objectives.map((obj) => obj.id !== objId ? obj : { ...obj, keyResults: [...obj.keyResults, { id: newId("kr"), title: "New key result", target: 100, current: 0, unit: "", confidence: 50 }] }),
    });
  };

  const objectiveProgress = (obj) => {
    if (!obj.keyResults || obj.keyResults.length === 0) return 0;
    const total = obj.keyResults.reduce((sum, kr) => sum + progressPercent(kr.current, kr.target), 0);
    return total / obj.keyResults.length;
  };

  const overall = useMemo(() => {
    if (tracker.objectives.length === 0) return 0;
    return tracker.objectives.reduce((sum, obj) => sum + objectiveProgress(obj), 0) / tracker.objectives.length;
  }, [tracker.objectives]);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid={pageId}>
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Target size={14} /> {eyebrowLabel}</p>
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(tracker.quarter || "okrs").replace(/\s+/g, "-")}-okrs.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Quarter</h2>
        <div className="hiring-form-grid">
          <label>Quarter<input value={tracker.quarter} onChange={(event) => update("quarter", event.target.value)} data-testid="okr-quarter-input" /></label>
          <label className="hiring-field-wide">{themeFieldLabel}<input value={tracker.companyTheme} onChange={(event) => update("companyTheme", event.target.value)} data-testid="okr-theme-input" /></label>
        </div>
        <div className="result-grid">
          <div><span>Objectives</span><strong>{tracker.objectives.length}</strong></div>
          <div><span>Total key results</span><strong>{tracker.objectives.reduce((sum, obj) => sum + obj.keyResults.length, 0)}</strong></div>
          <div><span>Overall progress</span><strong>{overall.toFixed(0)}%</strong></div>
        </div>
      </section>

      <section className="calculator-panel">
        <div className="panel-heading">
          <h2>Objectives & key results</h2>
          <button className="secondary-button" onClick={addObjective} data-testid="okr-add-objective"><Plus size={16} /> Add objective</button>
        </div>
        <div className="okr-objective-list" data-testid="okr-objective-list">
          {tracker.objectives.map((obj, index) => (
            <div key={obj.id} className="okr-objective" data-testid={`okr-objective-${index}`}>
              <div className="okr-objective-head">
                <input className="okr-objective-title" value={obj.title} onChange={(event) => updateObjective(obj.id, "title", event.target.value)} placeholder="Objective" />
                <span className="okr-objective-progress">{objectiveProgress(obj).toFixed(0)}%</span>
                <button className="icon-button" onClick={() => removeObjective(obj.id)} aria-label="Remove objective"><Trash2 size={16} /></button>
              </div>
              <div className="okr-progress-track"><div className="okr-progress-fill" style={{ width: `${objectiveProgress(obj)}%` }} /></div>
              <div className="okr-kr-list">
                {obj.keyResults.map((kr) => (
                  <div key={kr.id} className="okr-kr-row">
                    <input className="okr-kr-title" value={kr.title} onChange={(event) => updateKr(obj.id, kr.id, "title", event.target.value)} placeholder="Key result" />
                    <input type="number" value={kr.current} onChange={(event) => updateKr(obj.id, kr.id, "current", event.target.value)} placeholder="Current" />
                    <input type="number" value={kr.target} onChange={(event) => updateKr(obj.id, kr.id, "target", event.target.value)} placeholder="Target" />
                    <input value={kr.unit} onChange={(event) => updateKr(obj.id, kr.id, "unit", event.target.value)} placeholder="Unit" />
                    <input type="number" min="0" max="100" value={kr.confidence} onChange={(event) => updateKr(obj.id, kr.id, "confidence", event.target.value)} placeholder="Confidence %" />
                    <button className="icon-button" onClick={() => removeKr(obj.id, kr.id)} aria-label="Remove key result"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <button className="text-button" onClick={() => addKr(obj.id)}><Plus size={14} /> Add key result</button>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Goal sheet preview</h2>
        <div id={previewId} className="hiring-document" data-testid="okr-tracker-preview">
          <header>
            <p className="eyebrow">OKRs · {tracker.quarter}</p>
            <h1>{tracker.quarter} goal sheet</h1>
            <p>{tracker.companyTheme}</p>
            <p>Overall progress: {overall.toFixed(0)}%</p>
          </header>
          {tracker.objectives.map((obj, index) => (
            <div key={obj.id} className="okr-preview-objective">
              <h2>O{index + 1}. {obj.title}</h2>
              <p>Progress: {objectiveProgress(obj).toFixed(0)}%</p>
              <ul>
                {obj.keyResults.map((kr) => (
                  <li key={kr.id}>
                    <strong>{kr.title}</strong> — {kr.current}/{kr.target} {kr.unit} ({progressPercent(kr.current, kr.target).toFixed(0)}% · confidence {kr.confidence}%)
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <PremiumCapture source={premiumSource} />
    </div>
  );
}
