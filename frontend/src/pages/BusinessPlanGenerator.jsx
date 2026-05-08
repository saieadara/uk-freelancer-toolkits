import { useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { BusinessPlanPreview } from "../components/BusinessPlanPreview";
import { TextArea, TextInput } from "../components/forms";
import { defaultBusinessPlan, planSections } from "../data/startupPlan";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";
import { downloadBusinessPlanDocx } from "../utils/businessPlanDocx";

const colourPresets = [
  { id: "blush", label: "Blush", documentColor: "#fffaf8", fontColor: "#201b1a", accentColor: "#a87d73" },
  { id: "coral", label: "Coral", documentColor: "#fff1ef", fontColor: "#251616", accentColor: "#c34f4b" },
  { id: "sage", label: "Sage", documentColor: "#f4f8f1", fontColor: "#172018", accentColor: "#5f7f62" },
  { id: "navy", label: "Navy", documentColor: "#f4f7fb", fontColor: "#101826", accentColor: "#355c8a" },
  { id: "mono", label: "Mono", documentColor: "#ffffff", fontColor: "#151515", accentColor: "#575757" },
];

const fieldGroups = {
  overview: [
    ["companyName", "Company name", "input"], ["tagline", "Tagline", "input"], ["founderName", "Founder name", "input"], ["year", "Plan year", "input"], ["preparedFor", "Prepared for", "input"], ["contactEmail", "Contact email", "input"], ["executiveSummary", "Executive summary", "textarea"],
  ],
  vision: [["vision", "Vision", "textarea"], ["mission", "Mission", "textarea"], ["values", "Values", "textarea"]],
  business: [["legalStructure", "Legal structure", "input"], ["location", "Location", "input"], ["products", "Products / services", "textarea"], ["revenueModel", "Revenue model", "textarea"]],
  client: [["targetClient", "Target client", "textarea"], ["clientPainPoints", "Client pain points", "textarea"], ["clientOutcome", "Client outcome", "textarea"]],
  marketing: [["marketingChannels", "Marketing channels", "textarea"], ["launchOffer", "Launch offer", "textarea"], ["pricingStrategy", "Pricing strategy", "textarea"]],
  competitive: [["competitors", "Competitors", "textarea"], ["competitiveAdvantage", "Competitive advantage", "textarea"], ["strengths", "Strengths", "textarea"], ["weaknesses", "Weaknesses", "textarea"], ["opportunities", "Opportunities", "textarea"], ["threats", "Threats", "textarea"]],
  financial: [["startupCosts", "Startup costs", "textarea"], ["monthlyCosts", "Monthly costs", "textarea"], ["fundingNeeded", "Funding needed", "textarea"], ["revenueGoal", "Revenue goal", "textarea"]],
  future: [["milestones", "Milestones", "textarea"], ["smartGoals", "SMART goals", "textarea"]],
  team: [["team", "Team", "textarea"], ["actionChecklist", "Action checklist", "textarea"], ["closingNote", "Closing note", "textarea"]],
};

export default function BusinessPlanGenerator() {
  const [plan, setPlan] = useLocalStorage("startup-business-plan", defaultBusinessPlan());
  const [activeSection, setActiveSection] = useState("overview");
  const previewId = "business-plan-pdf-preview";
  const activeFields = useMemo(() => fieldGroups[activeSection] || fieldGroups.overview, [activeSection]);
  const update = (field, value) => setPlan({ ...plan, [field]: value });
  const applyColourPreset = (preset) => setPlan({ ...plan, documentColor: preset.documentColor, fontColor: preset.fontColor, accentColor: preset.accentColor });

  return (
    <div className="tool-page business-plan-generator" data-testid="business-plan-generator-page">
      <section className="tool-intro" data-testid="business-plan-intro-section">
        <div>
          <p className="eyebrow" data-testid="business-plan-eyebrow">Startup Toolkit</p>
          <h1 data-testid="business-plan-title">Startup Business Plan Document Generator</h1>
          <p data-testid="business-plan-description">Create a full editable business plan with guided fields, page-by-page preview, PDF export, and a real Word `.docx` download.</p>
        </div>
        <div className="hero-actions export-actions" data-testid="business-plan-export-actions">
          <button className="secondary-button" onClick={() => downloadBusinessPlanDocx(plan)} data-testid="business-plan-download-docx-button"><FileText size={17} /> Download Word</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${plan.companyName || "business-plan"}.pdf`)} data-testid="business-plan-download-pdf-button"><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="startup-builder-layout" data-testid="business-plan-builder-layout">
        <aside className="startup-section-menu" data-testid="business-plan-section-menu">
          {planSections.map((section) => (
            <button key={section.id} className={activeSection === section.id ? "active" : ""} onClick={() => setActiveSection(section.id)} data-testid={`business-plan-section-button-${section.id}`}>
              {section.label}
            </button>
          ))}
        </aside>

        <div className="builder-panel startup-form-panel" data-testid="business-plan-form-panel">
          <div className="section-heading-row">
            <h3 data-testid="business-plan-active-section-title">{planSections.find((item) => item.id === activeSection)?.label}</h3>
            <span className="form-message" data-testid="business-plan-save-message">Saved locally as you type</span>
          </div>
          <section className="colour-customizer" data-testid="business-plan-colour-customizer">
            <div className="section-heading-row">
              <h3 data-testid="business-plan-colour-title">Customize colours</h3>
              <span className="form-message" data-testid="business-plan-colour-help">Applies to preview, PDF, and Word</span>
            </div>
            <div className="colour-preset-row" data-testid="business-plan-colour-presets">
              {colourPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="colour-preset-button"
                  onClick={() => applyColourPreset(preset)}
                  data-testid={`business-plan-colour-preset-${preset.id}`}
                  aria-label={`Apply ${preset.label} colour preset`}
                >
                  <span style={{ background: preset.documentColor }} data-testid={`business-plan-colour-preset-bg-${preset.id}`} />
                  <span style={{ background: preset.fontColor }} data-testid={`business-plan-colour-preset-font-${preset.id}`} />
                  <span style={{ background: preset.accentColor }} data-testid={`business-plan-colour-preset-accent-${preset.id}`} />
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="colour-input-grid" data-testid="business-plan-colour-input-grid">
              <label className="colour-field" data-testid="business-plan-document-colour-field">
                <span data-testid="business-plan-document-colour-label">Document colour</span>
                <input type="color" value={plan.documentColor || "#fffaf8"} onChange={(event) => update("documentColor", event.target.value)} data-testid="business-plan-document-colour-input" />
              </label>
              <label className="colour-field" data-testid="business-plan-font-colour-field">
                <span data-testid="business-plan-font-colour-label">Font colour</span>
                <input type="color" value={plan.fontColor || "#201b1a"} onChange={(event) => update("fontColor", event.target.value)} data-testid="business-plan-font-colour-input" />
              </label>
              <label className="colour-field" data-testid="business-plan-accent-colour-field">
                <span data-testid="business-plan-accent-colour-label">Accent colour</span>
                <input type="color" value={plan.accentColor || "#a87d73"} onChange={(event) => update("accentColor", event.target.value)} data-testid="business-plan-accent-colour-input" />
              </label>
            </div>
          </section>
          <div className="startup-field-grid" data-testid="business-plan-field-grid">
            {activeFields.map(([field, label, type]) => type === "textarea" ? (
              <TextArea key={field} id={`business-plan-${field}`} label={label} value={plan[field]} onChange={(value) => update(field, value)} rows={field === "executiveSummary" ? 6 : 4} />
            ) : (
              <TextInput key={field} id={`business-plan-${field}`} label={label} value={plan[field]} onChange={(value) => update(field, value)} />
            ))}
          </div>
        </div>

        <div className="startup-document-shell" data-testid="business-plan-preview-shell">
          <BusinessPlanPreview plan={plan} previewId={previewId} />
        </div>
      </section>
    </div>
  );
}