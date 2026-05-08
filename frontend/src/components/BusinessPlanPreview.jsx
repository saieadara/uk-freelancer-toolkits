const PlanPage = ({ label, title, children, className = "" }) => (
  <article className={`plan-page ${className}`} data-testid={`business-plan-page-${label}`}>
    <div className="plan-page-label" data-testid={`business-plan-page-label-${label}`}>{label}</div>
    <h2 data-testid={`business-plan-page-title-${label}`}>{title}</h2>
    {children}
  </article>
);

const TextBlock = ({ eyebrow, title, text, testId }) => (
  <div className="plan-text-block" data-testid={testId}>
    <span>{eyebrow}</span>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

const Lines = ({ text, testId }) => (
  <ul className="plan-line-list" data-testid={testId}>
    {String(text || "").split("\n").filter(Boolean).map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}
  </ul>
);

const normalizeHex = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;

const blendHex = (first, second, firstWeight = 0.5) => {
  const expand = (hex) => hex.replace("#", "").match(/.{2}/g).map((part) => parseInt(part, 16));
  const [r1, g1, b1] = expand(first);
  const [r2, g2, b2] = expand(second);
  const mix = (a, b) => Math.round(a * firstWeight + b * (1 - firstWeight)).toString(16).padStart(2, "0");
  return `#${mix(r1, r2)}${mix(g1, g2)}${mix(b1, b2)}`;
};

const buildPlanColourVars = (plan) => {
  const bg = normalizeHex(plan.documentColor, "#fffaf8");
  const text = normalizeHex(plan.fontColor, "#201b1a");
  const accent = normalizeHex(plan.accentColor, "#a87d73");
  return {
    "--plan-bg": bg,
    "--plan-text": text,
    "--plan-accent": accent,
    "--plan-bg-alt": blendHex(bg, "#ffffff", 0.42),
    "--plan-border": blendHex(accent, "#ffffff", 0.38),
    "--plan-cover-start": blendHex(bg, accent, 0.72),
    "--plan-muted-text": blendHex(text, "#ffffff", 0.78),
    "--plan-meta-text": blendHex(text, accent, 0.76),
    "--plan-card-bg": blendHex(bg, accent, 0.72),
    "--plan-block-bg": blendHex(bg, "#ffffff", 0.38),
  };
};

export const BusinessPlanPreview = ({ plan, previewId }) => (
  <section
    id={previewId}
    className="business-plan-document"
    data-testid="business-plan-document-preview"
    style={buildPlanColourVars(plan)}
  >
    <PlanPage label="Cover" title={plan.companyName} className="cover-page">
      <p className="plan-tagline" data-testid="business-plan-cover-tagline">{plan.tagline}</p>
      <div className="cover-meta" data-testid="business-plan-cover-meta">
        <span>Business Plan</span>
        <span>{plan.year}</span>
        <span>Prepared by {plan.founderName}</span>
      </div>
      <div className="cover-card" data-testid="business-plan-cover-card">Prepared for: {plan.preparedFor}</div>
    </PlanPage>

    <PlanPage label="01" title="Executive Summary">
      <p className="lead-copy" data-testid="business-plan-executive-summary-preview">{plan.executiveSummary}</p>
      <div className="mini-insight-grid" data-testid="business-plan-summary-insights">
        <TextBlock eyebrow="Offer" title="Launch Offer" text={plan.launchOffer} testId="business-plan-summary-offer" />
        <TextBlock eyebrow="Revenue" title="Revenue Model" text={plan.revenueModel} testId="business-plan-summary-revenue" />
      </div>
    </PlanPage>

    <PlanPage label="02" title="Vision & Mission">
      <div className="two-panel-page" data-testid="business-plan-vision-grid">
        <TextBlock eyebrow="Vision" title="Where the business is going" text={plan.vision} testId="business-plan-vision-preview" />
        <TextBlock eyebrow="Mission" title="What the business does" text={plan.mission} testId="business-plan-mission-preview" />
        <TextBlock eyebrow="Values" title="Operating principles" text={plan.values} testId="business-plan-values-preview" />
      </div>
    </PlanPage>

    <PlanPage label="03" title="Business Structure">
      <div className="plan-fact-table" data-testid="business-plan-structure-table">
        <div><span>Legal structure</span><strong>{plan.legalStructure}</strong></div>
        <div><span>Location</span><strong>{plan.location}</strong></div>
        <div><span>Products / services</span><strong>{plan.products}</strong></div>
        <div><span>Revenue model</span><strong>{plan.revenueModel}</strong></div>
      </div>
    </PlanPage>

    <PlanPage label="04" title="Ideal Client">
      <div className="persona-layout" data-testid="business-plan-client-layout">
        <div className="persona-badge" data-testid="business-plan-client-badge">Ideal Client</div>
        <TextBlock eyebrow="Audience" title="Target client" text={plan.targetClient} testId="business-plan-target-client-preview" />
        <TextBlock eyebrow="Pain" title="Problems to solve" text={plan.clientPainPoints} testId="business-plan-client-pain-preview" />
        <TextBlock eyebrow="Outcome" title="Client transformation" text={plan.clientOutcome} testId="business-plan-client-outcome-preview" />
      </div>
    </PlanPage>

    <PlanPage label="05" title="Marketing Strategy">
      <div className="two-panel-page" data-testid="business-plan-marketing-grid">
        <TextBlock eyebrow="Channels" title="How clients find us" text={plan.marketingChannels} testId="business-plan-marketing-channels-preview" />
        <TextBlock eyebrow="Offer" title="Launch offer" text={plan.launchOffer} testId="business-plan-launch-offer-preview" />
        <TextBlock eyebrow="Pricing" title="Pricing strategy" text={plan.pricingStrategy} testId="business-plan-pricing-preview" />
      </div>
    </PlanPage>

    <PlanPage label="06" title="Competitive Analysis">
      <div className="two-panel-page" data-testid="business-plan-competitive-grid">
        <TextBlock eyebrow="Market" title="Competitors" text={plan.competitors} testId="business-plan-competitors-preview" />
        <TextBlock eyebrow="Edge" title="Competitive advantage" text={plan.competitiveAdvantage} testId="business-plan-advantage-preview" />
      </div>
      <h3 className="plan-subsection-heading" data-testid="business-plan-swot-heading">SWOT</h3>
      <div className="swot-grid" data-testid="business-plan-swot-grid">
        <TextBlock eyebrow="S" title="Strengths" text={plan.strengths} testId="business-plan-strengths-preview" />
        <TextBlock eyebrow="W" title="Weaknesses" text={plan.weaknesses} testId="business-plan-weaknesses-preview" />
        <TextBlock eyebrow="O" title="Opportunities" text={plan.opportunities} testId="business-plan-opportunities-preview" />
        <TextBlock eyebrow="T" title="Threats" text={plan.threats} testId="business-plan-threats-preview" />
      </div>
    </PlanPage>

    <PlanPage label="07" title="Financial Outlook">
      <div className="financial-columns" data-testid="business-plan-financial-columns">
        <div><h3>Startup costs</h3><Lines text={plan.startupCosts} testId="business-plan-startup-costs-preview" /></div>
        <div><h3>Monthly costs</h3><Lines text={plan.monthlyCosts} testId="business-plan-monthly-costs-preview" /></div>
      </div>
      <div className="finance-highlight" data-testid="business-plan-finance-highlight">
        <span>{plan.fundingNeeded}</span>
        <strong>{plan.revenueGoal}</strong>
      </div>
    </PlanPage>

    <PlanPage label="08" title="Future Plan & SMART Goals">
      <div className="financial-columns" data-testid="business-plan-future-columns">
        <div><h3>Milestones</h3><Lines text={plan.milestones} testId="business-plan-milestones-preview" /></div>
        <div><h3>SMART goals</h3><Lines text={plan.smartGoals} testId="business-plan-smart-goals-preview" /></div>
      </div>
    </PlanPage>

    <PlanPage label="09" title="Team & Action Checklist">
      <div className="financial-columns" data-testid="business-plan-team-action-columns">
        <div><h3>Team</h3><Lines text={plan.team} testId="business-plan-team-preview" /></div>
        <div><h3>Action checklist</h3><Lines text={plan.actionChecklist} testId="business-plan-action-checklist-preview" /></div>
      </div>
    </PlanPage>

    <PlanPage label="10" title="Thank You" className="closing-page">
      <p className="lead-copy" data-testid="business-plan-closing-note-preview">{plan.closingNote}</p>
      <div className="cover-card" data-testid="business-plan-contact-preview">Contact: {plan.contactEmail}</div>
    </PlanPage>
  </section>
);