import { useMemo, useState } from "react";
import { Plus, Trash2, RotateCcw, Download, Copy, Link2 } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultRetro } from "../data/product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `card-${Math.random().toString(36).slice(2, 8)}`;

const columns = [
  { id: "wentWell", label: "Went well", description: "What worked. Keep doing this." },
  { id: "didNot", label: "Didn't go well", description: "Friction, slips, surprises." },
  { id: "tryNext", label: "Try next sprint", description: "Concrete experiments for the next two weeks." },
];

export default function SprintRetro() {
  const [retro, setRetro] = useLocalStorage("product-sprint-retro", defaultRetro());
  const [linkMessage, setLinkMessage] = useState("");
  const previewId = "sprint-retro-preview";

  const update = (field, value) => setRetro({ ...retro, [field]: value });

  const updateCard = (col, id, field, value) => {
    setRetro({
      ...retro,
      cards: { ...retro.cards, [col]: retro.cards[col].map((card) => (card.id === id ? { ...card, [field]: value } : card)) },
    });
  };
  const removeCard = (col, id) => {
    setRetro({
      ...retro,
      cards: { ...retro.cards, [col]: retro.cards[col].filter((card) => card.id !== id) },
    });
  };
  const addCard = (col) => {
    setRetro({
      ...retro,
      cards: { ...retro.cards, [col]: [...retro.cards[col], { id: newId(), text: "", author: "" }] },
    });
  };

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const base = `${window.location.origin}/product/retro`;
    return `${base}#share=${retro.shareSlug}&anon=${retro.anonymousByDefault ? 1 : 0}`;
  }, [retro.shareSlug, retro.anonymousByDefault]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkMessage("Anonymised input link copied.");
    } catch (_e) {
      setLinkMessage("Copy blocked — select the link manually.");
    }
    setTimeout(() => setLinkMessage(""), 2200);
  };

  const regenerateSlug = () => update("shareSlug", Math.random().toString(36).slice(2, 10));

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="sprint-retro-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><RotateCcw size={14} /> Product Management</p>
          <h1>Sprint Retro Template</h1>
          <p>Run a 30-minute retro on one screen. Use the share link to gather anonymised input from the team before the meeting, then refine live.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(retro.sprintLabel || "retro").replace(/\s+/g, "-")}-retro.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Sprint details</h2>
        <div className="hiring-form-grid">
          <label>Sprint label<input value={retro.sprintLabel} onChange={(event) => update("sprintLabel", event.target.value)} data-testid="retro-sprint-input" /></label>
          <label>Dates<input value={retro.sprintDates} onChange={(event) => update("sprintDates", event.target.value)} /></label>
          <label>Facilitator<input value={retro.facilitator} onChange={(event) => update("facilitator", event.target.value)} /></label>
          <label className="checkbox-row hiring-field-wide">
            <input type="checkbox" checked={!!retro.anonymousByDefault} onChange={(event) => update("anonymousByDefault", event.target.checked)} />
            <span>Hide author names by default in shared input</span>
          </label>
        </div>

        <div className="result-grid retro-summary">
          <div><span>Went well</span><strong>{retro.cards.wentWell.length}</strong></div>
          <div><span>Didn't</span><strong>{retro.cards.didNot.length}</strong></div>
          <div><span>Try next</span><strong>{retro.cards.tryNext.length}</strong></div>
        </div>

        <div className="retro-share">
          <div>
            <p className="form-message"><strong>Anonymised input link.</strong> Send this to the team before the meeting. Their entries persist in their own browser only — bring quotes to the meeting and capture them in this screen.</p>
            <code className="retro-share-url" data-testid="retro-share-url">{shareUrl}</code>
          </div>
          <div className="retro-share-actions">
            <button className="secondary-button" onClick={copyShareLink} data-testid="retro-copy-link"><Link2 size={16} /> Copy link</button>
            <button className="text-button" onClick={regenerateSlug}>Regenerate</button>
          </div>
        </div>
        {linkMessage && <p className="form-message">{linkMessage}</p>}
      </section>

      <section className="calculator-panel" data-testid="retro-board-panel">
        <h2>Retro board</h2>
        <div className="retro-board" data-testid="retro-board">
          {columns.map((col) => (
            <div key={col.id} className={`retro-column retro-column-${col.id}`} data-testid={`retro-column-${col.id}`}>
              <div className="retro-column-head">
                <h3>{col.label}</h3>
                <button className="icon-button" onClick={() => addCard(col.id)} aria-label={`Add to ${col.label}`}><Plus size={14} /></button>
              </div>
              <p className="form-message">{col.description}</p>
              <div className="retro-cards">
                {retro.cards[col.id].map((card) => (
                  <div key={card.id} className="retro-card">
                    <textarea rows={2} value={card.text} onChange={(event) => updateCard(col.id, card.id, "text", event.target.value)} placeholder="Add a thought…" />
                    <div className="retro-card-foot">
                      <input className="retro-author" placeholder={retro.anonymousByDefault ? "Anonymous" : "Author (optional)"} value={card.author} onChange={(event) => updateCard(col.id, card.id, "author", event.target.value)} />
                      <button className="icon-button" onClick={() => removeCard(col.id, card.id)} aria-label="Remove"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
                {retro.cards[col.id].length === 0 && <p className="form-message">Empty. Add the first card.</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Retro summary preview</h2>
        <div id={previewId} className="hiring-document" data-testid="retro-preview">
          <header>
            <p className="eyebrow">Retro · {retro.sprintLabel}</p>
            <h1>{retro.sprintLabel} — Retro</h1>
            <p>{retro.sprintDates} · facilitator: {retro.facilitator}</p>
          </header>
          {columns.map((col) => (
            <div key={col.id}>
              <h3>{col.label}</h3>
              <ul>
                {retro.cards[col.id].map((card) => (
                  <li key={card.id}>{card.text}{!retro.anonymousByDefault && card.author ? ` — ${card.author}` : ""}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <PremiumCapture source="sprint-retro" />
    </div>
  );
}
