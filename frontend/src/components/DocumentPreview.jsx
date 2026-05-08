import { calculateDocumentTotals, calculateLineAmount, formatMoney, vatModes } from "../utils/calculations";

export const DocumentPreview = ({ document, previewId, variant = "invoice" }) => {
  const totals = calculateDocumentTotals(document.items, document.vatMode);
  const title = variant === "quote" ? "QUOTE" : "INVOICE";
  const dueLabel = variant === "quote" ? "Valid Until" : "Due Date";
  const totalLabel = variant === "quote" ? "Quote Total" : "Total Due";
  return (
    <article id={previewId} className="paper-preview" data-testid={`${variant}-document-preview`}>
      <header className="paper-header" data-testid={`${variant}-preview-header`}>
        <div>
          <h1 data-testid={`${variant}-preview-title`}>{title}</h1>
          <p data-testid={`${variant}-preview-number`}>{document.documentNumber}</p>
        </div>
        <div className="paper-party text-right" data-testid={`${variant}-preview-sender`}>
          <strong data-testid={`${variant}-preview-sender-name`}>{document.senderName}</strong>
          <span data-testid={`${variant}-preview-sender-address`}>{document.senderAddress}</span>
          {document.senderVat && <span data-testid={`${variant}-preview-sender-vat`}>VAT: {document.senderVat}</span>}
        </div>
      </header>
      <section className="paper-meta" data-testid={`${variant}-preview-meta`}>
        <div data-testid={`${variant}-preview-client`}>
          <span className="paper-label" data-testid={`${variant}-preview-client-label`}>Billed to</span>
          <strong data-testid={`${variant}-preview-client-name`}>{document.clientName}</strong>
          <span data-testid={`${variant}-preview-client-address`}>{document.clientAddress}</span>
          {document.clientVat && <span data-testid={`${variant}-preview-client-vat`}>VAT: {document.clientVat}</span>}
        </div>
        <div className="paper-dates" data-testid={`${variant}-preview-dates`}>
          <span data-testid={`${variant}-preview-issue-date`}>Issue date: {document.issueDate}</span>
          <span data-testid={`${variant}-preview-due-date`}>{dueLabel}: {document.dueDate}</span>
          <span data-testid={`${variant}-preview-terms`}>{document.terms}</span>
        </div>
      </section>
      <table className="paper-table" data-testid={`${variant}-preview-line-items-table`}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {document.items.map((item, index) => (
            <tr key={item.id} data-testid={`${variant}-preview-line-item-${index}`}>
              <td data-testid={`${variant}-preview-line-description-${index}`}>{item.description}</td>
              <td data-testid={`${variant}-preview-line-quantity-${index}`}>{item.quantity}</td>
              <td data-testid={`${variant}-preview-line-rate-${index}`}>{formatMoney(item.rate)}</td>
              <td data-testid={`${variant}-preview-line-amount-${index}`}>{formatMoney(calculateLineAmount(item))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <section className="paper-totals" data-testid={`${variant}-preview-totals`}>
        <div><span>Subtotal</span><strong data-testid={`${variant}-subtotal-value`}>{formatMoney(totals.subtotal)}</strong></div>
        <div><span>{vatModes[document.vatMode]?.label || "VAT"}</span><strong data-testid={`${variant}-vat-value`}>{formatMoney(totals.vat)}</strong></div>
        <div className="total-line"><span>{totalLabel}</span><strong data-testid={`${variant}-total-value`}>{formatMoney(totals.total)}</strong></div>
      </section>
      <footer className="paper-footer" data-testid={`${variant}-preview-footer`}>
        <div data-testid={`${variant}-preview-payment-details`}>
          <span className="paper-label">Payment details</span>
          <p>{document.paymentDetails}</p>
        </div>
        <div data-testid={`${variant}-preview-notes`}>
          <span className="paper-label">Notes</span>
          <p>{document.notes}</p>
          {document.vatMode !== "standard" && <p data-testid={`${variant}-preview-vat-note`}>{vatModes[document.vatMode]?.note}</p>}
        </div>
      </footer>
    </article>
  );
};