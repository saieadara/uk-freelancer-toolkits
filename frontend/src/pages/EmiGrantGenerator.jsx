import { Download, Copy, BadgeCheck } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultEmiGrant } from "../data/hiring";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const fields = [
  { id: "companyName", label: "Company name" },
  { id: "companyNumber", label: "Companies House number" },
  { id: "companyAddress", label: "Registered office", textarea: true },
  { id: "optionholderName", label: "Optionholder name" },
  { id: "optionholderAddress", label: "Optionholder address", textarea: true },
  { id: "grantDate", label: "Grant date", type: "date" },
  { id: "numberOfShares", label: "Number of option shares", type: "number" },
  { id: "shareClass", label: "Share class" },
  { id: "exercisePrice", label: "Exercise price" },
  { id: "totalExerciseValue", label: "Total exercise value" },
  { id: "vestingSchedule", label: "Vesting schedule", textarea: true },
  { id: "exerciseWindow", label: "Exercise window", textarea: true },
  { id: "hmrcNoticeNote", label: "HMRC notification note", textarea: true },
  { id: "rulesReference", label: "Plan rules reference", textarea: true },
  { id: "signerName", label: "Signer name" },
  { id: "signerTitle", label: "Signer title" },
];

export default function EmiGrantGenerator() {
  const [grant, setGrant] = useLocalStorage("hiring-emi-grant", defaultEmiGrant());
  const previewId = "emi-grant-preview";
  const update = (field, value) => setGrant({ ...grant, [field]: value });
  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="emi-grant-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><BadgeCheck size={14} /> Hiring & Contracts</p>
          <h1>EMI Equity Grant Letter</h1>
          <p>Issue an Enterprise Management Incentive (EMI) option grant under HMRC's tax-advantaged scheme. Remember to file the grant notification with HMRC within 92 days using the Employment Related Securities (ERS) online service.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(grant.optionholderName || "optionholder").replace(/\s+/g, "-")}-emi-grant.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Grant details</h2>
        <div className="hiring-form-grid">
          {fields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={grant[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`emi-field-${field.id}`} />
                : <input type={field.type || "text"} value={grant[field.id] ?? ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`emi-field-${field.id}`} />}
            </label>
          ))}
          <label className="hiring-field-wide checkbox-row">
            <input type="checkbox" checked={!!grant.exitOnly} onChange={(event) => update("exitOnly", event.target.checked)} data-testid="emi-exit-only-toggle" />
            <span>Exit-only options (only exercisable on a sale or listing)</span>
          </label>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Grant letter preview</h2>
        <div id={previewId} className="hiring-document" data-testid="emi-grant-preview">
          <header>
            <p className="eyebrow">EMI Option Grant Letter</p>
            <h1>{grant.companyName}</h1>
            <p>{grant.companyAddress} · Companies House no. {grant.companyNumber}</p>
          </header>

          <p>Date of grant: {grant.grantDate}</p>
          <p><strong>{grant.optionholderName}</strong><br />{grant.optionholderAddress}</p>

          <h2>Grant of Enterprise Management Incentive (EMI) Option</h2>
          <p>The Company hereby grants to you an EMI option over <strong>{Number(grant.numberOfShares || 0).toLocaleString()}</strong> {grant.shareClass}, on the terms set out below and subject to the rules of the Company's EMI Share Option Plan.</p>

          <h3>1. Exercise Price</h3>
          <p>{grant.exercisePrice}. Total exercise value if all options are exercised: {grant.totalExerciseValue}.</p>

          <h3>2. Vesting</h3>
          <p>{grant.vestingSchedule}</p>

          <h3>3. Exercise Window</h3>
          <p>{grant.exerciseWindow}</p>
          {grant.exitOnly && <p><strong>Exit-only:</strong> options are only exercisable on a sale, listing, or other Exit Event as defined in the plan rules.</p>}

          <h3>4. HMRC Notification</h3>
          <p>{grant.hmrcNoticeNote}</p>

          <h3>5. Plan Rules</h3>
          <p>{grant.rulesReference}</p>

          <h3>6. Tax Treatment</h3>
          <p>Provided the EMI qualifying conditions are met and HMRC notification is filed within 92 days of grant, no income tax or National Insurance arises on grant. On exercise, no income tax arises if the exercise price is at least the agreed market value at grant. On a future sale, gains may benefit from Business Asset Disposal Relief subject to the qualifying period.</p>

          <div className="hiring-signature-grid">
            <div>
              <p className="signature-line">Signed for {grant.companyName}</p>
              <p>{grant.signerName}, {grant.signerTitle}</p>
            </div>
            <div>
              <p className="signature-line">Accepted by {grant.optionholderName}</p>
              <p>Date: ____________________</p>
            </div>
          </div>
        </div>
      </section>

      <PremiumCapture source="emi-grant-generator" />
    </div>
  );
}
