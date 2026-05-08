const normalizeHex = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;
const blendHex = (first, second, firstWeight = 0.5) => {
  const expand = (hex) => hex.replace("#", "").match(/.{2}/g).map((part) => parseInt(part, 16));
  const [r1, g1, b1] = expand(first);
  const [r2, g2, b2] = expand(second);
  const mix = (a, b) => Math.round(a * firstWeight + b * (1 - firstWeight)).toString(16).padStart(2, "0");
  return `#${mix(r1, r2)}${mix(g1, g2)}${mix(b1, b2)}`;
};

const buildContractVars = (contract) => {
  const bg = normalizeHex(contract.documentColor, "#fff5f5");
  const text = normalizeHex(contract.fontColor, "#202020");
  const accent = normalizeHex(contract.accentColor, "#c24a4a");
  return {
    "--contract-bg": bg,
    "--contract-bg-alt": blendHex(bg, "#ffffff", 0.45),
    "--contract-text": text,
    "--contract-muted": blendHex(text, "#ffffff", 0.75),
    "--contract-accent": accent,
    "--contract-soft": blendHex(bg, accent, 0.76),
    "--contract-border": blendHex(accent, "#ffffff", 0.34),
  };
};

const ContractPage = ({ label, title, children, className = "" }) => (
  <article className={`contract-page ${className}`} data-testid={`contract-preview-page-${label}`}>
    <div className="contract-page-label" data-testid={`contract-preview-page-label-${label}`}>{label}</div>
    <h2 data-testid={`contract-preview-page-title-${label}`}>{title}</h2>
    {children}
  </article>
);

const Lines = ({ text, testId }) => (
  <ul className="contract-line-list" data-testid={testId}>
    {String(text || "").split("\n").filter(Boolean).map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}
  </ul>
);

const Clause = ({ number, title, children, testId }) => (
  <section className="contract-clause" data-testid={testId}>
    <h3><span>{number}</span>{title}</h3>
    <div>{children}</div>
  </section>
);

const BrandMark = ({ contract }) => (
  <div className={`contract-brand-mark ${contract.brandNameStyle || "serif"}`} data-testid="contract-preview-brand-mark">
    {contract.brandLogo ? <img src={contract.brandLogo} alt="Business logo" data-testid="contract-preview-brand-logo" /> : <div className="contract-logo-placeholder" data-testid="contract-preview-logo-placeholder">{contract.consultantBusiness?.slice(0, 2) || "CO"}</div>}
    <strong data-testid="contract-preview-brand-name">{contract.consultantBusiness}</strong>
  </div>
);

export const ContractPreview = ({ contract, previewId }) => {
  const agreementLabel = contract.contractType === "freelance" ? "Freelance Client Contract" : "Consulting Services Agreement";
  return (
    <section id={previewId} className="contract-document" data-testid="contract-document-preview" style={buildContractVars(contract)}>
      <ContractPage label="Cover" title={contract.contractTitle || agreementLabel} className="contract-cover-page">
        <BrandMark contract={contract} />
        <p className="contract-lead" data-testid="contract-preview-cover-intro">This {agreementLabel.toLowerCase()} is entered into on {contract.effectiveDate} by and between the consultant and client listed below.</p>
        <div className="contract-party-grid" data-testid="contract-preview-cover-parties">
          <div><span>Consultant</span><strong>{contract.consultantBusiness}</strong><p>{contract.consultantName}</p></div>
          <div><span>Client</span><strong>{contract.clientBusiness}</strong><p>{contract.clientName}</p></div>
        </div>
        <div className="contract-warning" data-testid="contract-preview-disclaimer">{contract.disclaimer}</div>
      </ContractPage>

      <ContractPage label="01" title="Parties & Appointment">
        <div className="contract-info-table" data-testid="contract-preview-parties-table">
          <div><span>Consultant business</span><strong>{contract.consultantBusiness}</strong></div>
          <div><span>Consultant contact</span><strong>{contract.consultantName}<br />{contract.consultantEmail}<br />{contract.consultantPhone}</strong></div>
          <div><span>Consultant address</span><strong>{contract.consultantAddress}</strong></div>
          <div><span>Client business</span><strong>{contract.clientBusiness}</strong></div>
          <div><span>Client contact</span><strong>{contract.clientName}<br />{contract.clientEmail}</strong></div>
          <div><span>Client address</span><strong>{contract.clientAddress}</strong></div>
        </div>
        <Clause number="1" title="Appointment" testId="contract-preview-appointment-clause"><p>The client appoints the consultant to provide the services described in this agreement for the project: <strong>{contract.projectName}</strong>.</p></Clause>
      </ContractPage>

      <ContractPage label="02" title="Purpose, Objectives & Scope">
        <Clause number="2" title="Purpose" testId="contract-preview-purpose-clause"><p>{contract.purpose}</p></Clause>
        <Clause number="3" title="Objectives" testId="contract-preview-objectives-clause"><Lines text={contract.objectives} testId="contract-preview-objectives-list" /></Clause>
        <Clause number="4" title="Scope of Work" testId="contract-preview-scope-clause"><Lines text={contract.scopeOfWork} testId="contract-preview-scope-list" /></Clause>
        <Clause number="5" title="Out of Scope" testId="contract-preview-out-of-scope-clause"><p>{contract.outOfScope}</p></Clause>
      </ContractPage>

      <ContractPage label="03" title="Deliverables & Timeline">
        <Clause number="6" title="Deliverables" testId="contract-preview-deliverables-clause"><Lines text={contract.deliverables} testId="contract-preview-deliverables-list" /></Clause>
        <Clause number="7" title="Term" testId="contract-preview-term-clause"><p>{contract.term}</p><p>Start date: {contract.startDate}{contract.endDate ? ` • End date: ${contract.endDate}` : ""}</p></Clause>
        <Clause number="8" title="Client Responsibilities" testId="contract-preview-client-responsibilities-clause"><Lines text={contract.clientResponsibilities} testId="contract-preview-client-responsibilities-list" /></Clause>
      </ContractPage>

      <ContractPage label="04" title="Fees, Expenses & Payment">
        <div className="contract-fee-panel" data-testid="contract-preview-fee-panel"><div><span>Fee structure</span><strong>{contract.feeStructure}</strong></div><div><span>Fee amount</span><strong>{contract.feeAmount}</strong></div></div>
        <Clause number="9" title="Payment Schedule" testId="contract-preview-payment-clause"><p>{contract.paymentSchedule}</p></Clause>
        <Clause number="10" title="Late Payment" testId="contract-preview-late-payment-clause"><p>{contract.latePayment}</p></Clause>
        <Clause number="11" title="Expenses" testId="contract-preview-expenses-clause"><p>{contract.expenses}</p></Clause>
      </ContractPage>

      <ContractPage label="05" title="Legal Terms">
        <Clause number="12" title="Confidentiality" testId="contract-preview-confidentiality-clause"><p>{contract.confidentiality}</p></Clause>
        <Clause number="13" title="Intellectual Property" testId="contract-preview-ip-clause"><p>{contract.intellectualProperty}</p></Clause>
        <Clause number="14" title="Independent Contractor" testId="contract-preview-independent-contractor-clause"><p>{contract.independentContractor}</p></Clause>
        <Clause number="15" title="Termination" testId="contract-preview-termination-clause"><p>{contract.termination}</p></Clause>
      </ContractPage>

      <ContractPage label="06" title="Liability, Notices & Signatures">
        <Clause number="16" title="Liability" testId="contract-preview-liability-clause"><p>{contract.liability}</p></Clause>
        <Clause number="17" title="Governing Law" testId="contract-preview-governing-law-clause"><p>This agreement is governed by the laws of {contract.governingLaw}.</p></Clause>
        <Clause number="18" title="Notices" testId="contract-preview-notices-clause"><p>{contract.notices}</p></Clause>
        <div className="contract-signature-grid" data-testid="contract-preview-signature-grid">
          <div data-testid="contract-preview-consultant-signature-block"><span>Consultant signature</span>{contract.consultantSignatureImage ? <img className="contract-signature-image" src={contract.consultantSignatureImage} alt="Consultant signature" data-testid="contract-preview-consultant-signature-image" /> : <em className="typed-signature" data-testid="contract-preview-consultant-typed-signature">{contract.consultantSignatureName || contract.consultantName}</em>}<small data-testid="contract-preview-consultant-signature-title">{contract.consultantSignatureTitle}</small><small data-testid="contract-preview-consultant-signature-date">Date: {contract.consultantSignatureDate || contract.signatureDate}</small></div>
          <div data-testid="contract-preview-client-signature-block"><span>Client signature</span>{contract.clientSignatureImage ? <img className="contract-signature-image" src={contract.clientSignatureImage} alt="Client signature" data-testid="contract-preview-client-signature-image" /> : <em className="typed-signature" data-testid="contract-preview-client-typed-signature">{contract.clientSignatureName || contract.clientName}</em>}<small data-testid="contract-preview-client-signature-title">{contract.clientSignatureTitle}</small><small data-testid="contract-preview-client-signature-date">Date: {contract.clientSignatureDate || contract.signatureDate}</small></div>
        </div>
      </ContractPage>
    </section>
  );
};