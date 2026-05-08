import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Calculator, Download, Copy, ArrowRight } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultDayRate } from "../data/product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";
import { formatMoney } from "../utils/calculations";

// UK 2025/26 simplified
const PERSONAL_ALLOWANCE = 12570;
const BASIC_LIMIT = 50270;
const ADDITIONAL_THRESHOLD = 125140;

const calcIncomeTax = (taxable) => {
  if (taxable <= 0) return 0;
  const basicBand = Math.min(taxable, BASIC_LIMIT - PERSONAL_ALLOWANCE) * 0.2;
  const higherTaxable = Math.max(0, Math.min(taxable, ADDITIONAL_THRESHOLD - PERSONAL_ALLOWANCE) - (BASIC_LIMIT - PERSONAL_ALLOWANCE));
  const higherBand = higherTaxable * 0.4;
  const additionalTaxable = Math.max(0, taxable - (ADDITIONAL_THRESHOLD - PERSONAL_ALLOWANCE));
  const additionalBand = additionalTaxable * 0.45;
  return basicBand + higherBand + additionalBand;
};

const calcEmployeeNI = (gross) => {
  const upper = 50270;
  const lower = 12570;
  if (gross <= lower) return 0;
  const main = Math.min(gross, upper) - lower;
  const upperEarnings = Math.max(0, gross - upper);
  return main * 0.08 + upperEarnings * 0.02;
};

const calcEmployerNI = (gross) => {
  const threshold = 9100;
  if (gross <= threshold) return 0;
  return (gross - threshold) * 0.138;
};

const calcLtdNet = ({ dayRate, daysPerYear, expensesPerYear, pensionPercent }) => {
  const turnover = dayRate * daysPerYear;
  const directorSalary = 12570; // tax-efficient salary
  const employerNi = calcEmployerNI(directorSalary);
  const employerPensionPct = Number(pensionPercent || 0) / 100;
  const employerPension = turnover * employerPensionPct; // simplified — assume employer pension contribution proportional
  const profitBeforeCT = turnover - directorSalary - employerNi - expensesPerYear - employerPension;
  const corporationTax = Math.max(0, profitBeforeCT) * 0.25; // simplified single rate (small profits + marginal relief omitted)
  const profitAfterCT = profitBeforeCT - corporationTax;
  const dividend = Math.max(0, profitAfterCT);

  // Personal: salary + dividend
  const employmentIncome = directorSalary;
  const employmentNi = calcEmployeeNI(employmentIncome);
  const employmentPersonalAllowanceUsed = Math.min(employmentIncome, PERSONAL_ALLOWANCE);
  const remainingPA = Math.max(0, PERSONAL_ALLOWANCE - employmentPersonalAllowanceUsed);
  const dividendAllowance = 500; // 2024-25 onwards
  const taxableDividend = Math.max(0, dividend - remainingPA - dividendAllowance);
  // Dividend bands (after using PA): basic 8.75%, higher 33.75%, additional 39.35%
  const totalTaxableIncome = Math.max(0, employmentIncome - PERSONAL_ALLOWANCE) + taxableDividend;
  const dividendInBasic = Math.max(0, Math.min(BASIC_LIMIT - PERSONAL_ALLOWANCE, totalTaxableIncome) - Math.max(0, employmentIncome - PERSONAL_ALLOWANCE));
  const dividendInHigher = Math.max(0, Math.min(ADDITIONAL_THRESHOLD - PERSONAL_ALLOWANCE, totalTaxableIncome) - Math.max(BASIC_LIMIT - PERSONAL_ALLOWANCE, Math.max(0, employmentIncome - PERSONAL_ALLOWANCE)));
  const dividendInAdditional = Math.max(0, totalTaxableIncome - (ADDITIONAL_THRESHOLD - PERSONAL_ALLOWANCE));
  const dividendTax = dividendInBasic * 0.0875 + dividendInHigher * 0.3375 + dividendInAdditional * 0.3935;
  const employmentIncomeTax = calcIncomeTax(Math.max(0, employmentIncome - PERSONAL_ALLOWANCE));
  const personalTaxes = employmentIncomeTax + employmentNi + dividendTax;
  const personalNet = (employmentIncome - employmentNi - employmentIncomeTax) + (dividend - dividendTax);

  return {
    turnover,
    directorSalary,
    employerNi,
    expensesPerYear,
    employerPension,
    profitBeforeCT,
    corporationTax,
    dividend,
    employmentNi,
    employmentIncomeTax,
    dividendTax,
    personalTaxes,
    personalNet,
  };
};

const calcUmbrellaNet = ({ dayRate, daysPerYear, expensesPerYear, pensionPercent }) => {
  const grossInvoice = dayRate * daysPerYear;
  const umbrellaMargin = Math.min(2400, grossInvoice * 0.02); // ~£100/mo or 2%
  const employerNi = calcEmployerNI(grossInvoice - umbrellaMargin);
  const apprenticeshipLevy = (grossInvoice - umbrellaMargin) * 0.005;
  const grossSalary = grossInvoice - umbrellaMargin - employerNi - apprenticeshipLevy - expensesPerYear;
  const pension = grossSalary * (Number(pensionPercent || 0) / 100);
  const taxableSalary = grossSalary - pension;
  const employeeNi = calcEmployeeNI(taxableSalary);
  const incomeTax = calcIncomeTax(Math.max(0, taxableSalary - PERSONAL_ALLOWANCE));
  const personalNet = taxableSalary - employeeNi - incomeTax;
  return {
    grossInvoice,
    umbrellaMargin,
    employerNi,
    apprenticeshipLevy,
    grossSalary,
    pension,
    incomeTax,
    employeeNi,
    personalNet,
  };
};

const calcPermNet = ({ permSalary, permPensionEmployer, permBonusPercent }) => {
  const bonus = permSalary * (Number(permBonusPercent || 0) / 100);
  const grossSalary = permSalary + bonus;
  const employerPension = permSalary * (Number(permPensionEmployer || 0) / 100);
  const employeeNi = calcEmployeeNI(grossSalary);
  const incomeTax = calcIncomeTax(Math.max(0, grossSalary - PERSONAL_ALLOWANCE));
  const personalNet = grossSalary - employeeNi - incomeTax;
  return { grossSalary, employerPension, employeeNi, incomeTax, personalNet };
};

export default function DayRateComparator() {
  const [state, setState] = useLocalStorage("product-day-rate", defaultDayRate());
  const previewId = "day-rate-preview";

  const update = (field, value) => setState({ ...state, [field]: Number(value) });

  const ltd = useMemo(() => calcLtdNet(state), [state]);
  const umbrella = useMemo(() => calcUmbrellaNet(state), [state]);
  const perm = useMemo(() => calcPermNet(state), [state]);

  const ranking = useMemo(() => [
    { id: "ltd", label: "Ltd / outside IR35", net: ltd.personalNet },
    { id: "umbrella", label: "Umbrella / inside IR35", net: umbrella.personalNet },
    { id: "perm", label: "PAYE permanent", net: perm.personalNet },
  ].sort((a, b) => b.net - a.net), [ltd, umbrella, perm]);

  const copyText = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="day-rate-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Calculator size={14} /> Product Management · contractors</p>
          <h1>Day-Rate Comparator</h1>
          <p>Estimate annual net take-home for a product manager contractor across three engagement models — Ltd (outside IR35), umbrella (inside IR35), and PAYE permanent. Uses UK 2025/26 bands. Indicative only.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyText}><Copy size={17} /> Copy</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `day-rate-comparator.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel" data-testid="day-rate-inputs-panel">
        <h2>Inputs</h2>
        <div className="hiring-form-grid">
          <label>Day rate (£)<input type="number" value={state.dayRate} onChange={(event) => update("dayRate", event.target.value)} data-testid="day-rate-input" /></label>
          <label>Billable days / year<input type="number" value={state.daysPerYear} onChange={(event) => update("daysPerYear", event.target.value)} /></label>
          <label>Allowable expenses (£/year)<input type="number" value={state.expensesPerYear} onChange={(event) => update("expensesPerYear", event.target.value)} /></label>
          <label>Pension contribution %<input type="number" value={state.pensionPercent} onChange={(event) => update("pensionPercent", event.target.value)} /></label>
          <label>Permanent salary (£)<input type="number" value={state.permSalary} onChange={(event) => update("permSalary", event.target.value)} /></label>
          <label>Permanent employer pension %<input type="number" value={state.permPensionEmployer} onChange={(event) => update("permPensionEmployer", event.target.value)} /></label>
          <label>Permanent bonus %<input type="number" value={state.permBonusPercent} onChange={(event) => update("permBonusPercent", event.target.value)} /></label>
        </div>
      </section>

      <section className="calculator-panel" data-testid="day-rate-results-panel">
        <h2>Annual net take-home (estimate)</h2>
        <div className="result-grid">
          <div><span>Ltd / outside IR35</span><strong>{formatMoney(ltd.personalNet)}</strong></div>
          <div><span>Umbrella / inside IR35</span><strong>{formatMoney(umbrella.personalNet)}</strong></div>
          <div><span>PAYE permanent</span><strong>{formatMoney(perm.personalNet)}</strong></div>
        </div>

        <h3>Ranking</h3>
        <ul className="check-list">
          {ranking.map((row, index) => (
            <li key={row.id} className="pass">
              <strong>{index + 1}. {row.label}</strong>
              <span>{formatMoney(row.net)} per year</span>
            </li>
          ))}
        </ul>

        <p className="form-message">Estimates use simplified UK 2025/26 figures: personal allowance £12,570; basic limit £50,270; additional threshold £125,140; corporation tax 25% (no marginal relief modelled); dividend rates 8.75% / 33.75% / 39.35% with £500 dividend allowance; umbrella gross-down via employer NI 13.8%, apprenticeship levy 0.5%, and a typical £100/mo umbrella margin. Pension treatment is approximate. Always confirm with an accountant before deciding.</p>
      </section>

      <section className="calculator-panel" data-testid="day-rate-cross-sell">
        <h2>Going contract? You'll need these.</h2>
        <p className="form-message">If the comparator points to going contract, line up the supporting documents now:</p>
        <div className="ir35-cross-sell">
          <Link to="/product/ir35" className="cross-sell-card">
            <strong>IR35 Determinator</strong>
            <span>Pressure-test the engagement against CEST-style factors before signing.</span>
            <span className="inline-action">Open <ArrowRight size={14} /></span>
          </Link>
          <Link to="/startup/consulting-client-contract" className="cross-sell-card">
            <strong>Consulting Contract</strong>
            <span>Generate the engagement contract with PDF and Word export.</span>
            <span className="inline-action">Open <ArrowRight size={14} /></span>
          </Link>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Document preview</h2>
        <div id={previewId} className="hiring-document" data-testid="day-rate-preview">
          <header>
            <p className="eyebrow">Day-Rate Comparator</p>
            <h1>{formatMoney(state.dayRate)} / day · {state.daysPerYear} days</h1>
            <p>Ltd vs Umbrella vs PAYE — UK 2025/26 indicative</p>
          </header>

          <h3>Ranking</h3>
          <ul>
            {ranking.map((row, index) => (
              <li key={row.id}><strong>{index + 1}. {row.label}</strong> — {formatMoney(row.net)} net per year</li>
            ))}
          </ul>

          <h3>Ltd (outside IR35)</h3>
          <p>Turnover {formatMoney(ltd.turnover)} · CT {formatMoney(ltd.corporationTax)} · dividends {formatMoney(ltd.dividend)} · personal taxes {formatMoney(ltd.personalTaxes)} · net {formatMoney(ltd.personalNet)}.</p>

          <h3>Umbrella (inside IR35)</h3>
          <p>Gross invoice {formatMoney(umbrella.grossInvoice)} · employer NI {formatMoney(umbrella.employerNi)} · apprenticeship levy {formatMoney(umbrella.apprenticeshipLevy)} · gross salary {formatMoney(umbrella.grossSalary)} · income tax {formatMoney(umbrella.incomeTax)} · employee NI {formatMoney(umbrella.employeeNi)} · net {formatMoney(umbrella.personalNet)}.</p>

          <h3>PAYE permanent</h3>
          <p>Gross salary {formatMoney(perm.grossSalary)} · employer pension {formatMoney(perm.employerPension)} · income tax {formatMoney(perm.incomeTax)} · employee NI {formatMoney(perm.employeeNi)} · net {formatMoney(perm.personalNet)}.</p>
        </div>
      </section>

      <PremiumCapture source="day-rate-comparator" />
    </div>
  );
}
