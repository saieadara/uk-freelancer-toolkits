import { useMemo, useState } from "react";
import { calculateTaxEstimate, formatMoney } from "../utils/calculations";
import { PremiumCapture } from "../components/PremiumCapture";

export default function TaxEstimator() {
  const [income, setIncome] = useState(55000);
  const [expenses, setExpenses] = useState(8000);
  const estimate = useMemo(() => calculateTaxEstimate(income, expenses), [income, expenses]);

  return (
    <div className="page narrow-page" data-testid="tax-estimator-page">
      <section className="tool-intro" data-testid="tax-intro-section">
        <div>
          <p className="eyebrow" data-testid="tax-intro-eyebrow">Planning estimate</p>
          <h1 data-testid="tax-intro-title">UK Self-Employed Tax Estimator</h1>
          <p data-testid="tax-intro-description">Estimate taxable profit, income tax, and National Insurance from annual freelance income and expenses.</p>
        </div>
      </section>

      <section className="calculator-panel" data-testid="tax-calculator-panel">
        <div className="calculator-inputs" data-testid="tax-inputs">
          <label data-testid="tax-income-field-label">Annual income
            <input type="number" value={income} onChange={(event) => setIncome(event.target.value)} data-testid="tax-income-input" />
          </label>
          <label data-testid="tax-expenses-field-label">Allowable expenses
            <input type="number" value={expenses} onChange={(event) => setExpenses(event.target.value)} data-testid="tax-expenses-input" />
          </label>
        </div>
        <div className="result-grid tax-results" data-testid="tax-result-grid">
          <div data-testid="tax-profit-result"><span>Estimated profit</span><strong>{formatMoney(estimate.profit)}</strong></div>
          <div data-testid="tax-taxable-result"><span>Taxable income</span><strong>{formatMoney(estimate.taxable)}</strong></div>
          <div data-testid="tax-income-tax-result"><span>Income tax</span><strong>{formatMoney(estimate.incomeTax)}</strong></div>
          <div data-testid="tax-ni-result"><span>National Insurance</span><strong>{formatMoney(estimate.nationalInsurance)}</strong></div>
          <div className="wide-result" data-testid="tax-total-result"><span>Estimated total set aside</span><strong>{formatMoney(estimate.total)}</strong></div>
        </div>
      </section>

      <section className="explanation-panel" data-testid="tax-explanation-section">
        <h2 data-testid="tax-explanation-title">How this estimate works</h2>
        <p data-testid="tax-explanation-copy">This uses a simplified England/Wales/Northern Ireland style calculation: income minus expenses, personal allowance, income tax bands, and Class 4 National Insurance. It is a rough estimate, not tax advice.</p>
        <p className="disclaimer" data-testid="tax-disclaimer">Always check current HMRC rules or speak to an accountant before making tax decisions.</p>
      </section>
      <PremiumCapture source="tax-estimator" />
    </div>
  );
}