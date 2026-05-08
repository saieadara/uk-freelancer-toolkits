import { useMemo } from "react";
import { Plus, Trash2, Download, Copy, FileText } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";
import { exportVrioPptx } from "../utils/pptx";

const newId = () => `vrio-${Math.random().toString(36).slice(2, 8)}`;

const defaultVrio = () => ({
  productName: "UK Freelancer Toolkit",
  date: new Date().toISOString().slice(0, 10),
  resources: [
    { id: newId(), name: "UK-native compliance content", valuable: true, rare: true, imitable: true, organised: true, note: "HMRC / ICO / Companies House depth" },
    { id: newId(), name: "40+ tool library", valuable: true, rare: true, imitable: false, organised: true, note: "Breadth + speed of build" },
    { id: newId(), name: "Founder brand", valuable: true, rare: false, imitable: false, organised: true, note: "Personal trust signal" },
    { id: newId(), name: "Engineering team", valuable: true, rare: false, imitable: false, organised: true, note: "Standard talent — not a moat" },
    { id: newId(), name: "Customer email list (12k)", valuable: true, rare: true, imitable: false, organised: true, note: "Distribution advantage" },
    { id: newId(), name: "Partner network with accountants", valuable: true, rare: true, imitable: true, organised: false, note: "Underexploited; needs partner ops" },
  ],
});

const verdictOf = (r) => {
  if (!r.valuable) return { id: "disadvantage", label: "Disadvantage" };
  if (!r.rare) return { id: "parity", label: "Parity" };
  if (!r.imitable) return { id: "temporary", label: "Temporary" };
  if (!r.organised) return { id: "unused", label: "Unused" };
  return { id: "sustained", label: "Sustained advantage" };
};

const steps = [
  { id: "valuable", letter: "V", label: "Valuable" },
  { id: "rare", letter: "R", label: "Rare" },
  { id: "imitable", letter: "I", label: "Imitable" },
  { id: "organised", letter: "O", label: "Organised" },
];

export default function VrioFramework() {
  const [framework, setFramework] = useLocalStorage("strategy-vrio", defaultVrio());
  const previewId = "vrio-preview";

  const update = (field, value) => setFramework({ ...framework, [field]: value });
  const updateRow = (id, field, value) => setFramework({ ...framework, resources: framework.resources.map((r) => (r.id === id ? { ...r, [field]: value } : r)) });
  const toggleStep = (id, field) => updateRow(id, field, !framework.resources.find((r) => r.id === id)[field]);
  const removeRow = (id) => setFramework({ ...framework, resources: framework.resources.filter((r) => r.id !== id) });
  const addRow = () => setFramework({ ...framework, resources: [...framework.resources, { id: newId(), name: "New resource", valuable: false, rare: false, imitable: false, organised: false, note: "" }] });

  const ranked = useMemo(() => framework.resources.map((r) => ({ ...r, verdict: verdictOf(r) })), [framework]);
  const sustained = ranked.filter((r) => r.verdict.id === "sustained").length;

  const copyDoc = async () => {
    try { await navigator.clipboard.writeText(document.getElementById(previewId)?.innerText || ""); } catch (_e) {}
  };

  return (
    <div className="m-page" id={previewId} data-testid="vrio-page">
      <header className="m-head">
        <div className="m-head-left">
          <p className="m-eyebrow">VRIO · Resource-Based View</p>
          <input className="m-title" value={framework.productName} onChange={(e) => update("productName", e.target.value)} placeholder="Untitled" />
          <div className="m-fields">
            <label className="m-field"><span className="m-field-label">Date</span><input type="date" value={framework.date} onChange={(e) => update("date", e.target.value)} /></label>
            <label className="m-field"><span className="m-field-label">Sustained advantages</span><input value={`${sustained} / ${framework.resources.length}`} readOnly /></label>
          </div>
        </div>
        <div className="m-actions">
          <button className="m-button" onClick={copyDoc}><Copy size={14} /> Copy</button>
          <button className="m-button" onClick={() => exportVrioPptx(framework)}><FileText size={14} /> PPT</button>
          <button className="m-button m-button-primary" onClick={() => downloadElementAsPdf(previewId, `${(framework.productName || "vrio").replace(/\s+/g, "-")}-vrio.pdf`)}><Download size={14} /> PDF</button>
        </div>
      </header>

      <div className="m-vrio" data-testid="vrio-board">
        <div className="m-vrio-row m-vrio-row-head">
          <div>Resource / capability</div>
          {steps.map((s) => <div key={s.id} title={s.label}>{s.letter}</div>)}
          <div>Verdict</div>
          <div>Note</div>
          <div></div>
        </div>
        {ranked.map((r) => (
          <div key={r.id} className="m-vrio-row" data-testid={`vrio-row-${r.id}`}>
            <input className="m-vrio-name" value={r.name} onChange={(e) => updateRow(r.id, "name", e.target.value)} />
            {steps.map((step) => (
              <div key={step.id} className="m-vrio-step">
                <button
                  type="button"
                  className={r[step.id] ? "on" : ""}
                  onClick={() => toggleStep(r.id, step.id)}
                  title={`${step.label}: ${r[step.id] ? "yes" : "no"}`}
                  data-testid={`vrio-${step.id}-${r.id}`}
                >
                  {r[step.id] ? "✓" : ""}
                </button>
              </div>
            ))}
            <div className={`m-vrio-verdict ${r.verdict.id === "sustained" ? "sustained" : ""}`}>{r.verdict.label}</div>
            <input className="m-vrio-note" value={r.note} onChange={(e) => updateRow(r.id, "note", e.target.value)} />
            <button className="m-icon-button" onClick={() => removeRow(r.id)} aria-label="Remove"><Trash2 size={14} /></button>
          </div>
        ))}
        <button className="m-button m-button-ghost" onClick={addRow} style={{ justifySelf: "start", marginTop: 4 }} data-testid="vrio-add"><Plus size={14} /> Add resource</button>
      </div>

      <PremiumCapture source="vrio-framework" />
    </div>
  );
}
