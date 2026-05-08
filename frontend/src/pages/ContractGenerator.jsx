import { useMemo, useRef, useState } from "react";
import { Download, FileText, ImagePlus, X } from "lucide-react";
import { ContractPreview } from "../components/ContractPreview";
import { TextArea, TextInput } from "../components/forms";
import { contractSections, defaultContract } from "../data/contractPlan";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadContractDocx } from "../utils/contractDocx";
import { downloadElementAsPdf } from "../utils/pdf";

const colourPresets = [
  { id: "coral", label: "Coral", documentColor: "#fff5f5", fontColor: "#202020", accentColor: "#c24a4a" },
  { id: "rose", label: "Rose", documentColor: "#fff1f6", fontColor: "#2a171f", accentColor: "#b64f76" },
  { id: "ink", label: "Ink", documentColor: "#ffffff", fontColor: "#151515", accentColor: "#3a3a3a" },
  { id: "sage", label: "Sage", documentColor: "#f5f9f3", fontColor: "#172018", accentColor: "#58785c" },
  { id: "blue", label: "Blue", documentColor: "#f3f7fd", fontColor: "#111b2c", accentColor: "#315f9a" },
];

const fields = {
  branding: [["contractTitle", "Contract title", "input"], ["consultantBusiness", "Business / brand name", "input"], ["consultantWebsite", "Website", "input"], ["disclaimer", "Disclaimer", "textarea"]],
  parties: [["consultantName", "Consultant name", "input"], ["consultantAddress", "Consultant address", "textarea"], ["consultantEmail", "Consultant email", "input"], ["consultantPhone", "Consultant phone", "input"], ["clientBusiness", "Client business", "input"], ["clientName", "Client name", "input"], ["clientAddress", "Client address", "textarea"], ["clientEmail", "Client email", "input"]],
  engagement: [["effectiveDate", "Effective date", "input", "date"], ["projectName", "Project name", "input"], ["purpose", "Purpose", "textarea"], ["objectives", "Objectives", "textarea"]],
  scope: [["scopeOfWork", "Scope of work", "textarea"], ["deliverables", "Deliverables", "textarea"], ["outOfScope", "Out of scope", "textarea"], ["startDate", "Start date", "input", "date"], ["endDate", "End date", "input", "date"], ["term", "Term", "textarea"]],
  payment: [["feeStructure", "Fee structure", "input"], ["feeAmount", "Fee amount", "input"], ["paymentSchedule", "Payment schedule", "textarea"], ["latePayment", "Late payment", "textarea"], ["expenses", "Expenses", "textarea"]],
  legal: [["clientResponsibilities", "Client responsibilities", "textarea"], ["confidentiality", "Confidentiality", "textarea"], ["intellectualProperty", "Intellectual property", "textarea"], ["independentContractor", "Independent contractor", "textarea"], ["termination", "Termination", "textarea"], ["liability", "Liability", "textarea"], ["governingLaw", "Governing law", "input"], ["notices", "Notices", "textarea"]],
  signatures: [["signatureDate", "Agreement signature date", "input", "date"], ["consultantSignatureName", "Consultant typed signature", "input"], ["consultantSignatureTitle", "Consultant title", "input"], ["consultantSignatureDate", "Consultant signature date", "input", "date"], ["clientSignatureName", "Client typed signature", "input"], ["clientSignatureTitle", "Client title", "input"], ["clientSignatureDate", "Client signature date", "input", "date"]],
};

const SignaturePad = ({ label, value, onChange, testId }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = event.touches?.[0] || event;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };
  const start = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const point = getPoint(event);
    ctx.strokeStyle = "#151515";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    setDrawing(true);
  };
  const move = (event) => {
    if (!drawing) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const point = getPoint(event);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };
  const end = (event) => {
    if (!drawing) return;
    event?.currentTarget?.releasePointerCapture?.(event.pointerId);
    setDrawing(false);
    onChange(canvasRef.current.toDataURL("image/png"));
  };
  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };
  const upload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <section className="signature-pad-box" data-testid={`${testId}-box`}>
      <div className="section-heading-row"><h3 data-testid={`${testId}-title`}>{label}</h3><button className="text-button" type="button" onClick={clear} data-testid={`${testId}-clear-button`}>Clear</button></div>
      {value && <img className="signature-upload-preview" src={value} alt={`${label} signature`} data-testid={`${testId}-image-preview`} />}
      <canvas ref={canvasRef} width="420" height="130" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} data-testid={`${testId}-canvas`} />
      <label className="secondary-button signature-upload-button" data-testid={`${testId}-upload-label`}>Upload signature<input type="file" accept="image/*" onChange={upload} data-testid={`${testId}-upload-input`} /></label>
    </section>
  );
};

export default function ContractGenerator() {
  const [contract, setContract] = useLocalStorage("startup-consulting-client-contract", defaultContract());
  const [activeSection, setActiveSection] = useState("branding");
  const previewId = "contract-pdf-preview";
  const activeFields = useMemo(() => fields[activeSection] || fields.branding, [activeSection]);
  const update = (field, value) => setContract({ ...contract, [field]: value });
  const applyPreset = (preset) => setContract({ ...contract, documentColor: preset.documentColor, fontColor: preset.fontColor, accentColor: preset.accentColor });

  const uploadLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("brandLogo", reader.result);
    reader.readAsDataURL(file);
  };

  const setType = (type) => setContract({ ...contract, contractType: type, contractTitle: type === "freelance" ? "Freelance Client Contract" : "Consulting Services Agreement" });

  return (
    <div className="tool-page contract-generator" data-testid="contract-generator-page">
      <section className="tool-intro" data-testid="contract-intro-section">
        <div>
          <p className="eyebrow" data-testid="contract-eyebrow">Startup Toolkit</p>
          <h1 data-testid="contract-title">Consulting Client Contract Generator</h1>
          <p data-testid="contract-description">Create a branded consulting or freelance client agreement with guided fields, page-by-page preview, PDF export, and editable Word download.</p>
        </div>
        <div className="hero-actions export-actions" data-testid="contract-export-actions">
          <button className="secondary-button" onClick={() => downloadContractDocx(contract)} data-testid="contract-download-docx-button"><FileText size={17} /> Download Word</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${contract.contractTitle || "client-contract"}.pdf`)} data-testid="contract-download-pdf-button"><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="startup-builder-layout" data-testid="contract-builder-layout">
        <aside className="startup-section-menu" data-testid="contract-section-menu">
          {contractSections.map((section) => <button key={section.id} className={activeSection === section.id ? "active" : ""} onClick={() => setActiveSection(section.id)} data-testid={`contract-section-button-${section.id}`}>{section.label}</button>)}
        </aside>

        <div className="builder-panel startup-form-panel" data-testid="contract-form-panel">
          <section className="colour-customizer" data-testid="contract-brand-customizer">
            <div className="section-heading-row"><h3 data-testid="contract-branding-title">Customize branding</h3><span className="form-message">Preview, PDF, Word</span></div>
            <div className="contract-type-toggle" data-testid="contract-type-toggle"><button type="button" className={contract.contractType === "consulting" ? "active" : ""} onClick={() => setType("consulting")} data-testid="contract-type-consulting-button">Consulting</button><button type="button" className={contract.contractType === "freelance" ? "active" : ""} onClick={() => setType("freelance")} data-testid="contract-type-freelance-button">Freelance</button></div>
            <div className="colour-preset-row" data-testid="contract-colour-presets">{colourPresets.map((preset) => <button key={preset.id} className="colour-preset-button" type="button" onClick={() => applyPreset(preset)} data-testid={`contract-colour-preset-${preset.id}`}><span style={{ background: preset.documentColor }} /><span style={{ background: preset.fontColor }} /><span style={{ background: preset.accentColor }} />{preset.label}</button>)}</div>
            <div className="colour-input-grid" data-testid="contract-colour-input-grid"><label className="colour-field"><span>Document colour</span><input type="color" value={contract.documentColor || "#fff5f5"} onChange={(event) => update("documentColor", event.target.value)} data-testid="contract-document-colour-input" /></label><label className="colour-field"><span>Font colour</span><input type="color" value={contract.fontColor || "#202020"} onChange={(event) => update("fontColor", event.target.value)} data-testid="contract-font-colour-input" /></label><label className="colour-field"><span>Accent colour</span><input type="color" value={contract.accentColor || "#c24a4a"} onChange={(event) => update("accentColor", event.target.value)} data-testid="contract-accent-colour-input" /></label></div>
            <div className="logo-upload-row" data-testid="contract-logo-upload-row"><label className="secondary-button logo-upload-button" data-testid="contract-logo-upload-label"><ImagePlus size={16} /> Upload logo<input type="file" accept="image/*" onChange={uploadLogo} data-testid="contract-logo-upload-input" /></label>{contract.brandLogo && <button className="secondary-button" type="button" onClick={() => update("brandLogo", "")} data-testid="contract-logo-remove-button"><X size={16} /> Remove logo</button>}<label className="field brand-style-select" data-testid="contract-brand-style-field"><span>Brand name style</span><select value={contract.brandNameStyle || "serif"} onChange={(event) => update("brandNameStyle", event.target.value)} data-testid="contract-brand-style-select"><option value="serif">Editorial serif</option><option value="bold">Bold modern</option><option value="minimal">Minimal caps</option></select></label></div>
          </section>

          <div className="section-heading-row"><h3 data-testid="contract-active-section-title">{contractSections.find((item) => item.id === activeSection)?.label}</h3><span className="form-message" data-testid="contract-save-message">Saved locally as you type</span></div>
          <div className="startup-field-grid" data-testid="contract-field-grid">
            {activeFields.map(([field, label, kind, inputType]) => kind === "textarea" ? <TextArea key={field} id={`contract-${field}`} label={label} value={contract[field]} onChange={(value) => update(field, value)} rows={4} /> : <TextInput key={field} id={`contract-${field}`} label={label} type={inputType || "text"} value={contract[field]} onChange={(value) => update(field, value)} />)}
          </div>
          {activeSection === "signatures" && <div className="signature-pad-grid" data-testid="contract-signature-pad-grid"><SignaturePad label="Consultant drawn/uploaded signature" value={contract.consultantSignatureImage} onChange={(value) => update("consultantSignatureImage", value)} testId="contract-consultant-signature-pad" /><SignaturePad label="Client drawn/uploaded signature" value={contract.clientSignatureImage} onChange={(value) => update("clientSignatureImage", value)} testId="contract-client-signature-pad" /></div>}
        </div>

        <div className="startup-document-shell contract-document-shell" data-testid="contract-preview-shell"><ContractPreview contract={contract} previewId={previewId} /></div>
      </section>
    </div>
  );
}