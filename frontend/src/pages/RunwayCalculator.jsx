import { useMemo, useState } from "react";
import { TrendingDown } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { formatMoney } from "../utils/calculations";

export default function RunwayCalculator() {
  const [cashOnHand, setCashOnHand] = useState(120000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(8000);
  const [monthlyCosts, setMonthlyCosts] = useState(22000);
  const [revenueGrowth, setRevenueGrowth] = useState(8);
  const [costGrowth, setCostGrowth] = useState(2);

  const projection = useMemo(() => {
    const months = [];
    let balance = Number(cashOnHand || 0);
    let revenue = Number(monthlyRevenue || 0);
    let costs = Number(monthlyCosts || 0);
    const revenueRate = Number(revenueGrowth || 0) / 100;
    const costsRate = Number(costGrowth || 0) / 100;
    let zeroMonth = null;
    for (let month = 1; month <= 36; month += 1) {
      const burn = costs - revenue;
      balance -= burn;
      months.push({ month, revenue, costs, burn, balance });
      if (balance <= 0 && zeroMonth === null) {
        zeroMonth = month;
      }
      revenue *= 1 + revenueRate;
      costs *= 1 + costsRate;
    }
    const currentBurn = Number(monthlyCosts || 0) - Number(monthlyRevenue || 0);
    const flatRunway = currentBurn > 0 ? Number(cashOnHand || 0) / currentBurn : Infinity;
    return { months, zeroMonth, currentBurn, flatRunway };
  }, [cashOnHand, monthlyRevenue, monthlyCosts, revenueGrowth, costGrowth]);

  return (
    <div className="page narrow-page" data-testid="runway-calculator-page">
      <section className="tool-intro" data-testid="runway-intro-section">
        <div>
          <p className="eyebrow"><TrendingDown size={14} /> Cash runway</p>
          <h1>Runway Calculator</h1>
          <p>Model how many months of cash you have at today's burn, then layer on revenue and cost growth to see when the balance hits zero.</p>
        </div>
      </section>

      <section className="calculator-panel" data-testid="runway-inputs-panel">
        <div className="calculator-inputs">
          <label>Cash on hand (£)
            <input type="number" value={cashOnHand} onChange={(event) => setCashOnHand(event.target.value)} data-testid="runway-cash-input" />
          </label>
          <label>Monthly revenue (£)
            <input type="number" value={monthlyRevenue} onChange={(event) => setMonthlyRevenue(event.target.value)} data-testid="runway-revenue-input" />
          </label>
          <label>Monthly costs (£)
            <input type="number" value={monthlyCosts} onChange={(event) => setMonthlyCosts(event.target.value)} data-testid="runway-costs-input" />
          </label>
          <label>Revenue growth (% / month)
            <input type="number" value={revenueGrowth} onChange={(event) => setRevenueGrowth(event.target.value)} data-testid="runway-revenue-growth-input" />
          </label>
          <label>Cost growth (% / month)
            <input type="number" value={costGrowth} onChange={(event) => setCostGrowth(event.target.value)} data-testid="runway-cost-growth-input" />
          </label>
        </div>

        <div className="result-grid" data-testid="runway-summary-results">
          <div>
            <span>Net monthly burn</span>
            <strong>{formatMoney(projection.currentBurn)}</strong>
          </div>
          <div>
            <span>Flat runway</span>
            <strong>{Number.isFinite(projection.flatRunway) ? `${projection.flatRunway.toFixed(1)} mo` : "Cash positive"}</strong>
          </div>
          <div>
            <span>Cash zero (with growth)</span>
            <strong>{projection.zeroMonth ? `Month ${projection.zeroMonth}` : "After 36 mo"}</strong>
          </div>
        </div>
      </section>

      <section className="calculator-panel" data-testid="runway-projection-panel">
        <h2>36-month projection</h2>
        <div className="line-items runway-projection" data-testid="runway-projection-list">
          <div className="line-item-row runway-row runway-row-head">
            <strong>Month</strong>
            <strong>Revenue</strong>
            <strong>Costs</strong>
            <strong>Burn</strong>
            <strong>Balance</strong>
          </div>
          {projection.months.map((row) => (
            <div key={row.month} className={`line-item-row runway-row ${row.balance <= 0 ? "runway-zero" : ""}`} data-testid={`runway-month-${row.month}`}>
              <span>{row.month}</span>
              <span>{formatMoney(row.revenue)}</span>
              <span>{formatMoney(row.costs)}</span>
              <span>{formatMoney(row.burn)}</span>
              <span>{formatMoney(row.balance)}</span>
            </div>
          ))}
        </div>
      </section>

      <PremiumCapture source="runway-calculator" />
    </div>
  );
}
