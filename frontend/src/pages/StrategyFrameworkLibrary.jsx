import { useMemo, useState } from "react";
import { Search, Library, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { frameworks, frameworkCategories, getFrameworksByCategory } from "../data/strategyLibrary";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const slugify = (value) => (value || "framework").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function StrategyFrameworkLibrary() {
  const grouped = useMemo(() => getFrameworksByCategory(), []);
  const [activeId, setActiveId] = useState(frameworks[0].id);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [notes, setNotes] = useLocalStorage("strategy-library-notes", {});
  const previewId = "framework-library-preview";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return frameworks.filter((f) => {
      if (activeCategory !== "all" && f.category !== activeCategory) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.useCase.toLowerCase().includes(q) ||
        f.whenToUse.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory]);

  const active = useMemo(() => frameworks.find((f) => f.id === activeId) || frameworks[0], [activeId]);
  const activeNotes = notes[active.id] || {};

  const updateNote = (inputId, value) => {
    setNotes({ ...notes, [active.id]: { ...activeNotes, [inputId]: value } });
  };

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="strategy-library-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Library size={14} /> Strategy Consultant</p>
          <h1>Strategy Framework Library</h1>
          <p>One searchable index of {frameworks.length}+ canonical strategy frameworks — portfolio, competitive, growth, innovation, ops, people, transformation, finance, ESG. Pick a framework, fill the structured prompts, export the populated 1-pager.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${slugify(active.name)}-1-pager.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel" data-testid="library-search-panel">
        <div className="library-search-row">
          <label className="library-search-input">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${frameworks.length} frameworks…`} data-testid="library-search-input" />
          </label>
          <select className="library-category-select" value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)} data-testid="library-category-select">
            <option value="all">All categories ({frameworks.length})</option>
            {frameworkCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.label} ({(grouped[c.id] || []).length})</option>
            ))}
          </select>
        </div>
        <p className="form-message">{filtered.length} framework{filtered.length === 1 ? "" : "s"} match your filter.</p>
      </section>

      <section className="library-layout" data-testid="library-layout-panel">
        <aside className="library-sidebar" data-testid="library-sidebar">
          {filtered.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`library-item ${activeId === f.id ? "active" : ""}`}
              onClick={() => setActiveId(f.id)}
              data-testid={`library-item-${f.id}`}
            >
              <strong>{f.name}</strong>
              <span>{f.useCase}</span>
            </button>
          ))}
          {filtered.length === 0 && <p className="form-message">No matches. Try another keyword.</p>}
        </aside>

        <div className="library-active" data-testid="library-active-panel">
          <header className="library-active-head">
            <p className="eyebrow">{frameworkCategories.find((c) => c.id === active.category)?.label}</p>
            <h2>{active.name}</h2>
            <p className="form-message"><strong>Use case:</strong> {active.useCase}</p>
            <p className="form-message"><strong>When to use:</strong> {active.whenToUse}</p>
          </header>

          <div className="library-inputs">
            {active.inputs.map((input) => (
              <label key={input.id} className="library-input">
                <span className="library-input-label">{input.label}</span>
                {input.prompt && <span className="library-input-prompt">{input.prompt}</span>}
                <textarea
                  rows={3}
                  value={activeNotes[input.id] || ""}
                  onChange={(event) => updateNote(input.id, event.target.value)}
                  placeholder={input.prompt}
                  data-testid={`library-input-${active.id}-${input.id}`}
                />
              </label>
            ))}
          </div>

          <p className="form-message"><strong>Output:</strong> {active.output}</p>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>1-pager preview</h2>
        <div id={previewId} className="hiring-document framework-document" data-testid="library-preview">
          <header>
            <p className="eyebrow">{frameworkCategories.find((c) => c.id === active.category)?.label}</p>
            <h1>{active.name}</h1>
            <p>{active.useCase}</p>
          </header>

          <h3>When to use</h3>
          <p>{active.whenToUse}</p>

          <h3>Inputs</h3>
          {active.inputs.map((input) => (
            <div key={input.id} className="framework-field">
              <h4>{input.label}</h4>
              <p>{(activeNotes[input.id] || "").trim() || "—"}</p>
            </div>
          ))}

          <h3>Output</h3>
          <p>{active.output}</p>
        </div>
      </section>

      <PremiumCapture source="strategy-framework-library" />
    </div>
  );
}
