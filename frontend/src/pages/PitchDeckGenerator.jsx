import { useMemo, useState } from "react";
import { Download, Copy, Presentation } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { pitchDeckSlides, defaultPitchDeck } from "../data/pitchDeck";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

export default function PitchDeckGenerator() {
  const [deck, setDeck] = useLocalStorage("startup-pitch-deck", defaultPitchDeck());
  const [activeSlide, setActiveSlide] = useState(pitchDeckSlides[0].id);
  const [copyMessage, setCopyMessage] = useState("");
  const previewId = "pitch-deck-pdf-preview";

  const updateMeta = (field, value) => setDeck({ ...deck, [field]: value });
  const updateSlide = (id, value) => setDeck({ ...deck, slides: { ...deck.slides, [id]: value } });

  const activeSlideMeta = useMemo(() => pitchDeckSlides.find((slide) => slide.id === activeSlide) || pitchDeckSlides[0], [activeSlide]);

  const copyOutline = async () => {
    const lines = [
      `${deck.company} — Pitch Deck Outline`,
      deck.tagline,
      `Founder: ${deck.founder}  ·  ${deck.deckDate}`,
      "",
      ...pitchDeckSlides.map((slide) => {
        const content = (deck.slides[slide.id] || slide.placeholder || "").trim();
        return `Slide ${slide.number} · ${slide.label}\n${content}\n`;
      }),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(lines);
      setCopyMessage("Outline copied to clipboard.");
    } catch (_error) {
      setCopyMessage("Copy blocked by browser permissions.");
    }
    setTimeout(() => setCopyMessage(""), 2200);
  };

  return (
    <div className="page narrow-page" data-testid="pitch-deck-page">
      <section className="tool-intro" data-testid="pitch-deck-intro-section">
        <div>
          <p className="eyebrow"><Presentation size={14} /> Investor pitch</p>
          <h1>Pitch Deck Outline Generator</h1>
          <p>Fill in a 10-slide skeleton — problem, solution, market, traction, ask. Export the outline as a PDF or copy it as text to drop into Keynote, Google Slides, or PowerPoint.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyOutline} data-testid="pitch-deck-copy-button"><Copy size={17} /> Copy outline</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(deck.company || "pitch-deck").replace(/\s+/g, "-")}-pitch-deck.pdf`)} data-testid="pitch-deck-pdf-button"><Download size={17} /> Download PDF</button>
        </div>
      </section>

      {copyMessage && <p className="form-message" data-testid="pitch-deck-copy-message">{copyMessage}</p>}

      <section className="calculator-panel" data-testid="pitch-deck-meta-panel">
        <h2>Deck details</h2>
        <div className="calculator-inputs">
          <label>Company
            <input value={deck.company} onChange={(event) => updateMeta("company", event.target.value)} data-testid="pitch-deck-company-input" />
          </label>
          <label>Founder
            <input value={deck.founder} onChange={(event) => updateMeta("founder", event.target.value)} data-testid="pitch-deck-founder-input" />
          </label>
          <label>Tagline
            <input value={deck.tagline} onChange={(event) => updateMeta("tagline", event.target.value)} data-testid="pitch-deck-tagline-input" />
          </label>
          <label>Date
            <input type="date" value={deck.deckDate} onChange={(event) => updateMeta("deckDate", event.target.value)} data-testid="pitch-deck-date-input" />
          </label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="pitch-deck-editor-panel">
        <h2>Slides</h2>
        <div className="slide-tabs" data-testid="pitch-deck-slide-tabs">
          {pitchDeckSlides.map((slide) => (
            <button key={slide.id} type="button" className={`slide-tab ${activeSlide === slide.id ? "active" : ""}`} onClick={() => setActiveSlide(slide.id)} data-testid={`pitch-deck-tab-${slide.id}`}>
              <span>{String(slide.number).padStart(2, "0")}</span>
              <strong>{slide.label}</strong>
            </button>
          ))}
        </div>
        <div className="slide-editor" data-testid="pitch-deck-active-editor">
          <p className="form-message"><strong>{activeSlideMeta.label}.</strong> {activeSlideMeta.prompt}</p>
          <textarea
            rows={6}
            value={deck.slides[activeSlideMeta.id] || ""}
            onChange={(event) => updateSlide(activeSlideMeta.id, event.target.value)}
            placeholder={activeSlideMeta.placeholder}
            data-testid={`pitch-deck-textarea-${activeSlideMeta.id}`}
          />
        </div>
      </section>

      <section className="calculator-panel" data-testid="pitch-deck-preview-section">
        <h2>Outline preview</h2>
        <div id={previewId} className="pitch-deck-preview" data-testid="pitch-deck-preview-document">
          <header className="pitch-deck-cover">
            <p className="eyebrow">Pitch deck outline</p>
            <h1>{deck.company || "Company name"}</h1>
            <p className="pitch-deck-tagline">{deck.tagline}</p>
            <p className="pitch-deck-meta">{deck.founder} · {deck.deckDate}</p>
          </header>
          <ol className="pitch-deck-slides">
            {pitchDeckSlides.map((slide) => {
              const content = (deck.slides[slide.id] || "").trim() || slide.placeholder;
              return (
                <li key={slide.id} className="pitch-deck-slide" data-testid={`pitch-deck-preview-${slide.id}`}>
                  <div className="slide-number">{String(slide.number).padStart(2, "0")}</div>
                  <div className="slide-body">
                    <h3>{slide.label}</h3>
                    <p className="slide-prompt">{slide.prompt}</p>
                    <p className="slide-content">{content}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <PremiumCapture source="pitch-deck-generator" />
    </div>
  );
}
