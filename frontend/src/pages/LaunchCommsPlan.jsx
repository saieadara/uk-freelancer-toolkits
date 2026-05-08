import { useMemo } from "react";
import { Megaphone, Download, Copy } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultLaunchCommsPlan } from "../data/product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const factFields = [
  { id: "featureName", label: "Feature name" },
  { id: "oneLine", label: "One-line description", textarea: true },
  { id: "audience", label: "Audience", textarea: true },
  { id: "launchDate", label: "Launch date", type: "date" },
  { id: "pricing", label: "Pricing / availability", textarea: true },
  { id: "callToAction", label: "Primary call-to-action" },
  { id: "hero", label: "Hero line / headline" },
  { id: "benefits", label: "Top benefits / proof", textarea: true },
  { id: "internalSlackOwner", label: "Internal post owner" },
  { id: "blogAuthor", label: "Blog byline" },
  { id: "customerSenderName", label: "Customer email sender" },
  { id: "customerSenderRole", label: "Sender role / signature" },
  { id: "salesAudience", label: "Sales one-pager audience", textarea: true },
];

export default function LaunchCommsPlan() {
  const [plan, setPlan] = useLocalStorage("product-launch-comms", defaultLaunchCommsPlan());
  const previewId = "launch-comms-preview";

  const update = (field, value) => setPlan({ ...plan, [field]: value });

  const slack = useMemo(() => `:rocket: *Shipping ${plan.featureName}* on ${plan.launchDate}.

${plan.oneLine}

*Why it matters:* ${plan.hero}
*Audience:* ${plan.audience}
*Availability:* ${plan.pricing}

How to talk about it externally:
- ${plan.benefits.split("\n").join("\n- ")}

Action for you: ${plan.callToAction}.
Owner: <@${plan.internalSlackOwner}>. Questions in the thread.`, [plan]);

  const blog = useMemo(() => `# ${plan.hero}

By ${plan.blogAuthor} · Published ${plan.launchDate}

${plan.oneLine}

## Why we built it
${plan.audience} kept telling us the same thing. Today we're shipping ${plan.featureName} to fix it.

## What it does
${plan.benefits}

## How to get started
${plan.callToAction}.

## Pricing
${plan.pricing}`, [plan]);

  const customerEmail = useMemo(() => `Subject: ${plan.featureName} is live — ${plan.hero}

Hi {first_name},

${plan.oneLine}

Here's what changes for you:
${plan.benefits}

You can ${plan.callToAction.toLowerCase()} from your dashboard. Pricing: ${plan.pricing}.

If you have questions, reply to this email — it goes straight to me.

— ${plan.customerSenderName}
${plan.customerSenderRole}`, [plan]);

  const onePager = useMemo(() => `${plan.featureName} — Sales one-pager (${plan.launchDate})

Audience: ${plan.salesAudience}

Pitch in one line: ${plan.oneLine}

Why it matters: ${plan.hero}

Talking points:
- ${plan.benefits.split("\n").join("\n- ")}

Pricing: ${plan.pricing}
Primary call-to-action: ${plan.callToAction}
Audience: ${plan.audience}`, [plan]);

  const sections = [
    { id: "slack", label: "Internal Slack post", body: slack },
    { id: "blog", label: "Blog draft", body: blog },
    { id: "email", label: "Customer email", body: customerEmail },
    { id: "onepager", label: "Sales one-pager", body: onePager },
  ];

  const copySection = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  const copyAll = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="launch-comms-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Megaphone size={14} /> Product Management</p>
          <h1>Launch Comms Plan</h1>
          <p>One launch brief, four ready-to-send outputs: internal Slack post, blog draft, customer email, sales one-pager. Edit the brief — the four outputs update live.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyAll}><Copy size={17} /> Copy all</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(plan.featureName || "launch").replace(/\s+/g, "-")}-launch-comms.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel" data-testid="launch-comms-brief-panel">
        <h2>Launch brief (single source of truth)</h2>
        <div className="hiring-form-grid">
          {factFields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={plan[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`launch-field-${field.id}`} />
                : <input type={field.type || "text"} value={plan[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`launch-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel" data-testid="launch-comms-output-panel">
        <h2>Outputs</h2>
        <div className="launch-output-grid">
          {sections.map((section) => (
            <div key={section.id} className="launch-output-card" data-testid={`launch-output-${section.id}`}>
              <div className="launch-output-head">
                <h3>{section.label}</h3>
                <button className="text-button" onClick={() => copySection(section.body)}><Copy size={14} /> Copy</button>
              </div>
              <pre className="launch-output-body">{section.body}</pre>
            </div>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Combined preview</h2>
        <div id={previewId} className="hiring-document" data-testid="launch-comms-preview">
          <header>
            <p className="eyebrow">Launch Comms Plan</p>
            <h1>{plan.featureName}</h1>
            <p>Launch date {plan.launchDate} · {plan.audience}</p>
          </header>
          {sections.map((section) => (
            <div key={section.id}>
              <h2>{section.label}</h2>
              <pre className="launch-preview-body">{section.body}</pre>
            </div>
          ))}
        </div>
      </section>

      <PremiumCapture source="launch-comms-plan" />
    </div>
  );
}
