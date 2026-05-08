import { useMemo } from "react";
import { Download, Copy, Lock } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultNda } from "../data/hiring";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const fields = [
  { id: "effectiveDate", label: "Effective date", type: "date" },
  { id: "partyOneName", label: "Party 1 name" },
  { id: "partyOneAddress", label: "Party 1 address", textarea: true },
  { id: "partyTwoName", label: "Party 2 name" },
  { id: "partyTwoAddress", label: "Party 2 address", textarea: true },
  { id: "purpose", label: "Purpose of disclosure", textarea: true },
  { id: "termYears", label: "Term (years)", type: "number" },
  { id: "governingLaw", label: "Governing law" },
  { id: "excludedInformation", label: "Excluded information", textarea: true },
  { id: "permittedDisclosures", label: "Permitted disclosures", textarea: true },
  { id: "signerOneName", label: "Party 1 signer" },
  { id: "signerOneTitle", label: "Party 1 title" },
  { id: "signerTwoName", label: "Party 2 signer" },
  { id: "signerTwoTitle", label: "Party 2 title" },
];

export default function NdaGenerator() {
  const [nda, setNda] = useLocalStorage("hiring-nda", defaultNda());
  const previewId = "nda-preview";
  const update = (field, value) => setNda({ ...nda, [field]: value });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  const flowText = useMemo(() => {
    if (nda.ndaType === "mutual") return "Each party may disclose Confidential Information to the other party. Each party agrees to protect the other party's Confidential Information on the terms below.";
    return `${nda.partyOneName} (the "Disclosing Party") may disclose Confidential Information to ${nda.partyTwoName} (the "Receiving Party"). Only the Receiving Party owes confidentiality obligations under this Agreement.`;
  }, [nda.ndaType, nda.partyOneName, nda.partyTwoName]);

  return (
    <div className="page narrow-page" data-testid="nda-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Lock size={14} /> Hiring & Contracts</p>
          <h1>NDA Generator</h1>
          <p>Generate a mutual or one-way confidentiality agreement with editable purpose, term, and governing law. Use it before pitching a partner, sharing investor decks, or onboarding a freelance contractor.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(nda.partyOneName || "party").replace(/\s+/g, "-")}-nda.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>NDA type</h2>
        <div className="segmented" data-testid="nda-type-segmented">
          <button className={nda.ndaType === "mutual" ? "active" : ""} onClick={() => update("ndaType", "mutual")} data-testid="nda-mutual-button">Mutual</button>
          <button className={nda.ndaType === "oneway" ? "active" : ""} onClick={() => update("ndaType", "oneway")} data-testid="nda-oneway-button">One-way</button>
        </div>
        <p className="form-message">{flowText}</p>
      </section>

      <section className="calculator-panel">
        <h2>Agreement fields</h2>
        <div className="hiring-form-grid">
          {fields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={nda[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`nda-field-${field.id}`} />
                : <input type={field.type || "text"} value={nda[field.id] ?? ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`nda-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>NDA preview</h2>
        <div id={previewId} className="hiring-document" data-testid="nda-preview-document">
          <header>
            <p className="eyebrow">{nda.ndaType === "mutual" ? "Mutual Non-Disclosure Agreement" : "One-Way Non-Disclosure Agreement"}</p>
            <h1>Confidentiality Agreement</h1>
            <p>Effective {nda.effectiveDate}</p>
          </header>

          <p>This Agreement is made between:</p>
          <p><strong>{nda.partyOneName}</strong>, of {nda.partyOneAddress}; and</p>
          <p><strong>{nda.partyTwoName}</strong>, of {nda.partyTwoAddress}.</p>

          <h3>1. Purpose</h3>
          <p>{nda.purpose}</p>

          <h3>2. Disclosure</h3>
          <p>{flowText}</p>

          <h3>3. Confidential Information</h3>
          <p>"Confidential Information" means any information disclosed in connection with the Purpose, whether orally, in writing, or in any other form, that is identified as confidential or that a reasonable person would understand to be confidential, including business plans, financial information, customer data, technology, and trade secrets.</p>

          <h3>4. Excluded Information</h3>
          <p>{nda.excludedInformation}</p>

          <h3>5. Permitted Disclosures</h3>
          <p>{nda.permittedDisclosures}</p>

          <h3>6. Term</h3>
          <p>This Agreement remains in force for {nda.termYears} years from the Effective Date. Confidentiality obligations relating to trade secrets continue for as long as the information remains confidential.</p>

          <h3>7. No Licence</h3>
          <p>Nothing in this Agreement grants a licence under any intellectual property right.</p>

          <h3>8. Governing Law</h3>
          <p>This Agreement is governed by the laws of {nda.governingLaw} and the parties submit to the exclusive jurisdiction of its courts.</p>

          <div className="hiring-signature-grid">
            <div>
              <p className="signature-line">Signed for {nda.partyOneName}</p>
              <p>{nda.signerOneName}, {nda.signerOneTitle}</p>
            </div>
            <div>
              <p className="signature-line">Signed for {nda.partyTwoName}</p>
              <p>{nda.signerTwoName}, {nda.signerTwoTitle}</p>
            </div>
          </div>
        </div>
      </section>

      <PremiumCapture source="nda-generator" />
    </div>
  );
}
