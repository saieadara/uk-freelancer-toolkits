import { useMemo, useState } from "react";
import { Plus, Trash2, PieChart } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { formatMoney } from "../utils/calculations";

const defaultFounders = () => [
  { id: "founder-1", name: "Founder A", shares: 600000 },
  { id: "founder-2", name: "Founder B", shares: 400000 },
];

const defaultSafes = () => [
  { id: "safe-1", investor: "Angel Round", amount: 50000, valuationCap: 1500000, discount: 20 },
];

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export default function CapTableBuilder() {
  const [founders, setFounders] = useState(defaultFounders());
  const [optionsPoolPercent, setOptionsPoolPercent] = useState(10);
  const [safes, setSafes] = useState(defaultSafes());
  const [priceRoundAmount, setPriceRoundAmount] = useState(500000);
  const [preMoney, setPreMoney] = useState(4000000);

  const updateFounder = (id, field, value) => {
    setFounders((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const removeFounder = (id) => {
    setFounders((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  };

  const addFounder = () => {
    setFounders((prev) => [...prev, { id: newId("founder"), name: `Founder ${prev.length + 1}`, shares: 100000 }]);
  };

  const updateSafe = (id, field, value) => {
    setSafes((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const removeSafe = (id) => {
    setSafes((prev) => prev.filter((row) => row.id !== id));
  };

  const addSafe = () => {
    setSafes((prev) => [...prev, { id: newId("safe"), investor: "New SAFE", amount: 25000, valuationCap: 2000000, discount: 20 }]);
  };

  const summary = useMemo(() => {
    const founderShares = founders.reduce((sum, row) => sum + Number(row.shares || 0), 0);
    const totalAmount = Number(priceRoundAmount || 0);
    const preMoneyVal = Number(preMoney || 0);
    const postMoney = preMoneyVal + totalAmount;
    const pricePerShare = founderShares > 0 ? preMoneyVal / founderShares : 0;

    const safeRows = safes.map((safe) => {
      const amount = Number(safe.amount || 0);
      const cap = Number(safe.valuationCap || 0);
      const discount = Number(safe.discount || 0) / 100;
      const capPrice = cap > 0 && founderShares > 0 ? cap / founderShares : 0;
      const discountPrice = pricePerShare * (1 - discount);
      const conversionPrice = capPrice && discountPrice
        ? Math.min(capPrice, discountPrice)
        : capPrice || discountPrice || pricePerShare;
      const shares = conversionPrice > 0 ? amount / conversionPrice : 0;
      return { ...safe, conversionPrice, shares };
    });

    const safeShares = safeRows.reduce((sum, row) => sum + row.shares, 0);
    const newRoundShares = pricePerShare > 0 ? totalAmount / pricePerShare : 0;
    const sharesBeforeOptions = founderShares + safeShares + newRoundShares;
    const desiredOptionShare = Number(optionsPoolPercent || 0) / 100;
    const optionsShares = desiredOptionShare > 0 && desiredOptionShare < 1
      ? (sharesBeforeOptions * desiredOptionShare) / (1 - desiredOptionShare)
      : 0;
    const totalShares = sharesBeforeOptions + optionsShares;

    const buildRow = (label, shares) => ({
      label,
      shares,
      percent: totalShares > 0 ? (shares / totalShares) * 100 : 0,
    });

    const rows = [
      ...founders.map((row) => buildRow(row.name || "Founder", Number(row.shares || 0))),
      buildRow("Options pool", optionsShares),
      ...safeRows.map((row) => buildRow(row.investor || "SAFE investor", row.shares)),
      buildRow("New money round", newRoundShares),
    ];

    return {
      rows,
      totals: { totalShares, postMoney, pricePerShare, founderShares, safeShares, newRoundShares, optionsShares },
    };
  }, [founders, safes, priceRoundAmount, preMoney, optionsPoolPercent]);

  return (
    <div className="page narrow-page" data-testid="cap-table-page">
      <section className="tool-intro" data-testid="cap-table-intro-section">
        <div>
          <p className="eyebrow"><PieChart size={14} /> Founder ownership</p>
          <h1>Cap Table Builder</h1>
          <p>Model founder ownership, an options pool top-up, SAFE conversions, and a priced round in one screen. Adjust numbers to see fully-diluted ownership update instantly.</p>
        </div>
      </section>

      <section className="calculator-panel" data-testid="cap-table-founders-panel">
        <div className="panel-heading">
          <h2>Founders</h2>
          <button className="secondary-button" onClick={addFounder} data-testid="cap-table-add-founder"><Plus size={16} /> Add founder</button>
        </div>
        <div className="line-items" data-testid="cap-table-founders-list">
          {founders.map((founder) => (
            <div key={founder.id} className="line-item-row">
              <input value={founder.name} onChange={(event) => updateFounder(founder.id, "name", event.target.value)} placeholder="Name" />
              <input type="number" value={founder.shares} onChange={(event) => updateFounder(founder.id, "shares", event.target.value)} placeholder="Shares" />
              <button className="icon-button" onClick={() => removeFounder(founder.id)} disabled={founders.length === 1} aria-label="Remove founder"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel" data-testid="cap-table-pool-panel">
        <h2>Options pool</h2>
        <div className="calculator-inputs">
          <label>Target options pool (%)
            <input type="number" min="0" max="50" value={optionsPoolPercent} onChange={(event) => setOptionsPoolPercent(event.target.value)} />
          </label>
        </div>
        <p className="form-message">Pool is added pre-money so existing holders absorb the dilution before the round prices.</p>
      </section>

      <section className="calculator-panel" data-testid="cap-table-safes-panel">
        <div className="panel-heading">
          <h2>SAFEs / convertibles</h2>
          <button className="secondary-button" onClick={addSafe} data-testid="cap-table-add-safe"><Plus size={16} /> Add SAFE</button>
        </div>
        <div className="line-items" data-testid="cap-table-safes-list">
          {safes.map((safe) => (
            <div key={safe.id} className="line-item-row safe-row">
              <input value={safe.investor} onChange={(event) => updateSafe(safe.id, "investor", event.target.value)} placeholder="Investor" />
              <input type="number" value={safe.amount} onChange={(event) => updateSafe(safe.id, "amount", event.target.value)} placeholder="Amount" />
              <input type="number" value={safe.valuationCap} onChange={(event) => updateSafe(safe.id, "valuationCap", event.target.value)} placeholder="Cap" />
              <input type="number" value={safe.discount} onChange={(event) => updateSafe(safe.id, "discount", event.target.value)} placeholder="Discount %" />
              <button className="icon-button" onClick={() => removeSafe(safe.id)} aria-label="Remove SAFE"><Trash2 size={16} /></button>
            </div>
          ))}
          {safes.length === 0 && <p className="form-message">No SAFEs added. Click "Add SAFE" to model convertible notes.</p>}
        </div>
      </section>

      <section className="calculator-panel" data-testid="cap-table-round-panel">
        <h2>Priced round</h2>
        <div className="calculator-inputs">
          <label>New investment (£)
            <input type="number" min="0" value={priceRoundAmount} onChange={(event) => setPriceRoundAmount(event.target.value)} />
          </label>
          <label>Pre-money valuation (£)
            <input type="number" min="0" value={preMoney} onChange={(event) => setPreMoney(event.target.value)} />
          </label>
        </div>
        <div className="result-grid">
          <div><span>Post-money</span><strong>{formatMoney(summary.totals.postMoney)}</strong></div>
          <div><span>Price per share</span><strong>{formatMoney(summary.totals.pricePerShare)}</strong></div>
          <div><span>Total shares</span><strong>{Math.round(summary.totals.totalShares).toLocaleString()}</strong></div>
        </div>
      </section>

      <section className="calculator-panel" data-testid="cap-table-summary-panel">
        <h2>Fully-diluted ownership</h2>
        <ul className="check-list" data-testid="cap-table-rows">
          {summary.rows.map((row, index) => (
            <li key={`${row.label}-${index}`} className="pass">
              <strong>{row.label}</strong>
              <span>{Math.round(row.shares).toLocaleString()} shares · {row.percent.toFixed(2)}%</span>
            </li>
          ))}
        </ul>
      </section>

      <PremiumCapture source="cap-table-builder" />
    </div>
  );
}
