import { Download } from "lucide-react";
import { DocumentPreview } from "../components/DocumentPreview";
import { LineItemsEditor } from "../components/LineItemsEditor";
import { PremiumCapture } from "../components/PremiumCapture";
import { SelectField, TextArea, TextInput } from "../components/forms";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { createDefaultDocument } from "../utils/defaults";
import { calculateDocumentTotals, formatMoney, vatModes } from "../utils/calculations";
import { downloadElementAsPdf } from "../utils/pdf";

const vatOptions = Object.entries(vatModes).map(([value, item]) => ({ value, label: item.label }));

export default function DocumentGenerator({ variant = "invoice" }) {
  const [document, setDocument] = useLocalStorage(`ukft-${variant}-document`, createDefaultDocument(variant));
  const totals = calculateDocumentTotals(document.items, document.vatMode);
  const isQuote = variant === "quote";
  const previewId = `${variant}-pdf-preview`;

  const update = (field, value) => setDocument({ ...document, [field]: value });
  const title = isQuote ? "UK Quote / Estimate Generator" : "UK VAT Invoice Generator";
  const description = isQuote
    ? "Create a quote or estimate before work starts, with VAT handling and a live PDF-ready preview."
    : "Create a professional UK VAT invoice with line items, VAT treatment, live totals, and PDF export.";

  return (
    <div className="tool-page" data-testid={`${variant}-generator-page`}>
      <section className="tool-intro" data-testid={`${variant}-intro-section`}>
        <div>
          <p className="eyebrow" data-testid={`${variant}-intro-eyebrow`}>{isQuote ? "Before work starts" : "Flagship tool"}</p>
          <h1 data-testid={`${variant}-intro-title`}>{title}</h1>
          <p data-testid={`${variant}-intro-description`}>{description}</p>
        </div>
        <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${document.documentNumber || variant}.pdf`)} data-testid={`${variant}-download-pdf-button`}>
          <Download size={17} /> Download PDF
        </button>
      </section>

      <section className="builder-preview-layout" data-testid={`${variant}-builder-preview-layout`}>
        <div className="builder-panel" data-testid={`${variant}-builder-panel`}>
          <section className="form-section" data-testid={`${variant}-details-section`}>
            <h3 data-testid={`${variant}-details-title`}>{isQuote ? "Quote details" : "Invoice details"}</h3>
            <div className="two-column-fields">
              <TextInput id={`${variant}-number`} label={isQuote ? "Quote number" : "Invoice number"} value={document.documentNumber} onChange={(value) => update("documentNumber", value)} />
              <TextInput id={`${variant}-issue-date`} label="Issue date" type="date" value={document.issueDate} onChange={(value) => update("issueDate", value)} />
              <TextInput id={`${variant}-due-date`} label={isQuote ? "Valid until" : "Due date"} type="date" value={document.dueDate} onChange={(value) => update("dueDate", value)} />
              <TextInput id={`${variant}-terms`} label={isQuote ? "Quote terms" : "Payment terms"} value={document.terms} onChange={(value) => update("terms", value)} />
            </div>
          </section>

          <section className="form-section" data-testid={`${variant}-parties-section`}>
            <h3 data-testid={`${variant}-parties-title`}>Parties</h3>
            <div className="two-column-fields">
              <TextInput id={`${variant}-sender-name`} label="Your business name" value={document.senderName} onChange={(value) => update("senderName", value)} />
              <TextInput id={`${variant}-sender-email`} label="Your email" value={document.senderEmail} onChange={(value) => update("senderEmail", value)} />
              <TextArea id={`${variant}-sender-address`} label="Your address" value={document.senderAddress} onChange={(value) => update("senderAddress", value)} />
              <TextInput id={`${variant}-sender-vat`} label="VAT number" value={document.senderVat} onChange={(value) => update("senderVat", value)} />
              <TextInput id={`${variant}-client-name`} label="Client name" value={document.clientName} onChange={(value) => update("clientName", value)} />
              <TextInput id={`${variant}-client-vat`} label="Client VAT number" value={document.clientVat} onChange={(value) => update("clientVat", value)} />
              <TextArea id={`${variant}-client-address`} label="Client address" value={document.clientAddress} onChange={(value) => update("clientAddress", value)} />
            </div>
          </section>

          <LineItemsEditor items={document.items} onChange={(items) => update("items", items)} variant={variant} />

          <section className="form-section totals-editor" data-testid={`${variant}-vat-totals-section`}>
            <SelectField id={`${variant}-vat-mode`} label="VAT treatment" value={document.vatMode} onChange={(value) => update("vatMode", value)} options={vatOptions} />
            <div className="live-total-box" data-testid={`${variant}-live-total-box`}>
              <span data-testid={`${variant}-live-subtotal`}>Subtotal {formatMoney(totals.subtotal)}</span>
              <span data-testid={`${variant}-live-vat`}>VAT {formatMoney(totals.vat)}</span>
              <strong data-testid={`${variant}-live-total`}>Total {formatMoney(totals.total)}</strong>
            </div>
          </section>

          <section className="form-section" data-testid={`${variant}-payment-notes-section`}>
            <h3 data-testid={`${variant}-payment-notes-title`}>Payment and notes</h3>
            <TextArea id={`${variant}-payment-details`} label="Payment details" value={document.paymentDetails} onChange={(value) => update("paymentDetails", value)} />
            <TextArea id={`${variant}-notes`} label="Document notes" value={document.notes} onChange={(value) => update("notes", value)} />
          </section>
        </div>

        <div className="preview-panel" data-testid={`${variant}-preview-panel`}>
          <DocumentPreview document={document} previewId={previewId} variant={variant} />
        </div>
      </section>

      <section className="seo-section" data-testid={`${variant}-seo-section`}>
        <h2 data-testid={`${variant}-seo-title`}>{isQuote ? "Freelance quote generator UK" : "UK VAT invoice generator"}</h2>
        <p data-testid={`${variant}-seo-copy`}>{isQuote ? "Use quotes when a client needs price confirmation before work begins. Convert the same structure into an invoice when the work is complete." : "Use a VAT invoice when you are VAT registered and need a clear subtotal, VAT amount, and total due for a UK client."}</p>
      </section>
      <PremiumCapture source={`${variant}-generator`} />
    </div>
  );
}