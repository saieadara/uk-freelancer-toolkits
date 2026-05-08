import { useMemo } from "react";
import { Target, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultMarketSizing } from "../data/strategy";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";
import { formatMoney } from "../utils/calculations";

const calcTopDown = (s, mult) => {
  const tam = Number(s.topDownIndustryGbp || 0) * (Number(s.topDownAddressablePct || 0) / 100) * mult;
  const sam = tam * (Number(s.topDownServiceablePct || 0) / 100);
  const som = sam * (Number(s.topDownObtainablePct || 0) / 100);
  return { tam, sam, som };
};

const calcBottomUp = (s, mult) => {
  const addressable = Number(s.bottomUpCustomers || 0) * (Number(s.bottomUpAddressablePct || 0) / 100);
  const tam = addressable * Number(s.bottomUpArpuGbp || 0) * mult;
  const sam = tam * (Number(s.bottomUpServeRatePct || 0) / 100);
  const som = sam * (Number(s.bottomUpObtainPct || 0) / 100);
  return { tam, sam, som };
};

export default function MarketSizing() {
  const [state, setState] = useLocalStorage("strategy-market-sizing", defaultMarketSizing());
  const previewId = "market-sizing-preview";

  const update = (field, value) => setState({ ...state, [field]: typeof state[field] === "number" ? Number(value) : value });
  const updateSensitivity = (key, value) => setState({ ...state, sensitivity: { ...state.sensitivity, [key]: Number(value) } });

  const td = useMemo(() => ({
    low: calcTopDown(state, state.sensitivity.low),
    expected: calcTopDown(state, state.sensitivity.expected),
    high: calcTopDown(state, state.sensitivity.high),
  }), [state]);

  const bu = useMemo(() => ({
    low: calcBottomUp(state, state.sensitivity.low),
    expected: calcBottomUp(state, state.sensitivity.expected),
    high: calcBottomUp(state, state.sensitivity.high),
  }), [state]);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="market-sizing-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Target size={14} /> Strategy Consultant</p>
          <h1>Market Sizing — TAM / SAM / SOM</h1>
          <p>Side-by-side top-down (industry × addressable %) and bottom-up (customers × ARPU). Sensitivity sliders give a low / expected / high range.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(state.product || "market").replace(/\s+/g, "-")}-market-sizing.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Brief</h2>
        <div className="hiring-form-grid">
          <label>Product / surface<input value={state.product} onChange={(event) => update("product", event.target.value)} /></label>
          <label>Region<input value={state.region} onChange={(event) => update("region", event.target.value)} /></label>
          <label>Date<input type="date" value={state.date} onChange={(event) => update("date", event.target.value)} /></label>
        </div>

        <h3>Sensitivity multipliers</h3>
        <div className="hiring-form-grid sensitivity-grid">
          <label>Low<input type="number" step="0.05" value={state.sensitivity.low} onChange={(event) => updateSensitivity("low", event.target.value)} /></label>
          <label>Expected<input type="number" step="0.05" value={state.sensitivity.expected} onChange={(event) => updateSensitivity("expected", event.target.value)} /></label>
          <label>High<input type="number" step="0.05" value={state.sensitivity.high} onChange={(event) => updateSensitivity("high", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="market-sizing-side-panel">
        <div className="market-sizing-split">
          <div className="market-sizing-col" data-testid="td-col">
            <h3>Top-down (industry → segment)</h3>
            <div className="hiring-form-grid">
              <label>Industry size (£)<input type="number" value={state.topDownIndustryGbp} onChange={(event) => update("topDownIndustryGbp", event.target.value)} /></label>
              <label>Addressable %<input type="number" value={state.topDownAddressablePct} onChange={(event) => update("topDownAddressablePct", event.target.value)} /></label>
              <label>Serviceable %<input type="number" value={state.topDownServiceablePct} onChange={(event) => update("topDownServiceablePct", event.target.value)} /></label>
              <label>Obtainable %<input type="number" value={state.topDownObtainablePct} onChange={(event) => update("topDownObtainablePct", event.target.value)} /></label>
            </div>
            <div className="result-grid">
              <div><span>TAM (expected)</span><strong>{formatMoney(td.expected.tam)}</strong></div>
              <div><span>SAM (expected)</span><strong>{formatMoney(td.expected.sam)}</strong></div>
              <div><span>SOM (expected)</span><strong>{formatMoney(td.expected.som)}</strong></div>
            </div>
          </div>
          <div className="market-sizing-col" data-testid="bu-col">
            <h3>Bottom-up (customers × ARPU)</h3>
            <div className="hiring-form-grid">
              <label>Potential customers<input type="number" value={state.bottomUpCustomers} onChange={(event) => update("bottomUpCustomers", event.target.value)} /></label>
              <label>Addressable %<input type="number" value={state.bottomUpAddressablePct} onChange={(event) => update("bottomUpAddressablePct", event.target.value)} /></label>
              <label>ARPU (£)<input type="number" value={state.bottomUpArpuGbp} onChange={(event) => update("bottomUpArpuGbp", event.target.value)} /></label>
              <label>Serviceable %<input type="number" value={state.bottomUpServeRatePct} onChange={(event) => update("bottomUpServeRatePct", event.target.value)} /></label>
              <label>Obtainable %<input type="number" value={state.bottomUpObtainPct} onChange={(event) => update("bottomUpObtainPct", event.target.value)} /></label>
            </div>
            <div className="result-grid">
              <div><span>TAM (expected)</span><strong>{formatMoney(bu.expected.tam)}</strong></div>
              <div><span>SAM (expected)</span><strong>{formatMoney(bu.expected.sam)}</strong></div>
              <div><span>SOM (expected)</span><strong>{formatMoney(bu.expected.som)}</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Sensitivity range</h2>
        <table className="legal-cookie-table">
          <thead>
            <tr><th>Scenario</th><th>Top-down TAM</th><th>Top-down SAM</th><th>Top-down SOM</th><th>Bottom-up TAM</th><th>Bottom-up SAM</th><th>Bottom-up SOM</th></tr>
          </thead>
          <tbody>
            {[
              { id: "low", label: "Low" },
              { id: "expected", label: "Expected" },
              { id: "high", label: "High" },
            ].map((s) => (
              <tr key={s.id}>
                <td><strong>{s.label}</strong></td>
                <td>{formatMoney(td[s.id].tam)}</td>
                <td>{formatMoney(td[s.id].sam)}</td>
                <td>{formatMoney(td[s.id].som)}</td>
                <td>{formatMoney(bu[s.id].tam)}</td>
                <td>{formatMoney(bu[s.id].sam)}</td>
                <td>{formatMoney(bu[s.id].som)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="calculator-panel">
        <h2>Market sizing preview</h2>
        <div id={previewId} className="hiring-document" data-testid="market-sizing-preview">
          <header>
            <p className="eyebrow">Market Sizing</p>
            <h1>{state.product} · {state.region}</h1>
            <p>{state.date}</p>
          </header>
          <h3>Top-down (expected)</h3>
          <p>Industry {formatMoney(state.topDownIndustryGbp)} × addressable {state.topDownAddressablePct}% × serviceable {state.topDownServiceablePct}% × obtainable {state.topDownObtainablePct}% = SOM {formatMoney(td.expected.som)}.</p>

          <h3>Bottom-up (expected)</h3>
          <p>{state.bottomUpCustomers.toLocaleString()} potential customers × addressable {state.bottomUpAddressablePct}% × ARPU {formatMoney(state.bottomUpArpuGbp)} × serviceable {state.bottomUpServeRatePct}% × obtainable {state.bottomUpObtainPct}% = SOM {formatMoney(bu.expected.som)}.</p>

          <h3>Triangulated SOM range</h3>
          <p>Top-down: {formatMoney(td.low.som)} – {formatMoney(td.high.som)}.</p>
          <p>Bottom-up: {formatMoney(bu.low.som)} – {formatMoney(bu.high.som)}.</p>
        </div>
      </section>

      <PremiumCapture source="market-sizing" />
    </div>
  );
}
