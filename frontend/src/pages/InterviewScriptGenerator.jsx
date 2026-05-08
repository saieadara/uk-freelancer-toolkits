import { Download, Copy, Plus, Trash2, Users } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultInterviewScript } from "../data/ops";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const sections = [
  { id: "warmup", label: "Warm-up & context", description: "Open the conversation with low-stakes questions about their world. Don't pitch — listen." },
  { id: "behaviour", label: "Behaviour & current workflow", description: "Ask what they actually did, not what they would do. Past behaviour beats hypothetical preferences (The Mom Test)." },
  { id: "pain", label: "Pain & cost of the problem", description: "Quantify the problem in their words. Time, money, frustration, missed outcomes." },
  { id: "currentSolutions", label: "Current solutions", description: "Understand what they tried and why each failed. The shortcomings inform your differentiation." },
  { id: "willingnessToPay", label: "Willingness to pay", description: "Test pricing without leading. Ask about budget owner and budget line, not just numbers." },
];

export default function InterviewScriptGenerator() {
  const [script, setScript] = useLocalStorage("ops-interview-script", defaultInterviewScript());
  const previewId = "interview-script-preview";

  const update = (field, value) => setScript({ ...script, [field]: value });
  const updateQuestion = (sectionId, index, value) => {
    const next = [...(script[sectionId] || [])];
    next[index] = value;
    update(sectionId, next);
  };
  const addQuestion = (sectionId) => update(sectionId, [...(script[sectionId] || []), "New question"]);
  const removeQuestion = (sectionId, index) => update(sectionId, (script[sectionId] || []).filter((_, i) => i !== index));

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="interview-script-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Users size={14} /> Ops & Growth</p>
          <h1>Customer Interview Script</h1>
          <p>Build a problem / solution interview script that follows The Mom Test pattern: ask about behaviour, not opinions. Export to PDF and run a 30-minute call with no pitch.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(script.intervieweeName || "interview").replace(/\s+/g, "-")}-interview-script.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Interview meta</h2>
        <div className="hiring-form-grid">
          <label className="hiring-field-wide">Product hypothesis<textarea rows={2} value={script.productHypothesis} onChange={(event) => update("productHypothesis", event.target.value)} /></label>
          <label className="hiring-field-wide">Target segment<textarea rows={2} value={script.segment} onChange={(event) => update("segment", event.target.value)} /></label>
          <label>Interviewer<input value={script.interviewerName} onChange={(event) => update("interviewerName", event.target.value)} /></label>
          <label>Interviewee<input value={script.intervieweeName} onChange={(event) => update("intervieweeName", event.target.value)} /></label>
          <label>Date<input type="date" value={script.interviewDate} onChange={(event) => update("interviewDate", event.target.value)} /></label>
          <label>Duration (min)<input type="number" value={script.durationMinutes} onChange={(event) => update("durationMinutes", event.target.value)} /></label>
          <label className="hiring-field-wide">Rapport opener<textarea rows={2} value={script.rapportPrompts} onChange={(event) => update("rapportPrompts", event.target.value)} /></label>
        </div>
      </section>

      {sections.map((section) => (
        <section className="calculator-panel" key={section.id}>
          <div className="panel-heading">
            <h2>{section.label}</h2>
            <button className="secondary-button" onClick={() => addQuestion(section.id)}><Plus size={16} /> Add question</button>
          </div>
          <p className="form-message">{section.description}</p>
          <div className="line-items">
            {(script[section.id] || []).map((q, index) => (
              <div key={index} className="line-item-row interview-question-row">
                <input value={q} onChange={(event) => updateQuestion(section.id, index, event.target.value)} placeholder="Question" />
                <button className="icon-button" onClick={() => removeQuestion(section.id, index)} aria-label="Remove question"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="calculator-panel">
        <h2>Closing</h2>
        <div className="hiring-form-grid">
          <label className="hiring-field-wide"><textarea rows={3} value={script.closing} onChange={(event) => update("closing", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Script preview</h2>
        <div id={previewId} className="hiring-document" data-testid="interview-script-preview">
          <header>
            <p className="eyebrow">Customer Interview Script</p>
            <h1>{script.intervieweeName}</h1>
            <p>{script.interviewDate} · {script.durationMinutes} minutes · interviewer: {script.interviewerName}</p>
          </header>

          <p><strong>Product hypothesis:</strong> {script.productHypothesis}</p>
          <p><strong>Target segment:</strong> {script.segment}</p>

          <h3>Opening</h3>
          <p>{script.rapportPrompts}</p>

          {sections.map((section) => (
            <div key={section.id}>
              <h3>{section.label}</h3>
              <ol>
                {(script[section.id] || []).map((q, index) => <li key={index}>{q}</li>)}
              </ol>
            </div>
          ))}

          <h3>Close</h3>
          <p>{script.closing}</p>
        </div>
      </section>

      <PremiumCapture source="interview-script-generator" />
    </div>
  );
}
