import { Download } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { TextArea, TextInput } from "../components/forms";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultReceipt } from "../utils/defaults";
import { formatMoney } from "../utils/calculations";
import { downloadElementAsPdf } from "../utils/pdf";

export default function ReceiptGenerator() {
  const [receipt, setReceipt] = useLocalStorage("ukft-receipt", defaultReceipt());
  const update = (field, value) => setReceipt({ ...receipt, [field]: value });

  return (
    <div className="tool-page" data-testid="receipt-generator-page">
      <section className="tool-intro" data-testid="receipt-intro-section">
        <div>
          <p className="eyebrow" data-testid="receipt-intro-eyebrow">After payment</p>
          <h1 data-testid="receipt-intro-title">UK Receipt Generator</h1>
          <p data-testid="receipt-intro-description">Create a simple professional receipt for paid freelance work, deposits, or one-off services.</p>
        </div>
        <button className="primary-button" onClick={() => downloadElementAsPdf("receipt-pdf-preview", `${receipt.receiptNumber}.pdf`)} data-testid="receipt-download-pdf-button"><Download size={17} /> Download PDF</button>
      </section>

      <section className="builder-preview-layout" data-testid="receipt-builder-preview-layout">
        <div className="builder-panel" data-testid="receipt-builder-panel">
          <section className="form-section" data-testid="receipt-form-section">
            <h3 data-testid="receipt-form-title">Receipt details</h3>
            <div className="two-column-fields">
              <TextInput id="receipt-number" label="Receipt number" value={receipt.receiptNumber} onChange={(value) => update("receiptNumber", value)} />
              <TextInput id="receipt-date" label="Date" type="date" value={receipt.date} onChange={(value) => update("date", value)} />
              <TextInput id="receipt-received-from" label="Received from" value={receipt.receivedFrom} onChange={(value) => update("receivedFrom", value)} />
              <TextInput id="receipt-payment-method" label="Payment method" value={receipt.paymentMethod} onChange={(value) => update("paymentMethod", value)} />
              <TextInput id="receipt-amount" label="Amount" type="number" value={receipt.amount} onChange={(value) => update("amount", value)} />
              <TextInput id="receipt-issuer-name" label="Issuer name" value={receipt.issuerName} onChange={(value) => update("issuerName", value)} />
              <TextArea id="receipt-description" label="Description" value={receipt.description} onChange={(value) => update("description", value)} />
              <TextArea id="receipt-issuer-address" label="Issuer address" value={receipt.issuerAddress} onChange={(value) => update("issuerAddress", value)} />
              <TextArea id="receipt-notes" label="Notes" value={receipt.notes} onChange={(value) => update("notes", value)} />
            </div>
          </section>
        </div>
        <div className="preview-panel" data-testid="receipt-preview-panel">
          <article id="receipt-pdf-preview" className="paper-preview receipt-preview" data-testid="receipt-document-preview">
            <header className="paper-header" data-testid="receipt-preview-header">
              <div><h1 data-testid="receipt-preview-title">RECEIPT</h1><p data-testid="receipt-preview-number">{receipt.receiptNumber}</p></div>
              <div className="paper-party text-right" data-testid="receipt-preview-issuer"><strong data-testid="receipt-preview-issuer-name">{receipt.issuerName}</strong><span data-testid="receipt-preview-issuer-address">{receipt.issuerAddress}</span></div>
            </header>
            <section className="receipt-summary" data-testid="receipt-preview-summary">
              <span data-testid="receipt-preview-date">Date: {receipt.date}</span>
              <span data-testid="receipt-preview-from">Received from: {receipt.receivedFrom}</span>
              <span data-testid="receipt-preview-method">Payment method: {receipt.paymentMethod}</span>
              <strong data-testid="receipt-preview-amount">{formatMoney(receipt.amount)}</strong>
            </section>
            <section className="paper-footer" data-testid="receipt-preview-details">
              <div><span className="paper-label">Description</span><p data-testid="receipt-preview-description">{receipt.description}</p></div>
              <div><span className="paper-label">Notes</span><p data-testid="receipt-preview-notes">{receipt.notes}</p></div>
            </section>
          </article>
        </div>
      </section>
      <PremiumCapture source="receipt-generator" />
    </div>
  );
}