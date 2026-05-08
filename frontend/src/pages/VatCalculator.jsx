import { Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { PremiumCapture } from "../components/PremiumCapture";
import { calculateVat, formatMoney } from "../utils/calculations";

export default function VatCalculator() {
  const [amount, setAmount] = useState(100);
  const [mode, setMode] = useState("add");
  const [rate, setRate] = useState(20);
  const [copied, setCopied] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const result = useMemo(() => calculateVat(amount, mode, rate), [amount, mode, rate]);

  const copyResult = async () => {
    const text = `Net: ${formatMoney(result.net)} | VAT: ${formatMoney(result.vat)} | Gross: ${formatMoney(result.gross)}`;
    let didCopy = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        didCopy = true;
      }
    } catch (_error) {
      didCopy = false;
    }

    if (!didCopy) {
      const fallbackInput = document.createElement("textarea");
      fallbackInput.value = text;
      fallbackInput.setAttribute("readonly", "");
      fallbackInput.style.position = "fixed";
      fallbackInput.style.opacity = "0";
      document.body.appendChild(fallbackInput);
      fallbackInput.select();
      try {
        didCopy = document.execCommand("copy");
      } catch (_error) {
        didCopy = false;
      } finally {
        document.body.removeChild(fallbackInput);
      }
    }

    setCopied(didCopy);
    setCopyMessage(didCopy ? "Result copied to clipboard." : "Copy blocked by browser permissions. The result remains visible above.");
    setTimeout(() => {
      setCopied(false);
      setCopyMessage("");
    }, 2200);
  };

  return (
    <div className="page narrow-page" data-testid="vat-calculator-page">
      <section className="tool-intro" data-testid="vat-intro-section">
        <div>
          <p className="eyebrow" data-testid="vat-intro-eyebrow">Fast single-screen utility</p>
          <h1 data-testid="vat-intro-title">UK VAT Calculator</h1>
          <p data-testid="vat-intro-description">Add VAT to a net amount or remove VAT from a gross amount with an instant breakdown.</p>
        </div>
      </section>

      <section className="calculator-panel" data-testid="vat-calculator-panel">
        <div className="segmented" data-testid="vat-mode-segmented-control">
          <button className={mode === "add" ? "active" : ""} onClick={() => setMode("add")} data-testid="vat-add-mode-button">Add VAT</button>
          <button className={mode === "remove" ? "active" : ""} onClick={() => setMode("remove")} data-testid="vat-remove-mode-button">Remove VAT</button>
        </div>
        <div className="calculator-inputs" data-testid="vat-calculator-inputs">
          <label data-testid="vat-amount-field-label">Amount
            <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} data-testid="vat-amount-input" />
          </label>
          <label data-testid="vat-rate-field-label">VAT rate %
            <input type="number" value={rate} onChange={(event) => setRate(event.target.value)} data-testid="vat-rate-input" />
          </label>
        </div>
        <div className="result-grid" data-testid="vat-result-grid">
          <div data-testid="vat-net-result"><span>Net amount</span><strong>{formatMoney(result.net)}</strong></div>
          <div data-testid="vat-vat-result"><span>VAT amount</span><strong>{formatMoney(result.vat)}</strong></div>
          <div data-testid="vat-gross-result"><span>Gross amount</span><strong>{formatMoney(result.gross)}</strong></div>
        </div>
        <button className="primary-button" onClick={copyResult} data-testid="vat-copy-result-button"><Copy size={17} /> {copied ? "Copied" : "Copy result"}</button>
        {copyMessage && <p className="form-message vat-copy-message" data-testid="vat-copy-result-message">{copyMessage}</p>}
      </section>

      <section className="seo-section" data-testid="vat-seo-section">
        <h2 data-testid="vat-seo-title">VAT calculator UK</h2>
        <p data-testid="vat-seo-copy">The default VAT rate is 20%, the UK standard rate. Change the rate if you need to model another VAT treatment.</p>
      </section>
      <PremiumCapture source="vat-calculator" />
    </div>
  );
}