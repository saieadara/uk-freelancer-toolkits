import { useMemo, useState } from "react";
import { Download, Copy, Plus, Trash2, ClipboardList } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultProductBrief, prdFields } from "../data/product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `prd-${Math.random().toString(36).slice(2, 8)}`;
const slugify = (value) => (value || "prds").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function PrdGenerator() {
  const [brief, setBrief] = useLocalStorage("product-prd-brief", defaultProductBrief());
  const [activeId, setActiveId] = useState(brief.prds[0]?.id);
  const [copyMessage, setCopyMessage] = useState("");
  const previewId = "prd-preview-document";

  const updateMeta = (field, value) => setBrief({ ...brief, [field]: value });

  const updatePrd = (id, field, value) => {
    setBrief({ ...brief, prds: brief.prds.map((prd) => (prd.id === id ? { ...prd, [field]: value } : prd)) });
  };

  const removePrd = (id) => {
    if (brief.prds.length <= 1) return;
    const next = brief.prds.filter((prd) => prd.id !== id);
    setBrief({ ...brief, prds: next });
    if (activeId === id) setActiveId(next[0]?.id);
  };

  const addPrd = () => {
    const id = newId();
    setBrief({
      ...brief,
      prds: [
        ...brief.prds,
        {
          id,
          name: "New feature",
          problem: "",
          user: "",
          scope: "",
          outOfScope: "",
          successMetric: "",
          risks: "",
          owner: brief.defaultOwner || "Bob",
        },
      ],
    });
    setActiveId(id);
  };

  const activePrd = useMemo(() => brief.prds.find((prd) => prd.id === activeId) || brief.prds[0], [brief.prds, activeId]);

  const buildOutlineText = () => {
    const lines = [
      `${brief.productName} — Product Requirements`,
      `Owner: ${brief.defaultOwner}  ·  Date: ${brief.date}`,
      "",
    ];
    brief.prds.forEach((prd, index) => {
      lines.push(`PRD ${String(index + 1).padStart(2, "0")} · ${prd.name}`);
      lines.push(`Owner: ${prd.owner || brief.defaultOwner}`);
      prdFields.forEach((field) => {
        lines.push(`${field.label}:`);
        lines.push((prd[field.id] || "").trim() || "—");
        lines.push("");
      });
      lines.push("");
    });
    return lines.join("\n");
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(buildOutlineText());
      setCopyMessage("All PRDs copied to clipboard.");
    } catch (_e) {
      setCopyMessage("Copy blocked by browser permissions.");
    }
    setTimeout(() => setCopyMessage(""), 2200);
  };

  return (
    <div className="page narrow-page" data-testid="prd-generator-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><ClipboardList size={14} /> Product Management</p>
          <h1>PRD Generator</h1>
          <p>One-page PRDs for every shortlisted feature. Each PRD captures the problem, the user, what's in and out of scope, the single success metric, and the risks. Pre-loaded with the current shortlist: PWA, Wizard, Comparator, Open Banking, OCR.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyAll} data-testid="prd-copy-button"><Copy size={17} /> Copy all PRDs</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${slugify(brief.productName)}-prds.pdf`)} data-testid="prd-pdf-button"><Download size={17} /> Download PDF</button>
        </div>
      </section>

      {copyMessage && <p className="form-message" data-testid="prd-copy-message">{copyMessage}</p>}

      <section className="calculator-panel" data-testid="prd-meta-panel">
        <h2>Brief details</h2>
        <div className="hiring-form-grid">
          <label>Product / surface
            <input value={brief.productName} onChange={(event) => updateMeta("productName", event.target.value)} data-testid="prd-product-input" />
          </label>
          <label>Default owner
            <input value={brief.defaultOwner} onChange={(event) => updateMeta("defaultOwner", event.target.value)} data-testid="prd-owner-input" />
          </label>
          <label>Date
            <input type="date" value={brief.date} onChange={(event) => updateMeta("date", event.target.value)} data-testid="prd-date-input" />
          </label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="prd-editor-panel">
        <div className="panel-heading">
          <h2>Shortlisted PRDs</h2>
          <button className="secondary-button" onClick={addPrd} data-testid="prd-add-button"><Plus size={16} /> Add PRD</button>
        </div>
        <div className="slide-tabs prd-tabs" data-testid="prd-tabs">
          {brief.prds.map((prd, index) => (
            <button
              key={prd.id}
              type="button"
              className={`slide-tab ${activeId === prd.id ? "active" : ""}`}
              onClick={() => setActiveId(prd.id)}
              data-testid={`prd-tab-${prd.id}`}
            >
              <span>PRD {String(index + 1).padStart(2, "0")}</span>
              <strong>{prd.name || "Untitled"}</strong>
            </button>
          ))}
        </div>

        {activePrd && (
          <div className="prd-editor" data-testid={`prd-editor-${activePrd.id}`}>
            <div className="hiring-form-grid">
              <label>Feature name
                <input value={activePrd.name} onChange={(event) => updatePrd(activePrd.id, "name", event.target.value)} data-testid={`prd-name-${activePrd.id}`} />
              </label>
              <label>Owner
                <input value={activePrd.owner} onChange={(event) => updatePrd(activePrd.id, "owner", event.target.value)} data-testid={`prd-owner-${activePrd.id}`} />
              </label>
              {prdFields.map((field) => (
                <label key={field.id} className="hiring-field-wide">
                  {field.label}
                  <textarea
                    rows={4}
                    value={activePrd[field.id] || ""}
                    onChange={(event) => updatePrd(activePrd.id, field.id, event.target.value)}
                    placeholder={field.placeholder}
                    data-testid={`prd-${field.id}-${activePrd.id}`}
                  />
                </label>
              ))}
            </div>
            <button className="text-button danger" onClick={() => removePrd(activePrd.id)} disabled={brief.prds.length === 1} data-testid={`prd-remove-${activePrd.id}`}>
              <Trash2 size={14} /> Remove this PRD
            </button>
          </div>
        )}
      </section>

      <section className="calculator-panel" data-testid="prd-preview-panel">
        <h2>PRD document preview</h2>
        <div id={previewId} className="hiring-document prd-document" data-testid="prd-preview-document">
          <header>
            <p className="eyebrow">Product Requirements</p>
            <h1>{brief.productName}</h1>
            <p>Owner: {brief.defaultOwner} · Date: {brief.date} · {brief.prds.length} PRD{brief.prds.length === 1 ? "" : "s"}</p>
          </header>

          {brief.prds.map((prd, index) => (
            <article key={prd.id} className="prd-block" data-testid={`prd-preview-${prd.id}`}>
              <h2>PRD {String(index + 1).padStart(2, "0")} — {prd.name}</h2>
              <p className="prd-owner-line">Owner: <strong>{prd.owner || brief.defaultOwner}</strong></p>
              {prdFields.map((field) => (
                <div key={field.id} className="prd-field">
                  <h3>{field.label}</h3>
                  <p>{(prd[field.id] || "").trim() || "—"}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      <PremiumCapture source="prd-generator" />
    </div>
  );
}
