import { useMemo } from "react";
import { Download, Copy, FileText } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";
import { exportPestelPptx } from "../utils/pptx";

const defaultPestel = () => ({
  productName: "UK Freelancer Toolkit",
  scope: "UK SME admin software · 3-year horizon",
  date: new Date().toISOString().slice(0, 10),
  factors: {
    political: { items: "MTD-style digital tax expansion. Public-sector procurement reform. Brexit-era data-flow rules with EU.", impact: 4 },
    economic: { items: "UK SME formation rate, freelancer day rates, VAT registration threshold trajectory, IR35 enforcement intensity.", impact: 5 },
    social: { items: "Rise of solopreneur / portfolio careers. Founder-friendly Reddit / Twitter communities. Trust deficit toward generic templates.", impact: 4 },
    technology: { items: "Open Banking maturity. UK GDPR-compliant LLM availability. Cheap PDF/Word export libraries. Mobile-first expectations.", impact: 5 },
    environmental: { items: "Light direct exposure. Indirect: reporting requirements pushing into SME tier (CSRD ripple, supplier ESG asks).", impact: 2 },
    legal: { items: "UK GDPR + ICO enforcement. PSD2 90-day re-auth. EMI scheme rules (HMRC). Companies House filings. Consumer Rights Act.", impact: 4 },
  },
  topForces: "1. UK regulatory tailwind (MTD + Open Banking) 2. Tech maturity (LLMs + UK GDPR-compliant infrastructure) 3. Macro pressure on SME margins driving tool-substitution.",
  implications: "Lean into UK-native compliance moat. Invest in OCR + Open Banking. Add MTD-style export hooks before competitor.",
});

const factors = [
  { id: "political", letter: "P", label: "Political" },
  { id: "economic", letter: "E", label: "Economic" },
  { id: "social", letter: "S", label: "Social" },
  { id: "technology", letter: "T", label: "Technological" },
  { id: "environmental", letter: "E", label: "Environmental" },
  { id: "legal", letter: "L", label: "Legal" },
];

export default function PestelAnalysis() {
  const [pestel, setPestel] = useLocalStorage("strategy-pestel", defaultPestel());
  const previewId = "pestel-preview";

  const update = (field, value) => setPestel({ ...pestel, [field]: value });
  const updateFactor = (id, field, value) => setPestel({ ...pestel, factors: { ...pestel.factors, [id]: { ...pestel.factors[id], [field]: field === "impact" ? Math.max(1, Math.min(5, Number(value))) : value } } });

  const totalImpact = useMemo(() => Object.values(pestel.factors).reduce((sum, f) => sum + Number(f.impact || 0), 0), [pestel]);

  const copyDoc = async () => {
    try { await navigator.clipboard.writeText(document.getElementById(previewId)?.innerText || ""); } catch (_e) {}
  };

  return (
    <div className="m-page" id={previewId} data-testid="pestel-page">
      <header className="m-head">
        <div className="m-head-left">
          <p className="m-eyebrow">PESTEL · macro scan</p>
          <input className="m-title" value={pestel.productName} onChange={(e) => update("productName", e.target.value)} placeholder="Untitled" />
          <div className="m-fields">
            <label className="m-field"><span className="m-field-label">Scope</span><input value={pestel.scope} onChange={(e) => update("scope", e.target.value)} /></label>
            <label className="m-field"><span className="m-field-label">Date</span><input type="date" value={pestel.date} onChange={(e) => update("date", e.target.value)} /></label>
            <label className="m-field"><span className="m-field-label">Total impact</span><input value={`${totalImpact} / 30`} readOnly /></label>
          </div>
        </div>
        <div className="m-actions">
          <button className="m-button" onClick={copyDoc}><Copy size={14} /> Copy</button>
          <button className="m-button" onClick={() => exportPestelPptx(pestel)}><FileText size={14} /> PPT</button>
          <button className="m-button m-button-primary" onClick={() => downloadElementAsPdf(previewId, `${(pestel.productName || "pestel").replace(/\s+/g, "-")}-pestel.pdf`)}><Download size={14} /> PDF</button>
        </div>
      </header>

      <div className="m-pestel-wall" data-testid="pestel-wall">
        {factors.map((factor) => {
          const value = pestel.factors[factor.id];
          return (
            <div key={factor.id} className="m-pestel-tile" data-testid={`pestel-${factor.id}`}>
              <div className="m-pestel-tile-head">
                <span className="m-pestel-letter">{factor.letter}</span>
                <span className="m-pestel-name">{factor.label}</span>
                <input type="number" min="1" max="5" className="m-pestel-impact-input" value={value.impact} onChange={(e) => updateFactor(factor.id, "impact", e.target.value)} aria-label={`${factor.label} impact`} />
              </div>
              <div className="m-pestel-impact" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`m-pestel-dot ${n <= value.impact ? "on" : ""}`} />)}
              </div>
              <textarea className="m-textarea" value={value.items} onChange={(e) => updateFactor(factor.id, "items", e.target.value)} placeholder={`Forces under ${factor.label.toLowerCase()}`} />
            </div>
          );
        })}
      </div>

      <div className="m-pestel-foot">
        <label className="m-card m-card-pad m-field">
          <span className="m-field-label">Top 3 forces</span>
          <textarea className="m-textarea" value={pestel.topForces} onChange={(e) => update("topForces", e.target.value)} rows={3} />
        </label>
        <label className="m-card m-card-pad m-field">
          <span className="m-field-label">Strategic implications</span>
          <textarea className="m-textarea" value={pestel.implications} onChange={(e) => update("implications", e.target.value)} rows={3} />
        </label>
      </div>

      <PremiumCapture source="pestel-analysis" />
    </div>
  );
}
