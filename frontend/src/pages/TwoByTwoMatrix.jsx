import { Plus, Trash2, Crosshair, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultTwoByTwo } from "../data/strategy";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `itm-${Math.random().toString(36).slice(2, 8)}`;

const cellId = (x, y) => `${x >= 5 ? "high" : "low"}-${y >= 5 ? "high" : "low"}`;

export default function TwoByTwoMatrix() {
  const [state, setState] = useLocalStorage("strategy-two-by-two", defaultTwoByTwo());
  const previewId = "two-by-two-preview";

  const update = (field, value) => setState({ ...state, [field]: value });
  const updateQuadrantLabel = (id, label) => setState({ ...state, quadrants: { ...state.quadrants, [id]: { label } } });
  const updateItem = (id, field, value) => setState({ ...state, items: state.items.map((it) => (it.id === id ? { ...it, [field]: field === "label" ? value : Math.max(0, Math.min(10, Number(value))) } : it)) });
  const removeItem = (id) => setState({ ...state, items: state.items.filter((it) => it.id !== id) });
  const addItem = () => setState({ ...state, items: [...state.items, { id: newId(), label: "New item", x: 5, y: 5 }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  const groupItems = (xZone, yZone) => state.items.filter((it) => (it.x >= 5 ? "high" : "low") === xZone && (it.y >= 5 ? "high" : "low") === yZone);

  return (
    <div className="page narrow-page" data-testid="two-by-two-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Crosshair size={14} /> Strategy Consultant</p>
          <h1>2×2 Prioritisation Matrix</h1>
          <p>The consulting workhorse. Customise the axes, add items, and the dots place themselves. Quadrant labels rename live.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(state.title || "matrix").replace(/\s+/g, "-")}-2x2.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Axes & quadrants</h2>
        <div className="hiring-form-grid">
          <label>Title<input value={state.title} onChange={(event) => update("title", event.target.value)} /></label>
          <label>X axis label<input value={state.xAxisLabel} onChange={(event) => update("xAxisLabel", event.target.value)} /></label>
          <label>Y axis label<input value={state.yAxisLabel} onChange={(event) => update("yAxisLabel", event.target.value)} /></label>
          <label>X low<input value={state.xLow} onChange={(event) => update("xLow", event.target.value)} /></label>
          <label>X high<input value={state.xHigh} onChange={(event) => update("xHigh", event.target.value)} /></label>
          <label>Y low<input value={state.yLow} onChange={(event) => update("yLow", event.target.value)} /></label>
          <label>Y high<input value={state.yHigh} onChange={(event) => update("yHigh", event.target.value)} /></label>
        </div>
        <div className="hiring-form-grid">
          {Object.entries(state.quadrants).map(([id, q]) => (
            <label key={id}>{id}<input value={q.label} onChange={(event) => updateQuadrantLabel(id, event.target.value)} /></label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <div className="panel-heading">
          <h2>Items (X = 0–10, Y = 0–10)</h2>
          <button className="secondary-button" onClick={addItem}><Plus size={16} /> Add item</button>
        </div>
        <div className="line-items">
          {state.items.map((item) => (
            <div key={item.id} className="line-item-row twobytwo-item-row">
              <input value={item.label} onChange={(event) => updateItem(item.id, "label", event.target.value)} placeholder="Label" />
              <input type="number" min="0" max="10" value={item.x} onChange={(event) => updateItem(item.id, "x", event.target.value)} placeholder="X" />
              <input type="number" min="0" max="10" value={item.y} onChange={(event) => updateItem(item.id, "y", event.target.value)} placeholder="Y" />
              <button className="icon-button" onClick={() => removeItem(item.id)} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel" data-testid="two-by-two-plot-panel">
        <h2>Live plot</h2>
        <div className="twobytwo-plot" data-testid="twobytwo-plot">
          <span className="axis-label axis-y-high">{state.yHigh}</span>
          <span className="axis-label axis-y-low">{state.yLow}</span>
          <span className="axis-label axis-x-low">{state.xLow}</span>
          <span className="axis-label axis-x-high">{state.xHigh}</span>
          <span className="axis-title axis-y">{state.yAxisLabel} →</span>
          <span className="axis-title axis-x">{state.xAxisLabel} →</span>

          <div className="twobytwo-quadrant top-left">{state.quadrants["low-high"]?.label}</div>
          <div className="twobytwo-quadrant top-right">{state.quadrants["high-high"]?.label}</div>
          <div className="twobytwo-quadrant bottom-left">{state.quadrants["low-low"]?.label}</div>
          <div className="twobytwo-quadrant bottom-right">{state.quadrants["high-low"]?.label}</div>

          {state.items.map((item) => {
            const left = (item.x / 10) * 100;
            const bottom = (item.y / 10) * 100;
            return (
              <div key={item.id} className="twobytwo-dot" style={{ left: `${left}%`, bottom: `${bottom}%` }} data-testid={`dot-${item.id}`}>
                <span className="dot" />
                <span className="dot-label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Document preview</h2>
        <div id={previewId} className="hiring-document" data-testid="two-by-two-preview">
          <header>
            <p className="eyebrow">2×2 Prioritisation</p>
            <h1>{state.title}</h1>
            <p>{state.xAxisLabel} (X) × {state.yAxisLabel} (Y)</p>
          </header>
          <table className="legal-cookie-table">
            <thead><tr><th>Quadrant</th><th>Items</th></tr></thead>
            <tbody>
              {[
                { id: "high-high", label: state.quadrants["high-high"]?.label, items: groupItems("high", "high") },
                { id: "low-high", label: state.quadrants["low-high"]?.label, items: groupItems("low", "high") },
                { id: "high-low", label: state.quadrants["high-low"]?.label, items: groupItems("high", "low") },
                { id: "low-low", label: state.quadrants["low-low"]?.label, items: groupItems("low", "low") },
              ].map((g) => (
                <tr key={g.id}>
                  <td><strong>{g.label}</strong></td>
                  <td>{g.items.length === 0 ? "—" : g.items.map((it) => `${it.label} (X${it.x}/Y${it.y})`).join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PremiumCapture source="two-by-two" />
    </div>
  );
}
