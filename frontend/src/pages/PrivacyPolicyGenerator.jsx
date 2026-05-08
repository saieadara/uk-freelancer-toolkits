import { Download, Copy, ShieldCheck } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultPrivacyPolicy } from "../data/legal";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const fields = [
  { id: "websiteName", label: "Website / brand name" },
  { id: "websiteUrl", label: "Website URL" },
  { id: "controllerName", label: "Controller legal name" },
  { id: "controllerNumber", label: "Companies House no." },
  { id: "controllerAddress", label: "Controller address", textarea: true },
  { id: "contactEmail", label: "Privacy contact email" },
  { id: "dpoContact", label: "DPO contact / status", textarea: true },
  { id: "effectiveDate", label: "Effective date", type: "date" },
  { id: "dataCollected", label: "Data we collect", textarea: true },
  { id: "purposes", label: "Purposes of processing", textarea: true },
  { id: "lawfulBases", label: "Lawful bases", textarea: true },
  { id: "recipients", label: "Recipients / processors", textarea: true },
  { id: "internationalTransfers", label: "International transfers", textarea: true },
  { id: "retention", label: "Retention periods", textarea: true },
  { id: "rights", label: "Data subject rights", textarea: true },
  { id: "cookiesNote", label: "Cookies note", textarea: true },
  { id: "childrenNote", label: "Children's data", textarea: true },
  { id: "changesNote", label: "Changes to this notice", textarea: true },
];

export default function PrivacyPolicyGenerator() {
  const [policy, setPolicy] = useLocalStorage("legal-privacy-policy", defaultPrivacyPolicy());
  const previewId = "privacy-policy-preview";
  const update = (field, value) => setPolicy({ ...policy, [field]: value });
  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="privacy-policy-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><ShieldCheck size={14} /> Compliance & Legal</p>
          <h1>Privacy Policy Generator</h1>
          <p>UK GDPR / GDPR–compliant privacy notice covering controller details, processing purposes, lawful bases, retention, rights, and the ICO complaint route.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(policy.websiteName || "site").replace(/\s+/g, "-")}-privacy-policy.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Policy fields</h2>
        <div className="hiring-form-grid">
          {fields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={policy[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`privacy-field-${field.id}`} />
                : <input type={field.type || "text"} value={policy[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`privacy-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Privacy policy preview</h2>
        <div id={previewId} className="hiring-document" data-testid="privacy-policy-preview">
          <header>
            <p className="eyebrow">Privacy Notice</p>
            <h1>{policy.websiteName} Privacy Policy</h1>
            <p>Effective {policy.effectiveDate} · {policy.websiteUrl}</p>
          </header>

          <h3>1. Who we are</h3>
          <p>{policy.controllerName} (Companies House no. {policy.controllerNumber}) of {policy.controllerAddress} is the data controller responsible for your personal data. Contact: {policy.contactEmail}.</p>
          <p>Data Protection Officer: {policy.dpoContact}</p>

          <h3>2. What data we collect</h3>
          <p>{policy.dataCollected}</p>

          <h3>3. Why we process it</h3>
          <p>{policy.purposes}</p>

          <h3>4. Lawful bases</h3>
          <p>{policy.lawfulBases}</p>

          <h3>5. Who we share it with</h3>
          <p>{policy.recipients}</p>

          <h3>6. International transfers</h3>
          <p>{policy.internationalTransfers}</p>

          <h3>7. How long we keep it</h3>
          <p>{policy.retention}</p>

          <h3>8. Your rights</h3>
          <p>{policy.rights}</p>

          <h3>9. Cookies</h3>
          <p>{policy.cookiesNote}</p>

          <h3>10. Children</h3>
          <p>{policy.childrenNote}</p>

          <h3>11. Changes</h3>
          <p>{policy.changesNote}</p>
        </div>
      </section>

      <PremiumCapture source="privacy-policy-generator" />
    </div>
  );
}
