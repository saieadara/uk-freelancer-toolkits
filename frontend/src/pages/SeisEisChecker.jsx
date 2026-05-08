import { useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";

const SCHEME_LIMITS = {
  seis: {
    label: "SEIS",
    maxRaiseLifetime: 250000,
    maxGrossAssets: 350000,
    maxEmployees: 25,
    maxAgeYears: 3,
    investorReliefRate: 0.5,
    cgtReinvestmentRate: 0.5,
  },
  eis: {
    label: "EIS",
    maxRaiseLifetime: 12000000,
    maxRaiseAnnual: 5000000,
    maxGrossAssets: 15000000,
    maxEmployees: 250,
    maxAgeYears: 7,
    investorReliefRate: 0.3,
    cgtDeferralRate: 1.0,
  },
};

const EXCLUDED_ACTIVITIES = [
  "Banking, insurance, money-lending",
  "Property development or dealing in land",
  "Legal or accountancy services",
  "Coal or steel production",
  "Operating or managing hotels / nursing homes",
  "Generation of energy benefitting from subsidies",
];

export default function SeisEisChecker() {
  const [scheme, setScheme] = useState("seis");
  const [companyAge, setCompanyAge] = useState(2);
  const [employees, setEmployees] = useState(8);
  const [grossAssets, setGrossAssets] = useState(120000);
  const [previousRaise, setPreviousRaise] = useState(0);
  const [plannedRaise, setPlannedRaise] = useState(150000);
  const [excludedActivity, setExcludedActivity] = useState(false);
  const [ukPermanentEstablishment, setUkPermanentEstablishment] = useState(true);
  const [investorAmount, setInvestorAmount] = useState(20000);

  const limits = SCHEME_LIMITS[scheme];

  const checks = useMemo(() => {
    const totalRaise = Number(previousRaise || 0) + Number(plannedRaise || 0);
    return [
      {
        id: "age",
        label: `Company is under ${limits.maxAgeYears} years old`,
        passed: Number(companyAge) <= limits.maxAgeYears,
        detail: `Trading age must be ${limits.maxAgeYears} years or less from first commercial sale.`,
      },
      {
        id: "employees",
        label: `Fewer than ${limits.maxEmployees} full-time employees`,
        passed: Number(employees) < limits.maxEmployees,
        detail: `Must have fewer than ${limits.maxEmployees} full-time equivalent employees.`,
      },
      {
        id: "assets",
        label: `Gross assets under £${limits.maxGrossAssets.toLocaleString()}`,
        passed: Number(grossAssets) <= limits.maxGrossAssets,
        detail: `Pre-investment gross assets cannot exceed £${limits.maxGrossAssets.toLocaleString()}.`,
      },
      {
        id: "lifetimeRaise",
        label: `Total lifetime raise within £${limits.maxRaiseLifetime.toLocaleString()}`,
        passed: totalRaise <= limits.maxRaiseLifetime,
        detail: `SEIS / EIS / SITR funding combined cannot exceed £${limits.maxRaiseLifetime.toLocaleString()}.`,
      },
      {
        id: "activity",
        label: "Trade is a qualifying activity",
        passed: !excludedActivity,
        detail: "Excluded trades disqualify the company. Review HMRC list before proceeding.",
      },
      {
        id: "uk",
        label: "Has UK permanent establishment",
        passed: ukPermanentEstablishment,
        detail: "Company must have a permanent UK establishment.",
      },
    ];
  }, [companyAge, employees, grossAssets, previousRaise, plannedRaise, excludedActivity, ukPermanentEstablishment, limits]);

  const passedAll = checks.every((check) => check.passed);
  const passedCount = checks.filter((check) => check.passed).length;

  const investorBenefit = useMemo(() => {
    const amount = Number(investorAmount || 0);
    const incomeTaxRelief = amount * limits.investorReliefRate;
    const cgtFigure = scheme === "seis"
      ? amount * (limits.cgtReinvestmentRate || 0)
      : amount * (limits.cgtDeferralRate || 0);
    return {
      incomeTaxRelief,
      cgtFigure,
      lossReliefBasis: amount - incomeTaxRelief,
    };
  }, [investorAmount, scheme, limits]);

  return (
    <div className="page narrow-page" data-testid="seis-eis-checker-page">
      <section className="tool-intro" data-testid="seis-eis-intro-section">
        <div>
          <p className="eyebrow" data-testid="seis-eis-intro-eyebrow"><ShieldCheck size={14} /> Funding eligibility</p>
          <h1 data-testid="seis-eis-intro-title">SEIS / EIS Eligibility Checker</h1>
          <p data-testid="seis-eis-intro-description">Check whether your UK company looks eligible for the Seed Enterprise Investment Scheme or Enterprise Investment Scheme, and estimate the relief on offer to investors.</p>
        </div>
      </section>

      <section className="calculator-panel" data-testid="seis-eis-panel">
        <div className="segmented" data-testid="seis-eis-mode-segmented-control">
          <button className={scheme === "seis" ? "active" : ""} onClick={() => setScheme("seis")} data-testid="seis-mode-button">SEIS</button>
          <button className={scheme === "eis" ? "active" : ""} onClick={() => setScheme("eis")} data-testid="eis-mode-button">EIS</button>
        </div>

        <div className="calculator-inputs" data-testid="seis-eis-company-inputs">
          <label>Trading age (years)
            <input type="number" min="0" value={companyAge} onChange={(event) => setCompanyAge(event.target.value)} data-testid="seis-eis-age-input" />
          </label>
          <label>Full-time employees
            <input type="number" min="0" value={employees} onChange={(event) => setEmployees(event.target.value)} data-testid="seis-eis-employees-input" />
          </label>
          <label>Gross assets (£)
            <input type="number" min="0" value={grossAssets} onChange={(event) => setGrossAssets(event.target.value)} data-testid="seis-eis-assets-input" />
          </label>
          <label>Previous SEIS/EIS raised (£)
            <input type="number" min="0" value={previousRaise} onChange={(event) => setPreviousRaise(event.target.value)} data-testid="seis-eis-prior-input" />
          </label>
          <label>Planned new raise (£)
            <input type="number" min="0" value={plannedRaise} onChange={(event) => setPlannedRaise(event.target.value)} data-testid="seis-eis-planned-input" />
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={excludedActivity} onChange={(event) => setExcludedActivity(event.target.checked)} data-testid="seis-eis-excluded-toggle" />
            <span>Trade is on the HMRC excluded list</span>
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={ukPermanentEstablishment} onChange={(event) => setUkPermanentEstablishment(event.target.checked)} data-testid="seis-eis-uk-toggle" />
            <span>Company has UK permanent establishment</span>
          </label>
        </div>

        <div className={`status-banner ${passedAll ? "ok" : "warn"}`} data-testid="seis-eis-status-banner">
          {passedAll ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{passedAll
            ? `Looks eligible for ${limits.label} on these basics. Confirm with HMRC advance assurance before raising.`
            : `${passedCount} of ${checks.length} core ${limits.label} criteria pass. Review the failing items below.`}</span>
        </div>

        <ul className="check-list" data-testid="seis-eis-check-list">
          {checks.map((check) => (
            <li key={check.id} className={check.passed ? "pass" : "fail"} data-testid={`seis-eis-check-${check.id}`}>
              <strong>{check.passed ? "✓" : "✗"} {check.label}</strong>
              <span>{check.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="calculator-panel" data-testid="seis-eis-investor-panel">
        <h2>Investor relief estimate</h2>
        <div className="calculator-inputs">
          <label>Investor amount (£)
            <input type="number" min="0" value={investorAmount} onChange={(event) => setInvestorAmount(event.target.value)} data-testid="seis-eis-investor-input" />
          </label>
        </div>
        <div className="result-grid" data-testid="seis-eis-investor-results">
          <div>
            <span>Income tax relief ({Math.round(limits.investorReliefRate * 100)}%)</span>
            <strong>£{investorBenefit.incomeTaxRelief.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
          </div>
          <div>
            <span>{scheme === "seis" ? "CGT reinvestment relief (50%)" : "CGT deferral on existing gain"}</span>
            <strong>£{investorBenefit.cgtFigure.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
          </div>
          <div>
            <span>Loss relief basis (after income relief)</span>
            <strong>£{investorBenefit.lossReliefBasis.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
          </div>
        </div>
        <p className="form-message">Estimates only. Final position depends on the investor's tax band and HMRC advance assurance.</p>
      </section>

      <section className="seo-section" data-testid="seis-eis-seo-section">
        <h2>Excluded activities to watch</h2>
        <ul>
          {EXCLUDED_ACTIVITIES.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p>Always seek HMRC advance assurance and qualified tax advice before issuing SEIS or EIS shares.</p>
      </section>
      <PremiumCapture source="seis-eis-checker" />
    </div>
  );
}
