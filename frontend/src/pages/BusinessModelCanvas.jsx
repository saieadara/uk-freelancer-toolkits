import { Download, Copy, FileText } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";
import { exportBmcPptx } from "../utils/pptx";

const defaultBmc = () => ({
  productName: "UK Freelancer Toolkit",
  date: new Date().toISOString().slice(0, 10),
  segments: "UK freelancers (£20-100k/yr); first-time UK founders (0-18 months); small UK service agencies (2-10 people); accidental managers (PMs/BAs).",
  value: "Generate UK-correct business documents in under 5 minutes — invoices, contracts, plans, decks, policies, frameworks. UK-native by default; no lawyer or accountant required.",
  channels: "Direct: SEO landing pages per tool. Partner: accountancy practices, founder Slack groups. Word-of-mouth via shareable PDF outputs.",
  relationships: "Self-serve free + Pro tier (£29/mo). Email support on Pro. Optional human review marketplace as upsell.",
  revenue: "Free tier (lead gen). Pro subscription (£29/mo). Document packs (£19-49). White-label for accountancy firms (£99-299/mo). Affiliate revenue from Stripe / Tide / Vestd.",
  resources: "Tool library (40+ generators). UK-compliance content. Brand. Email list. localStorage-only architecture (low infra cost).",
  activities: "Tool development. SEO content. Compliance updates (HMRC / ICO / Companies House). Customer onboarding. Partner enablement.",
  partners: "TrueLayer (Open Banking). Stripe (payments). Postmark (email). Accountancy practice networks. Vestd / SeedLegals (cap-table partners).",
  cost: "Engineering (largest). Content / compliance updates. Hosting (low — static + serverless). Marketing. Vendor cost (TrueLayer, OCR providers).",
  riskiestAssumption: "First-time founders will trust an automated UK contract output enough to send it without a lawyer review.",
});

const blocks = [
  { id: "partners", label: "Key partners", className: "m-bmc-partners", sub: "Strategic suppliers and alliances" },
  { id: "activities", label: "Key activities", className: "m-bmc-activities", sub: "Critical things you must do" },
  { id: "resources", label: "Key resources", className: "m-bmc-resources", sub: "Assets you depend on" },
  { id: "value", label: "Value proposition", className: "m-bmc-value", sub: "The promise — outcome over feature" },
  { id: "relationships", label: "Customer relationships", className: "m-bmc-relationships", sub: "How you acquire, keep, grow" },
  { id: "channels", label: "Channels", className: "m-bmc-channels", sub: "Where the value reaches the customer" },
  { id: "segments", label: "Customer segments", className: "m-bmc-segments", sub: "Who you serve" },
  { id: "cost", label: "Cost structure", className: "m-bmc-cost", sub: "What it costs to operate" },
  { id: "revenue", label: "Revenue streams", className: "m-bmc-revenue", sub: "How money comes back" },
];

export default function BusinessModelCanvas() {
  const [bmc, setBmc] = useLocalStorage("strategy-bmc", defaultBmc());
  const previewId = "bmc-preview";
  const update = (field, value) => setBmc({ ...bmc, [field]: value });
  const copyDoc = async () => {
    try { await navigator.clipboard.writeText(document.getElementById(previewId)?.innerText || ""); } catch (_e) {}
  };

  return (
    <div className="m-page" id={previewId} data-testid="bmc-page">
      <header className="m-head">
        <div className="m-head-left">
          <p className="m-eyebrow">Business Model Canvas · Osterwalder</p>
          <input className="m-title" value={bmc.productName} onChange={(e) => update("productName", e.target.value)} placeholder="Untitled" />
          <div className="m-fields">
            <label className="m-field"><span className="m-field-label">Date</span><input type="date" value={bmc.date} onChange={(e) => update("date", e.target.value)} /></label>
          </div>
        </div>
        <div className="m-actions">
          <button className="m-button" onClick={copyDoc}><Copy size={14} /> Copy</button>
          <button className="m-button" onClick={() => exportBmcPptx(bmc)}><FileText size={14} /> PPT</button>
          <button className="m-button m-button-primary" onClick={() => downloadElementAsPdf(previewId, `${(bmc.productName || "bmc").replace(/\s+/g, "-")}-bmc.pdf`)}><Download size={14} /> PDF</button>
        </div>
      </header>

      <div className="m-bmc" data-testid="bmc-canvas">
        {blocks.map((block) => (
          <div key={block.id} className={`m-bmc-cell ${block.className}`} data-testid={`bmc-${block.id}`}>
            <div>
              <h3>{block.label}</h3>
              <p className="m-bmc-sub">{block.sub}</p>
            </div>
            <textarea className="m-textarea" value={bmc[block.id] || ""} onChange={(e) => update(block.id, e.target.value)} />
          </div>
        ))}
      </div>

      <div className="m-card m-card-pad">
        <label className="m-field">
          <span className="m-field-label">Riskiest assumption to test next</span>
          <textarea className="m-textarea" value={bmc.riskiestAssumption} onChange={(e) => update("riskiestAssumption", e.target.value)} rows={2} />
        </label>
      </div>

      <PremiumCapture source="business-model-canvas" />
    </div>
  );
}
