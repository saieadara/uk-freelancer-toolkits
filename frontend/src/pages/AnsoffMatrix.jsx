import { Download, Copy, FileText } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";
import { exportAnsoffPptx } from "../utils/pptx";

const defaultAnsoff = () => ({
  productName: "Northstar Studio",
  date: new Date().toISOString().slice(0, 10),
  marketPenetration: "Convert free users to Pro by surfacing the OCR upgrade prompt at month 1. Add 100 referral partners across UK accountancy practices to drive existing-segment growth.",
  marketDevelopment: "Localise the toolkit to Ireland and Australia where similar tax filings exist. Target accountancy partners as channel.",
  productDevelopment: "Add Open Banking + payroll-lite to the existing freelancer base. Consulting contract templates for current paid users.",
  diversification: "B2B reseller version of the toolkit for accountancy firms to white-label. Adjacent: a sister product for UK landlords.",
  riskRanking: "1 (lowest): Penetration · 2: Product development · 3: Market development · 4: Diversification.",
  recommendation: "70% of investment to penetration + product development for next 12 months. 20% to a market-development pilot in Ireland. 10% to diversification optionality (white-label v0).",
});

const guides = [
  {
    id: "marketPenetration",
    name: "Market penetration",
    risk: 1,
    criteria: "Existing products · Existing market",
    desc: "Sell more of existing products to current customers. Lowest risk — you already know the audience and the offer.",
    example: "Coca-Cola — increasing sales through promotions, advertising, and broad distribution within markets it already serves.",
  },
  {
    id: "productDevelopment",
    name: "Product development",
    risk: 2,
    criteria: "New products · Existing market",
    desc: "Build new offerings for the customers you already understand. Works when you have permission to ship adjacent products.",
    example: "Apple — iPhone, iPad, Apple Watch sold to a customer base already loyal to the brand.",
  },
  {
    id: "marketDevelopment",
    name: "Market development",
    risk: 3,
    criteria: "Existing products · New market",
    desc: "Take a working product to new geographies, segments, or channels. Adapt where needed but keep the core proposition.",
    example: "Netflix expanding country-by-country and adapting content; Starbucks taking its café model into Asia, Europe, and the Middle East.",
  },
  {
    id: "diversification",
    name: "Diversification",
    risk: 4,
    criteria: "New products · New market",
    desc: "Launch new products in new markets. Highest risk — you need new product capability and a new go-to-market.",
    example: "Amazon — moving from online retail into AWS and Prime Video, building new capabilities for distinct audiences.",
  },
];

export default function AnsoffMatrix() {
  const [matrix, setMatrix] = useLocalStorage("strategy-ansoff", defaultAnsoff());
  const previewId = "ansoff-preview";
  const update = (field, value) => setMatrix({ ...matrix, [field]: value });
  const copyDoc = async () => {
    try { await navigator.clipboard.writeText(document.getElementById(previewId)?.innerText || ""); } catch (_e) {}
  };

  return (
    <div className="m-page" id={previewId} data-testid="ansoff-page">
      <header className="m-head">
        <div className="m-head-left">
          <p className="m-eyebrow">Ansoff Matrix · Product/Market Expansion Grid</p>
          <input className="m-title" value={matrix.productName} onChange={(e) => update("productName", e.target.value)} placeholder="Untitled" />
          <div className="m-fields">
            <label className="m-field"><span className="m-field-label">Date</span><input type="date" value={matrix.date} onChange={(e) => update("date", e.target.value)} /></label>
          </div>
        </div>
        <div className="m-actions">
          <button className="m-button" onClick={copyDoc}><Copy size={14} /> Copy</button>
          <button className="m-button" onClick={() => exportAnsoffPptx(matrix)}><FileText size={14} /> PPT</button>
          <button className="m-button m-button-primary" onClick={() => downloadElementAsPdf(previewId, `${(matrix.productName || "ansoff").replace(/\s+/g, "-")}-ansoff.pdf`)}><Download size={14} /> PDF</button>
        </div>
      </header>

      <section className="m-ansoff-about" data-testid="ansoff-about">
        <div className="m-ansoff-about-cell">
          <h4>Y-axis · markets</h4>
          <p>Existing or new. New geographies, segments, or channels move you down the grid.</p>
        </div>
        <div className="m-ansoff-about-cell">
          <h4>X-axis · products</h4>
          <p>Existing or new. Adjacent or genuinely new offerings move you to the right.</p>
        </div>
        <div className="m-ansoff-about-cell">
          <h4>Strategic use</h4>
          <p>Compare growth bets, weigh risk, and decide where to focus resources. Pair with SWOT, PESTEL, or Five Forces.</p>
        </div>
        <div className="m-ansoff-about-cell">
          <h4>Limitation</h4>
          <p>Oversimplifies — focuses on products and markets, may miss operational realities or fast-moving competition.</p>
        </div>
      </section>

      <div className="m-ansoff-board" data-testid="ansoff-board">
        <div className="m-ansoff-corner">Markets ↓ / Products →</div>
        <div className="m-ansoff-col">Existing</div>
        <div className="m-ansoff-col">New</div>

        <div className="m-ansoff-row">Existing</div>
        <div className="m-ansoff-cell" data-testid="ansoff-marketPenetration">
          <div className="m-ansoff-cell-head">
            <h3>Market penetration</h3>
            <span className="m-ansoff-risk">Risk 1</span>
          </div>
          <p className="m-ansoff-cell-desc">Sell more of existing products to existing customers — promotions, loyalty, distribution depth.</p>
          <textarea className="m-textarea" value={matrix.marketPenetration} onChange={(e) => update("marketPenetration", e.target.value)} />
        </div>
        <div className="m-ansoff-cell" data-testid="ansoff-productDevelopment">
          <div className="m-ansoff-cell-head">
            <h3>Product development</h3>
            <span className="m-ansoff-risk">Risk 2</span>
          </div>
          <p className="m-ansoff-cell-desc">Build new products for the customers you already serve.</p>
          <textarea className="m-textarea" value={matrix.productDevelopment} onChange={(e) => update("productDevelopment", e.target.value)} />
        </div>

        <div className="m-ansoff-row">New</div>
        <div className="m-ansoff-cell" data-testid="ansoff-marketDevelopment">
          <div className="m-ansoff-cell-head">
            <h3>Market development</h3>
            <span className="m-ansoff-risk">Risk 3</span>
          </div>
          <p className="m-ansoff-cell-desc">Take current products to new geographies, segments, or channels.</p>
          <textarea className="m-textarea" value={matrix.marketDevelopment} onChange={(e) => update("marketDevelopment", e.target.value)} />
        </div>
        <div className="m-ansoff-cell" data-testid="ansoff-diversification">
          <div className="m-ansoff-cell-head">
            <h3>Diversification</h3>
            <span className="m-ansoff-risk">Risk 4</span>
          </div>
          <p className="m-ansoff-cell-desc">New products in new markets. Highest risk; needs new capabilities.</p>
          <textarea className="m-textarea" value={matrix.diversification} onChange={(e) => update("diversification", e.target.value)} />
        </div>
      </div>

      <p className="m-ansoff-mnemonic" data-testid="ansoff-mnemonic">
        Memory hook · <strong>Coca-Cola sells more</strong>, <strong>Apple builds newer</strong>, <strong>Netflix goes wider</strong>, <strong>Amazon branches out</strong>.
      </p>

      <section className="m-ansoff-guide" data-testid="ansoff-guide">
        {guides.map((guide) => (
          <div key={guide.id} className="m-ansoff-guide-card" data-testid={`ansoff-guide-${guide.id}`}>
            <div className="m-ansoff-guide-head">
              <span className="m-ansoff-guide-name">{guide.name}</span>
              <span className="m-ansoff-guide-risk">Risk {guide.risk}</span>
            </div>
            <span className="m-ansoff-guide-criteria">{guide.criteria}</span>
            <p className="m-ansoff-guide-desc">{guide.desc}</p>
            <p className="m-ansoff-guide-example"><strong>Example.</strong> {guide.example}</p>
          </div>
        ))}
      </section>

      <div className="m-card m-card-pad m-ansoff-foot">
        <label className="m-field" style={{ flex: 1 }}>
          <span className="m-field-label">Risk ranking (your portfolio)</span>
          <textarea className="m-textarea" value={matrix.riskRanking} onChange={(e) => update("riskRanking", e.target.value)} rows={2} />
        </label>
        <label className="m-field" style={{ flex: 1 }}>
          <span className="m-field-label">Recommendation & investment split</span>
          <textarea className="m-textarea" value={matrix.recommendation} onChange={(e) => update("recommendation", e.target.value)} rows={2} />
        </label>
      </div>

      <p className="m-ansoff-footnote" data-testid="ansoff-footnote">
        Developed by H. Igor Ansoff in 1957. Sources:
        {" "}<a href="https://www.thestrategyinstitute.org/insights/the-ansoff-matrix-a-powerful-tool-for-business-strategy-and-growth" target="_blank" rel="noreferrer">Strategy Institute</a>,
        {" "}<a href="https://corporatefinanceinstitute.com/resources/management/ansoff-matrix/" target="_blank" rel="noreferrer">CFI</a>,
        {" "}<a href="https://www.appinio.com/en-gb/blog/market-research/ansoff-matrix" target="_blank" rel="noreferrer">Appinio</a>,
        {" "}<a href="https://www.aqa.org.uk/resources/business/as-and-a-level/business-7131-7132/teach/teaching-guide-ansoff-matrix-model" target="_blank" rel="noreferrer">AQA</a>,
        {" "}<a href="https://creately.com/guides/ansoff-matrix/" target="_blank" rel="noreferrer">Creately</a>,
        {" "}<a href="https://xmind.com/blog/ansoff-matrix-strategies-examples" target="_blank" rel="noreferrer">XMind</a>,
        {" "}<a href="https://www.consuunt.com/ansoff-matrix/" target="_blank" rel="noreferrer">Consuunt</a>.
      </p>

      <PremiumCapture source="ansoff-matrix" />
    </div>
  );
}
