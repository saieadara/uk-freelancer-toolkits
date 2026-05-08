import { useMemo, useState } from "react";
import { Plus, Trash2, Download, Copy, FileText } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";
import { exportBcgPptx } from "../utils/pptx";

const newId = () => `bu-${Math.random().toString(36).slice(2, 8)}`;

const defaultBcg = () => ({
  productName: "Northstar Studio",
  date: new Date().toISOString().slice(0, 10),
  growthThreshold: 10,
  shareThreshold: 1,
  bus: [
    { id: newId(), name: "VAT Invoice generator", growth: 18, share: 1.6, revenue: 320000, note: "Flagship — invest" },
    { id: newId(), name: "Tax Estimator", growth: 14, share: 0.6, revenue: 90000, note: "Build or partner" },
    { id: newId(), name: "Templates page", growth: 6, share: 1.4, revenue: 210000, note: "Profitable cash cow" },
    { id: newId(), name: "Receipt OCR (alpha)", growth: 22, share: 0.3, revenue: 18000, note: "Early bet" },
    { id: newId(), name: "Legacy desktop tool", growth: 2, share: 0.4, revenue: 12000, note: "Wind down" },
  ],
});

// quadrant key uses canonical BCG slugs
const quadrantOf = (bu, growthT, shareT) => {
  const high = Number(bu.growth) >= Number(growthT);
  const big = Number(bu.share) >= Number(shareT);
  if (high && big) return "stars";
  if (!high && big) return "cows";
  if (high && !big) return "question";
  return "dogs";
};

const quadrantGuide = {
  stars: {
    label: "Stars",
    criteria: "High growth · High share",
    action: "Invest",
    short: "Invest",
    description: "Leaders in expanding markets. Invest heavily to maintain dominance and generate future cash.",
  },
  question: {
    label: "Question marks",
    criteria: "High growth · Low share",
    action: "Build or divest",
    short: "Build or divest",
    description: "Risky opportunities. Selectively invest if they can gain share and become stars, otherwise divest.",
  },
  cows: {
    label: "Cash cows",
    criteria: "Low growth · High share",
    action: "Milk",
    short: "Milk",
    description: "Mature, profitable units. Milk for surplus cash to fund stars and selected question marks.",
  },
  dogs: {
    label: "Dogs",
    criteria: "Low growth · Low share",
    action: "Divest",
    short: "Divest",
    description: "Weak performers. Divest, liquidate, or reposition to avoid resource drain.",
  },
};

const GROWTH_MAX = 30;
const SHARE_MAX = 4;

const positionFor = (bu) => {
  const growth = Math.min(Math.max(Number(bu.growth || 0), 0), GROWTH_MAX);
  const share = Math.min(Math.max(Number(bu.share || 0), 0), SHARE_MAX);
  const yPct = 100 - (growth / GROWTH_MAX) * 100;
  const xPct = 100 - (share / SHARE_MAX) * 100; // high share on the LEFT (BCG convention)
  return { x: xPct, y: yPct };
};

const sizeFor = (bu, maxRevenue) => {
  const r = Number(bu.revenue || 0);
  if (maxRevenue <= 0) return 36;
  const norm = Math.sqrt(r / maxRevenue);
  return Math.max(28, Math.min(64, 28 + norm * 36));
};

export default function BcgMatrix() {
  const [matrix, setMatrix] = useLocalStorage("strategy-bcg", defaultBcg());
  const [selectedId, setSelectedId] = useState(matrix.bus[0]?.id || null);
  const previewId = "bcg-preview";

  const update = (field, value) => setMatrix({ ...matrix, [field]: value });
  const updateBu = (id, field, value) => setMatrix({ ...matrix, bus: matrix.bus.map((b) => (b.id === id ? { ...b, [field]: ["growth", "share", "revenue"].includes(field) ? Number(value) : value } : b)) });
  const removeBu = (id) => setMatrix({ ...matrix, bus: matrix.bus.filter((b) => b.id !== id) });
  const addBu = () => {
    const id = newId();
    setMatrix({ ...matrix, bus: [...matrix.bus, { id, name: "New BU", growth: 5, share: 0.5, revenue: 50000, note: "" }] });
    setSelectedId(id);
  };

  const placed = useMemo(() => matrix.bus.map((b) => ({ ...b, quadrant: quadrantOf(b, matrix.growthThreshold, matrix.shareThreshold) })), [matrix]);
  const maxRevenue = useMemo(() => Math.max(0, ...placed.map((b) => Number(b.revenue || 0))), [placed]);
  const selectedBu = useMemo(() => placed.find((b) => b.id === selectedId), [placed, selectedId]);

  const copyDoc = async () => {
    try { await navigator.clipboard.writeText(document.getElementById(previewId)?.innerText || ""); } catch (_e) {}
  };

  return (
    <div className="m-page" id={previewId} data-testid="bcg-page">
      <header className="m-head">
        <div className="m-head-left">
          <p className="m-eyebrow">BCG Growth-Share Matrix · portfolio tool</p>
          <input className="m-title" value={matrix.productName} onChange={(e) => update("productName", e.target.value)} placeholder="Untitled portfolio" />
          <div className="m-fields">
            <label className="m-field"><span className="m-field-label">Date</span><input type="date" value={matrix.date} onChange={(e) => update("date", e.target.value)} /></label>
            <label className="m-field"><span className="m-field-label">Growth threshold %</span><input type="number" value={matrix.growthThreshold} onChange={(e) => update("growthThreshold", Number(e.target.value))} /></label>
            <label className="m-field"><span className="m-field-label">Share threshold ×</span><input type="number" step="0.1" value={matrix.shareThreshold} onChange={(e) => update("shareThreshold", Number(e.target.value))} /></label>
          </div>
        </div>
        <div className="m-actions">
          <button className="m-button" onClick={copyDoc}><Copy size={14} /> Copy</button>
          <button className="m-button" onClick={() => exportBcgPptx(matrix)}><FileText size={14} /> PPT</button>
          <button className="m-button m-button-primary" onClick={() => downloadElementAsPdf(previewId, `${(matrix.productName || "bcg").replace(/\s+/g, "-")}.pdf`)}><Download size={14} /> PDF</button>
        </div>
      </header>

      <section className="m-bcg-about" data-testid="bcg-about">
        <div className="m-bcg-about-cell">
          <h4>Y-axis · market growth rate</h4>
          <p>Industry attractiveness. Above {matrix.growthThreshold}% is considered high growth.</p>
        </div>
        <div className="m-bcg-about-cell">
          <h4>X-axis · relative market share</h4>
          <p>Competitiveness vs largest rival. Above {matrix.shareThreshold}× is a dominant position.</p>
        </div>
        <div className="m-bcg-about-cell">
          <h4>Strategic use</h4>
          <p>Balance the portfolio — cash from cows funds stars and selective question marks.</p>
        </div>
        <div className="m-bcg-about-cell">
          <h4>Limitation</h4>
          <p>Oversimplifies synergies, brand spillover, and external risks. Use as a lens, not a verdict.</p>
        </div>
      </section>

      <div className="m-bcg" data-testid="bcg-board">
        <div className="m-bcg-plot">
          <div className="m-bcg-axis-title">Market growth</div>
          <div className="m-bcg-axis-y">
            <span>{GROWTH_MAX}%</span>
            <span>0</span>
          </div>
          <div className="m-bcg-grid">
            <div className="m-bcg-quad">
              <span className="m-bcg-quad-label">{quadrantGuide.stars.label}</span>
              <span className="m-bcg-quad-action">{quadrantGuide.stars.short}</span>
            </div>
            <div className="m-bcg-quad">
              <span className="m-bcg-quad-label">{quadrantGuide.question.label}</span>
              <span className="m-bcg-quad-action">{quadrantGuide.question.short}</span>
            </div>
            <div className="m-bcg-quad">
              <span className="m-bcg-quad-label">{quadrantGuide.cows.label}</span>
              <span className="m-bcg-quad-action">{quadrantGuide.cows.short}</span>
            </div>
            <div className="m-bcg-quad">
              <span className="m-bcg-quad-label">{quadrantGuide.dogs.label}</span>
              <span className="m-bcg-quad-action">{quadrantGuide.dogs.short}</span>
            </div>
            {placed.map((bu) => {
              const { x, y } = positionFor(bu);
              const size = sizeFor(bu, maxRevenue);
              return (
                <button
                  key={bu.id}
                  type="button"
                  className={`m-bcg-bubble ${selectedId === bu.id ? "selected" : ""}`}
                  style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
                  onClick={() => setSelectedId(bu.id)}
                  title={`${bu.name} · growth ${bu.growth}% · share ${bu.share}× · £${Number(bu.revenue || 0).toLocaleString()} · ${quadrantGuide[bu.quadrant].label}`}
                  data-testid={`bcg-bubble-${bu.id}`}
                >
                  {bu.name.slice(0, 2).toUpperCase()}
                </button>
              );
            })}
          </div>
          <div className="m-bcg-axis-x">
            <span>High share</span>
            <span>Low share</span>
          </div>
        </div>

        <aside className="m-bcg-side">
          <div className="m-bcg-side-head">
            <h3>Business units · {matrix.bus.length}</h3>
            <button className="m-button m-button-ghost" onClick={addBu} data-testid="bcg-add-bu"><Plus size={14} /> Add</button>
          </div>
          {placed.map((bu) => (
            <div
              key={bu.id}
              className={`m-bcg-bu ${selectedId === bu.id ? "selected" : ""}`}
              onClick={() => setSelectedId(bu.id)}
              data-testid={`bcg-card-${bu.id}`}
            >
              <div className="m-bcg-bu-head">
                <input className="m-bcg-bu-name" value={bu.name} onChange={(e) => updateBu(bu.id, "name", e.target.value)} onClick={(e) => e.stopPropagation()} />
                <span className="m-bcg-bu-quad">{quadrantGuide[bu.quadrant].label}</span>
              </div>
              <div className="m-bcg-bu-row" onClick={(e) => e.stopPropagation()}>
                <label>Growth %<input type="number" value={bu.growth} onChange={(e) => updateBu(bu.id, "growth", e.target.value)} /></label>
                <label>Share ×<input type="number" step="0.1" value={bu.share} onChange={(e) => updateBu(bu.id, "share", e.target.value)} /></label>
                <label>Rev £<input type="number" value={bu.revenue} onChange={(e) => updateBu(bu.id, "revenue", e.target.value)} /></label>
              </div>
              <textarea className="m-textarea" value={bu.note} onChange={(e) => updateBu(bu.id, "note", e.target.value)} onClick={(e) => e.stopPropagation()} placeholder={`Recommended: ${quadrantGuide[bu.quadrant].action}`} rows={2} />
              <button className="m-button m-button-ghost" onClick={(e) => { e.stopPropagation(); removeBu(bu.id); }} style={{ justifySelf: "end" }}><Trash2 size={12} /> Remove</button>
            </div>
          ))}
        </aside>
      </div>

      <section className="m-bcg-guide" data-testid="bcg-guide">
        {["stars", "question", "cows", "dogs"].map((id) => {
          const guide = quadrantGuide[id];
          const isActive = selectedBu?.quadrant === id;
          return (
            <div key={id} className={`m-bcg-guide-card ${isActive ? "active" : ""}`} data-testid={`bcg-guide-${id}`}>
              <div className="m-bcg-guide-head">
                <span className="m-bcg-guide-name">{guide.label}</span>
                <span className="m-bcg-guide-action">{guide.action}</span>
              </div>
              <span className="m-bcg-guide-criteria">{guide.criteria}</span>
              <p className="m-bcg-guide-desc">{guide.description}</p>
            </div>
          );
        })}
      </section>

      <p className="m-bcg-footnote" data-testid="bcg-footnote">
        Developed by the Boston Consulting Group in the 1970s for portfolio prioritisation. Sources:
        {" "}<a href="https://www.bcg.com/about/overview/our-history/growth-share-matrix" target="_blank" rel="noreferrer">BCG</a>,
        {" "}<a href="https://www.bcg.com/publications/2014/growth-share-matrix-bcg-classics-revisited" target="_blank" rel="noreferrer">BCG Classics Revisited</a>,
        {" "}<a href="https://corporatefinanceinstitute.com/resources/management/boston-consulting-group-bcg-matrix/" target="_blank" rel="noreferrer">CFI</a>,
        {" "}<a href="https://safetyculture.com/topics/bcg-matrix" target="_blank" rel="noreferrer">SafetyCulture</a>,
        {" "}<a href="https://en.wikipedia.org/wiki/Growth%E2%80%93share_matrix" target="_blank" rel="noreferrer">Wikipedia</a>.
      </p>

      <PremiumCapture source="bcg-matrix" />
    </div>
  );
}
