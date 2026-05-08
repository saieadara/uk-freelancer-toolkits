import { Plus, Trash2, Lightbulb, Download, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultInterviewSynthesis } from "../data/product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export default function InterviewSynthesis() {
  const [synth, setSynth] = useLocalStorage("product-interview-synthesis", defaultInterviewSynthesis());
  const previewId = "interview-synthesis-preview";

  const update = (field, value) => setSynth({ ...synth, [field]: value });

  const updateTheme = (id, field, value) => {
    setSynth({ ...synth, themes: synth.themes.map((t) => (t.id === id ? { ...t, [field]: value } : t)) });
  };
  const removeTheme = (id) => setSynth({ ...synth, themes: synth.themes.filter((t) => t.id !== id) });
  const addTheme = () => setSynth({
    ...synth,
    themes: [...synth.themes, { id: newId("theme"), label: "New theme", summary: "", nextStep: "", quotes: [] }],
  });

  const updateQuote = (themeId, quoteId, field, value) => {
    setSynth({
      ...synth,
      themes: synth.themes.map((t) => t.id !== themeId ? t : {
        ...t,
        quotes: t.quotes.map((q) => (q.id === quoteId ? { ...q, [field]: value } : q)),
      }),
    });
  };
  const removeQuote = (themeId, quoteId) => {
    setSynth({
      ...synth,
      themes: synth.themes.map((t) => t.id !== themeId ? t : { ...t, quotes: t.quotes.filter((q) => q.id !== quoteId) }),
    });
  };
  const addQuote = (themeId) => {
    setSynth({
      ...synth,
      themes: synth.themes.map((t) => t.id !== themeId ? t : { ...t, quotes: [...t.quotes, { id: newId("q"), interviewee: "F?", quote: "" }] }),
    });
  };

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="interview-synthesis-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Lightbulb size={14} /> Product Management</p>
          <h1>Customer Interview Synthesis</h1>
          <p>Take the notes from <Link to="/ops/interview-script">the interview script tool</Link>, group quotes into themes, and convert each theme into a single insight and the next experiment.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `interview-synthesis.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Project context</h2>
        <div className="hiring-form-grid">
          <label className="hiring-field-wide">Product hypothesis<textarea rows={2} value={synth.productHypothesis} onChange={(event) => update("productHypothesis", event.target.value)} /></label>
          <label className="hiring-field-wide">Segment<textarea rows={2} value={synth.segment} onChange={(event) => update("segment", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel">
        <div className="panel-heading">
          <h2>Themes</h2>
          <button className="secondary-button" onClick={addTheme} data-testid="synthesis-add-theme"><Plus size={16} /> Add theme</button>
        </div>
        <div className="theme-list" data-testid="synthesis-theme-list">
          {synth.themes.map((theme, index) => (
            <div key={theme.id} className="theme-card" data-testid={`synthesis-theme-${index}`}>
              <div className="theme-card-head">
                <input className="theme-label" value={theme.label} onChange={(event) => updateTheme(theme.id, "label", event.target.value)} placeholder="Theme name" />
                <button className="icon-button" onClick={() => removeTheme(theme.id)} aria-label="Remove theme"><Trash2 size={14} /></button>
              </div>
              <label>Insight<textarea rows={3} value={theme.summary} onChange={(event) => updateTheme(theme.id, "summary", event.target.value)} placeholder="Summarise the insight in plain English." /></label>
              <label>Next experiment<textarea rows={2} value={theme.nextStep} onChange={(event) => updateTheme(theme.id, "nextStep", event.target.value)} placeholder="The single concrete next step this theme implies." /></label>
              <div className="theme-quotes">
                <div className="panel-heading">
                  <h3>Supporting quotes</h3>
                  <button className="text-button" onClick={() => addQuote(theme.id)}><Plus size={14} /> Quote</button>
                </div>
                {theme.quotes.map((q) => (
                  <div key={q.id} className="theme-quote-row">
                    <input className="theme-interviewee" value={q.interviewee} onChange={(event) => updateQuote(theme.id, q.id, "interviewee", event.target.value)} placeholder="F1" />
                    <textarea rows={2} value={q.quote} onChange={(event) => updateQuote(theme.id, q.id, "quote", event.target.value)} placeholder='"Direct quote in plain English."' />
                    <button className="icon-button" onClick={() => removeQuote(theme.id, q.id)} aria-label="Remove quote"><Trash2 size={14} /></button>
                  </div>
                ))}
                {theme.quotes.length === 0 && <p className="form-message">No quotes yet — add the strongest two from your interview notes.</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Synthesis preview</h2>
        <div id={previewId} className="hiring-document" data-testid="interview-synthesis-preview">
          <header>
            <p className="eyebrow">Interview Synthesis</p>
            <h1>{synth.themes.length} theme{synth.themes.length === 1 ? "" : "s"}</h1>
            <p>{synth.segment}</p>
          </header>
          <p><strong>Product hypothesis:</strong> {synth.productHypothesis}</p>
          {synth.themes.map((theme, index) => (
            <div key={theme.id}>
              <h2>{index + 1}. {theme.label}</h2>
              <p><strong>Insight:</strong> {theme.summary}</p>
              <p><strong>Next experiment:</strong> {theme.nextStep}</p>
              <ul>
                {theme.quotes.map((q) => <li key={q.id}><em>"{q.quote}"</em> — {q.interviewee}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <PremiumCapture source="interview-synthesis" />
    </div>
  );
}
