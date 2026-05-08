import { useMemo } from "react";
import { Download, Copy, FileSignature } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultEmploymentContract, employmentTypes } from "../data/hiring";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const fields = [
  { id: "companyName", label: "Company name" },
  { id: "companyAddress", label: "Company address", textarea: true },
  { id: "companyContact", label: "Company contact email" },
  { id: "employeeName", label: "Employee / worker name" },
  { id: "employeeAddress", label: "Employee address", textarea: true },
  { id: "jobTitle", label: "Job title" },
  { id: "startDate", label: "Start date", type: "date" },
  { id: "workLocation", label: "Work location" },
  { id: "salary", label: "Salary / fee" },
  { id: "payFrequency", label: "Pay frequency" },
  { id: "hours", label: "Working hours" },
  { id: "probation", label: "Probation period" },
  { id: "noticeEmployer", label: "Notice (employer)" },
  { id: "noticeEmployee", label: "Notice (employee)" },
  { id: "holiday", label: "Holiday entitlement" },
  { id: "pension", label: "Pension", textarea: true },
  { id: "benefits", label: "Benefits", textarea: true },
  { id: "confidentiality", label: "Confidentiality clause", textarea: true },
  { id: "ip", label: "Intellectual property", textarea: true },
  { id: "postTermination", label: "Post-termination restrictions", textarea: true },
  { id: "governingLaw", label: "Governing law" },
  { id: "signatureDate", label: "Signature date", type: "date" },
];

export default function EmploymentContractGenerator() {
  const [contract, setContract] = useLocalStorage("hiring-employment-contract", defaultEmploymentContract());
  const previewId = "employment-contract-preview";

  const update = (field, value) => setContract({ ...contract, [field]: value });
  const typeMeta = useMemo(() => employmentTypes[contract.employmentType] || employmentTypes.employee, [contract.employmentType]);

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="employment-contract-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><FileSignature size={14} /> Hiring & Contracts</p>
          <h1>Employment Contract Generator</h1>
          <p>UK-aware contract for an employee, off-payroll worker (inside IR35), or self-employed contractor (outside IR35). The status clauses adjust based on your selection.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc} data-testid="employment-copy-button"><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(contract.employeeName || "employee").replace(/\s+/g, "-")}-employment-contract.pdf`)} data-testid="employment-pdf-button"><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Engagement type</h2>
        <div className="segmented hiring-segmented" data-testid="employment-type-segmented">
          {Object.entries(employmentTypes).map(([key, meta]) => (
            <button key={key} className={contract.employmentType === key ? "active" : ""} onClick={() => update("employmentType", key)} data-testid={`employment-type-${key}`}>
              {meta.label}
            </button>
          ))}
        </div>
        <p className="form-message"><strong>{typeMeta.label}.</strong> {typeMeta.summary}</p>
      </section>

      <section className="calculator-panel">
        <h2>Contract fields</h2>
        <div className="hiring-form-grid" data-testid="employment-fields">
          {fields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={contract[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`employment-field-${field.id}`} />
                : <input type={field.type || "text"} value={contract[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`employment-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Document preview</h2>
        <div id={previewId} className="hiring-document" data-testid="employment-preview">
          <header>
            <p className="eyebrow">Contract of Engagement</p>
            <h1>{contract.companyName}</h1>
            <p>{contract.companyAddress}</p>
          </header>
          <h2>Employment Agreement — {typeMeta.label}</h2>
          <p>This Agreement is made on {contract.signatureDate} between <strong>{contract.companyName}</strong> ("the Company") of {contract.companyAddress} and <strong>{contract.employeeName}</strong> of {contract.employeeAddress}.</p>

          <h3>1. Status &amp; Tax Treatment</h3>
          <p>{typeMeta.statusClause}</p>
          <p>{typeMeta.irClause}</p>

          <h3>2. Role &amp; Reporting</h3>
          <p>The Employee is engaged in the role of <strong>{contract.jobTitle}</strong>, starting on {contract.startDate}, working from {contract.workLocation}.</p>

          <h3>3. Hours &amp; Pay</h3>
          <p>Working hours: {contract.hours}. Remuneration: {contract.salary}, paid {contract.payFrequency}.</p>

          <h3>4. Probation</h3>
          <p>{contract.probation} probation period. Notice during probation: 1 week from either side. After probation: {contract.noticeEmployer} from the Company; {contract.noticeEmployee} from the Employee.</p>

          <h3>5. Holiday &amp; Pension</h3>
          <p>Holiday: {contract.holiday}.</p>
          <p>Pension: {contract.pension}</p>

          <h3>6. Benefits</h3>
          <p>{contract.benefits}</p>

          <h3>7. Confidentiality</h3>
          <p>{contract.confidentiality}</p>

          <h3>8. Intellectual Property</h3>
          <p>{contract.ip}</p>

          <h3>9. Post-termination Restrictions</h3>
          <p>{contract.postTermination}</p>

          <h3>10. Governing Law</h3>
          <p>This Agreement is governed by the laws of {contract.governingLaw}.</p>

          <div className="hiring-signature-grid">
            <div>
              <p className="signature-line">Signed for the Company</p>
              <p>Date: {contract.signatureDate}</p>
            </div>
            <div>
              <p className="signature-line">Signed by {contract.employeeName}</p>
              <p>Date: {contract.signatureDate}</p>
            </div>
          </div>
        </div>
      </section>

      <PremiumCapture source="employment-contract-generator" />
    </div>
  );
}
