import { Download, Copy, FileLock } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultDpa } from "../data/legal";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const fields = [
  { id: "controllerName", label: "Controller name" },
  { id: "controllerAddress", label: "Controller address", textarea: true },
  { id: "processorName", label: "Processor name" },
  { id: "processorAddress", label: "Processor address", textarea: true },
  { id: "effectiveDate", label: "Effective date", type: "date" },
  { id: "subject", label: "Subject matter", textarea: true },
  { id: "duration", label: "Duration", textarea: true },
  { id: "nature", label: "Nature of processing", textarea: true },
  { id: "purpose", label: "Purpose of processing", textarea: true },
  { id: "dataCategories", label: "Categories of personal data", textarea: true },
  { id: "dataSubjects", label: "Data subjects", textarea: true },
  { id: "subProcessors", label: "Approved sub-processors", textarea: true },
  { id: "securityMeasures", label: "Security measures", textarea: true },
  { id: "breachNotification", label: "Breach notification", textarea: true },
  { id: "internationalTransfers", label: "International transfers", textarea: true },
  { id: "audits", label: "Audit rights", textarea: true },
  { id: "returnOrDeletion", label: "Return or deletion", textarea: true },
  { id: "governingLaw", label: "Governing law" },
  { id: "signerControllerName", label: "Controller signer" },
  { id: "signerControllerTitle", label: "Controller title" },
  { id: "signerProcessorName", label: "Processor signer" },
  { id: "signerProcessorTitle", label: "Processor title" },
];

export default function DpaGenerator() {
  const [dpa, setDpa] = useLocalStorage("legal-dpa", defaultDpa());
  const previewId = "dpa-preview";
  const update = (field, value) => setDpa({ ...dpa, [field]: value });
  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="dpa-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><FileLock size={14} /> Compliance & Legal</p>
          <h1>Data Processing Agreement (DPA)</h1>
          <p>Article 28 GDPR–style processor agreement covering subject matter, duration, security, sub-processors, breach notification, audits, and data return / deletion. Add as a schedule to your master service agreement.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(dpa.processorName || "processor").replace(/\s+/g, "-")}-dpa.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>DPA fields</h2>
        <div className="hiring-form-grid">
          {fields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={dpa[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`dpa-field-${field.id}`} />
                : <input type={field.type || "text"} value={dpa[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`dpa-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>DPA preview</h2>
        <div id={previewId} className="hiring-document" data-testid="dpa-preview">
          <header>
            <p className="eyebrow">Data Processing Agreement</p>
            <h1>{dpa.controllerName} ↔ {dpa.processorName}</h1>
            <p>Effective {dpa.effectiveDate} · governed by {dpa.governingLaw}</p>
          </header>

          <p>This Agreement supplements the underlying Service Agreement between <strong>{dpa.controllerName}</strong> ("Controller") and <strong>{dpa.processorName}</strong> ("Processor") and sets out the terms on which the Processor processes personal data on behalf of the Controller in accordance with Article 28 of the UK GDPR.</p>

          <h3>1. Subject matter</h3>
          <p>{dpa.subject}</p>

          <h3>2. Duration</h3>
          <p>{dpa.duration}</p>

          <h3>3. Nature & purpose of processing</h3>
          <p>{dpa.nature}</p>
          <p>{dpa.purpose}</p>

          <h3>4. Categories of personal data</h3>
          <p>{dpa.dataCategories}</p>

          <h3>5. Data subjects</h3>
          <p>{dpa.dataSubjects}</p>

          <h3>6. Sub-processors</h3>
          <p>The Controller authorises the use of the following sub-processors: {dpa.subProcessors}. The Processor will give the Controller at least 30 days' prior notice of changes and the Controller may object on reasonable grounds.</p>

          <h3>7. Security measures</h3>
          <p>{dpa.securityMeasures}</p>

          <h3>8. Personal data breach</h3>
          <p>{dpa.breachNotification}</p>

          <h3>9. International transfers</h3>
          <p>{dpa.internationalTransfers}</p>

          <h3>10. Audit rights</h3>
          <p>{dpa.audits}</p>

          <h3>11. Return or deletion</h3>
          <p>{dpa.returnOrDeletion}</p>

          <h3>12. Governing law</h3>
          <p>This Agreement is governed by the laws of {dpa.governingLaw}.</p>

          <h3>Annex A — Processing details</h3>
          <p><strong>Subject matter:</strong> {dpa.subject}</p>
          <p><strong>Duration:</strong> {dpa.duration}</p>
          <p><strong>Nature & purpose:</strong> {dpa.nature} {dpa.purpose}</p>
          <p><strong>Data categories:</strong> {dpa.dataCategories}</p>
          <p><strong>Data subjects:</strong> {dpa.dataSubjects}</p>

          <div className="hiring-signature-grid">
            <div>
              <p className="signature-line">Signed for {dpa.controllerName}</p>
              <p>{dpa.signerControllerName}, {dpa.signerControllerTitle}</p>
            </div>
            <div>
              <p className="signature-line">Signed for {dpa.processorName}</p>
              <p>{dpa.signerProcessorName}, {dpa.signerProcessorTitle}</p>
            </div>
          </div>
        </div>
      </section>

      <PremiumCapture source="dpa-generator" />
    </div>
  );
}
