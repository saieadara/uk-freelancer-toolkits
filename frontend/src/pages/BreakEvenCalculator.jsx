import { useMemo, useState } from "react";
import { Scale } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { formatMoney } from "../utils/calculations";

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState(8000);
  const [pricePerUnit, setPricePerUnit] = useState(120);
  const [variableCost, setVariableCost] = useState(45);
  const [targetProfit, setTargetProfit] = useState(0);

  const result = useMemo(() => {
    const price = Number(pricePerUnit || 0);
    const variable = Number(variableCost || 0);
    const fixed = Number(fixedCosts || 0);
    const profit = Number(targetProfit || 0);
    const contribution = price - variable;
    const margin = price > 0 ? contribution / price : 0;
    const breakEvenUnits = contribution > 0 ? Math.ceil(fixed / contribution) : null;
    const breakEvenRevenue = breakEvenUnits !== null ? breakEvenUnits * price : null;
    const targetUnits = contribution > 0 ? Math.ceil((fixed + profit) / contribution) : null;
    const targetRevenue = targetUnits !== null ? targetUnits * price : null;
    return {
      contribution,
      margin,
      breakEvenUnits,
      breakEvenRevenue,
      targetUnits,
      targetRevenue,
    };
  }, [fixedCosts, pricePerUnit, variableCost, targetProfit]);

  return (
    <div className="page narrow-page" data-testid="breakeven-calculator-page">
      <section className="tool-intro" data-testid="breakeven-intro-section">
        <div>
          <p className="eyebrow"><Scale size={14} /> Pricing fundamentals</p>
          <h1>Break-Even Calculator</h1>
          <p>Find the unit and revenue volume needed to cover fixed costs, then add a target profit goal to see what hitting it really requires.</p>
        </div>
      </section>

      <section className="calculator-panel" data-testid="breakeven-inputs-panel">
        <div className="calculator-inputs">
          <label>Fixed costs per period (£)
            <input type="number" min="0" value={fixedCosts} onChange={(event) => setFixedCosts(event.target.value)} data-testid="breakeven-fixed-input" />
          </label>
          <label>Price per unit (£)
            <input type="number" min="0" value={pricePerUnit} onChange={(event) => setPricePerUnit(event.target.value)} data-testid="breakeven-price-input" />
          </label>
          <label>Variable cost per unit (£)
            <input type="number" min="0" value={variableCost} onChange={(event) => setVariableCost(event.target.value)} data-testid="breakeven-variable-input" />
          </label>
          <label>Target profit (£)
            <input type="number" min="0" value={targetProfit} onChange={(event) => setTargetProfit(event.target.value)} data-testid="breakeven-target-input" />
          </label>
        </div>

        <div className="result-grid" data-testid="breakeven-results">
          <div><span>Contribution / unit</span><strong>{formatMoney(result.contribution)}</strong></div>
          <div><span>Contribution margin</span><strong>{(result.margin * 100).toFixed(1)}%</strong></div>
          <div><span>Break-even units</span><strong>{result.breakEvenUnits ?? "Not reachable"}</strong></div>
          <div><span>Break-even revenue</span><strong>{result.breakEvenRevenue !== null ? formatMoney(result.breakEvenRevenue) : "—"}</strong></div>
          <div><span>Units for target profit</span><strong>{result.targetUnits ?? "Not reachable"}</strong></div>
          <div><span>Revenue for target profit</span><strong>{result.targetRevenue !== null ? formatMoney(result.targetRevenue) : "—"}</strong></div>
        </div>

        {result.contribution <= 0 && (
          <p className="form-message">Variable cost is at or above the unit price. The product cannot break even at this configuration — raise price or cut variable costs.</p>
        )}
      </section>

      <section className="seo-section" data-testid="breakeven-seo-section">
        <h2>How break-even works</h2>
        <p>Break-even units = fixed costs ÷ (price − variable cost). The contribution margin tells you what share of every sale flows toward overheads and profit, so increasing margin is the fastest way to drop your break-even point.</p>
      </section>

      <PremiumCapture source="breakeven-calculator" />
    </div>
  );
}
