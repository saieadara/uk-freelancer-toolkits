import {
  ClipboardList,
  Compass,
  Layers,
  Map,
  Sparkles,
  Megaphone,
  Skull,
  ListOrdered,
  Lightbulb,
  Target,
  Briefcase,
  Calculator,
  Handshake,
  Map as MapIcon,
  RotateCcw,
} from "lucide-react";

export const productCards = [
  {
    id: "prd-generator",
    title: "PRD Generator",
    eyebrow: "Shortlist features",
    description: "One-page PRDs (Problem, User, Scope, Out-of-scope, Success metric, Risks). Pre-loaded with PWA, Wizard, Comparator, Open Banking, and OCR.",
    path: "/product/prd-generator",
    action: "Open PRD generator",
    Icon: ClipboardList,
  },
  {
    id: "rice-prioritisation",
    title: "RICE Prioritisation",
    eyebrow: "Single-screen",
    description: "Score each candidate feature on Reach, Impact, Confidence, and Effort. The board auto-ranks live as you edit numbers.",
    path: "/product/rice",
    action: "Score features",
    Icon: ListOrdered,
  },
  {
    id: "story-map",
    title: "User Story Map Builder",
    eyebrow: "Guided builder",
    description: "Drop user stories into journey stages (columns) and group by release (rows). Drag cards between cells to plan slices.",
    path: "/product/story-map",
    action: "Map the journey",
    Icon: MapIcon,
  },
  {
    id: "sprint-retro",
    title: "Sprint Retro Template",
    eyebrow: "Single-screen",
    description: "Went well / didn't go well / try next. Generate an anonymised input link to gather team responses before the meeting.",
    path: "/product/retro",
    action: "Run a retro",
    Icon: RotateCcw,
  },
  {
    id: "pm-okr-tracker",
    title: "PM OKR Tracker",
    eyebrow: "Individual PM lens",
    description: "Re-skinned OKR tracker for an individual product manager. Pre-loaded with discovery, delivery, and growth-oriented PM goals.",
    path: "/product/pm-okrs",
    action: "Track PM OKRs",
    Icon: Target,
  },
  {
    id: "launch-comms-plan",
    title: "Launch Comms Plan",
    eyebrow: "Multi-output pack",
    description: "One launch brief, four ready-to-send outputs: internal Slack post, blog draft, customer email, and a sales one-pager.",
    path: "/product/launch-comms",
    action: "Plan launch comms",
    Icon: Megaphone,
  },
  {
    id: "feature-kill-memo",
    title: "Feature Kill Memo",
    eyebrow: "Single-screen",
    description: "When you sunset a feature: what, why, who's affected, the migration path, dates, and the sign-off owner.",
    path: "/product/kill-memo",
    action: "Draft kill memo",
    Icon: Skull,
  },
  {
    id: "interview-synthesis",
    title: "Customer Interview Synthesis",
    eyebrow: "Theme grouping",
    description: "Extension of the interview script tool: paste highlights and quotes, group them into themes, surface insights and the next experiment.",
    path: "/product/interview-synthesis",
    action: "Synthesise interviews",
    Icon: Lightbulb,
  },
  {
    id: "ir35-determinator",
    title: "IR35 Determinator",
    eyebrow: "PM contractors",
    description: "CEST-style yes/no checklist across substitution, control, mutuality of obligation, financial risk, and integration. Indicative inside / outside read.",
    path: "/product/ir35",
    action: "Run determinator",
    Icon: Briefcase,
  },
  {
    id: "day-rate-comparator",
    title: "Day-Rate Comparator",
    eyebrow: "PM contractors",
    description: "Compare net take-home as PAYE permanent, umbrella contractor, and Ltd contractor at a given day rate. Cross-sells the consulting contract.",
    path: "/product/day-rate",
    action: "Compare rates",
    Icon: Calculator,
  },
  {
    id: "consulting-contract-cross-sell",
    title: "Consulting Contract",
    eyebrow: "Cross-sell · existing tool",
    description: "Open the existing consulting / freelance client contract generator with PDF and Word export — useful for PMs going contract.",
    path: "/startup/consulting-client-contract",
    action: "Open contract generator",
    Icon: Handshake,
  },
  {
    id: "product-discovery-coming",
    title: "Discovery Log (linked)",
    eyebrow: "Existing tool",
    description: "Run a structured customer interview with the Mom-Test-style script template, then bring the notes back to the synthesis tool.",
    path: "/ops/interview-script",
    action: "Open interview script",
    Icon: Compass,
  },
  {
    id: "product-roadmap-coming",
    title: "Product Roadmap",
    eyebrow: "Coming next",
    description: "Sequence shipped, in-progress, and shortlisted features by quarter, with confidence scores and dependencies.",
    path: "/product/prd-generator",
    action: "Start with PRDs",
    Icon: Map,
  },
  {
    id: "product-portfolio-coming",
    title: "Feature Portfolio Health",
    eyebrow: "Coming next",
    description: "Score every shipped and queued feature on adoption, retention impact, and maintenance cost. Decide what to invest in, hold, or sunset.",
    path: "/product/prd-generator",
    action: "Plan features",
    Icon: Layers,
  },
];

const fields = [
  { id: "problem", label: "Problem", placeholder: "What pain are we solving and why now?" },
  { id: "user", label: "User", placeholder: "Who is this for? Be specific about segment and stage." },
  { id: "scope", label: "Scope (in)", placeholder: "What we will ship in v1." },
  { id: "outOfScope", label: "Out of scope", placeholder: "What we will deliberately NOT do." },
  { id: "successMetric", label: "Success metric", placeholder: "One numeric target with a deadline." },
  { id: "risks", label: "Risks", placeholder: "Top 3 risks and how we'll mitigate them." },
];

export const prdFields = fields;

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export const defaultProductBrief = () => ({
  productName: "UK Freelancer Toolkit",
  defaultOwner: "Bob",
  date: new Date().toISOString().slice(0, 10),
  prds: [
    {
      id: "pwa",
      name: "Progressive Web App (PWA)",
      problem: "Users want to access the toolkit offline (on the train, between client meetings) and from their phone home screen, but the current React SPA requires connectivity and lives inside a browser tab.",
      user: "Solo freelancers and founders working on the move with patchy connectivity, who already use the toolkit weekly and want a faster, app-like experience.",
      scope: "Web app manifest with brand icons; service worker caching the shell and last 5 visited tools; install prompt on second visit; offline read of saved invoices/contracts; background sync queue for failed PDF exports.",
      outOfScope: "Native iOS/Android apps; push notification campaigns; offline collaboration or multi-user sync; offline OCR.",
      successMetric: "25% of weekly active users install the PWA within 30 days of launch; offline-to-online sessions resume within 60 seconds of reconnect for 80% of returning users.",
      risks: "iOS Safari install/UX limitations may cap addressable installs; service worker cache invalidation can break PDF/Word libraries on update; users uncertain whether unsynced data is persisted — needs an explicit sync indicator.",
      owner: "Bob",
    },
    {
      id: "wizard",
      name: "Onboarding Wizard",
      problem: "First-time visitors land on a single tool and don't realise the toolkit covers their whole admin workflow (invoicing, contracts, tax, legal). Discovery is shallow and activation drops off after the first export.",
      user: "New users in their first 7 days, particularly first-time UK founders who don't know what they don't know about VAT, IR35, or SEIS.",
      scope: "4-step wizard (business stage → main role → 3 immediate jobs-to-be-done → email capture); generates a personalised dashboard suggesting the next 3 tools; persists choice to localStorage; skippable at any step.",
      outOfScope: "Account/auth system; payment; deep persona customisation beyond the 4 questions; multi-device sync of wizard answers.",
      successMetric: "Activation lift — % of new users completing at least 2 documents in week 1 increases from 18% baseline to 35% within 60 days of launch.",
      risks: "Wizard fatigue if it feels longer than 60 seconds; mismatched recommendations damage trust; localStorage-only persistence loses choices on device switch and dilutes the metric.",
      owner: "Bob",
    },
    {
      id: "comparator",
      name: "Side-by-side Comparator",
      problem: "Users open the toolkit twice in two browser tabs to compare scenarios (sole trader vs Ltd tax, two pricing models, two cap-table outcomes). The friction is high enough that most leave for a forum or call an accountant instead.",
      user: "Founders evaluating a structural decision (legal structure, pricing tier, fundraise size) who would otherwise leave the toolkit before deciding.",
      scope: "Generic comparator chrome that takes any two configurations of an existing single-screen tool (Tax Estimator, Cap Table, Break-even, Runway) and renders them side-by-side with deltas; share-as-link; export as PDF.",
      outOfScope: "Comparing across different tool types in a single view; named-scenario libraries with collaboration; comparator embedded in pure document generators (invoices, contracts).",
      successMetric: "15% of users who open Tax Estimator or Cap Table use the Compare button within 60 days; comparator sessions deliver 2× the document-export rate of single-config sessions.",
      risks: "UX complexity on mobile screens; comparator-specific edge cases in math (e.g. tax bands at the boundary); dilutes the toolkit's single-screen brand promise if surfaced too prominently.",
      owner: "Bob",
    },
    {
      id: "open-banking",
      name: "Open Banking Connection",
      problem: "Users manually enter line items into invoices, expenses, and the tax estimator. It's the slowest and most error-prone part of the toolkit. Without bank data the tax estimate is 'rough' not 'real' and users don't trust it for decisions.",
      user: "VAT-registered freelancers and Ltd company directors who already file self-assessment and want the toolkit to feel like a calm, accurate replacement for spreadsheets.",
      scope: "TrueLayer (or Plaid UK) integration with one-click connect for the 6 biggest UK banks; auto-categorise transactions into VAT, expenses, income; daily refresh; explicit consent screen with clear revoke path.",
      outOfScope: "Reconciliation with third-party accounting software; Making Tax Digital (MTD) submission; multi-bank aggregation beyond the supported six; currency conversion for non-GBP accounts.",
      successMetric: "40% of paid users connect a bank account within 14 days of upgrading; tax estimate accuracy within ±2% of the user's manual figure on a 30-account benchmark.",
      risks: "FCA / Open Banking compliance overhead; PSD2 90-day re-auth creates user friction; storing financial data raises GDPR + security bar significantly; per-user vendor cost can exceed paid-tier margin if uptake is too high.",
      owner: "Bob",
    },
    {
      id: "ocr",
      name: "Receipt / Invoice OCR",
      problem: "Receipts arrive as photos and PDFs. Users either type them in manually or skip them entirely, so the expense tracker is incomplete and the tax estimate is too high. Quarterly bookkeeping becomes a multi-hour chore.",
      user: "Freelancers and owner-managed Ltds who collect paper or email receipts (travel, software, equipment) and currently dread quarterly bookkeeping.",
      scope: "Drag-drop or photo upload; AWS Textract or Google Document AI; extract supplier, date, total, VAT, and line items; user reviews and corrects; one-click 'add to expenses' that links to the tax estimator and invoice tool.",
      outOfScope: "Multi-page itemised invoice splitting; in-app camera capture (rely on browser file input); accounting-grade audit trail; non-UK receipt formats and languages.",
      successMetric: "60% of uploaded receipts pass OCR with no manual correction needed; weekly expense entries per active user rise from a 2 baseline to 10 within 90 days.",
      risks: "OCR accuracy on UK thermal-paper and dot-matrix receipts is uneven; per-page OCR cost can erode free-tier margin; users may upload non-receipt images and clog the moderation queue; OCR provider data residency must satisfy UK GDPR.",
      owner: "Bob",
    },
  ],
});

export const defaultRiceBoard = () => ({
  productName: "UK Freelancer Toolkit",
  period: "Q3 2026",
  features: [
    { id: newId("rice"), name: "PWA install", reach: 5000, impact: 1, confidence: 80, effort: 3 },
    { id: newId("rice"), name: "Onboarding wizard", reach: 8000, impact: 2, confidence: 70, effort: 2 },
    { id: newId("rice"), name: "Side-by-side comparator", reach: 1500, impact: 1, confidence: 60, effort: 2 },
    { id: newId("rice"), name: "Open Banking", reach: 1200, impact: 3, confidence: 40, effort: 8 },
    { id: newId("rice"), name: "Receipt OCR", reach: 2500, impact: 2, confidence: 60, effort: 5 },
  ],
});

export const impactScale = [
  { value: 0.25, label: "0.25 · minimal" },
  { value: 0.5, label: "0.5 · low" },
  { value: 1, label: "1 · medium" },
  { value: 2, label: "2 · high" },
  { value: 3, label: "3 · massive" },
];

export const defaultStoryMap = () => ({
  productName: "UK Freelancer Toolkit",
  goal: "Get a first-time founder from idea to filing their first VAT invoice in under 30 minutes.",
  stages: [
    { id: "stage-discover", label: "Discover" },
    { id: "stage-setup", label: "Set up" },
    { id: "stage-create", label: "Create document" },
    { id: "stage-export", label: "Export & share" },
    { id: "stage-followup", label: "Follow up" },
  ],
  releases: [
    { id: "release-mvp", label: "MVP" },
    { id: "release-v2", label: "Pro v2" },
    { id: "release-later", label: "Later" },
  ],
  stories: [
    { id: newId("st"), stageId: "stage-discover", releaseId: "release-mvp", label: "Land on home, see flagship VAT invoice tool" },
    { id: newId("st"), stageId: "stage-discover", releaseId: "release-mvp", label: "Read 'Made for UK freelancers' positioning" },
    { id: newId("st"), stageId: "stage-discover", releaseId: "release-v2", label: "See industry-specific landing page" },
    { id: newId("st"), stageId: "stage-setup", releaseId: "release-mvp", label: "Add company name, address, VAT number" },
    { id: newId("st"), stageId: "stage-setup", releaseId: "release-v2", label: "Save brand colours and logo" },
    { id: newId("st"), stageId: "stage-create", releaseId: "release-mvp", label: "Add line items with rate × qty" },
    { id: newId("st"), stageId: "stage-create", releaseId: "release-mvp", label: "See live VAT total" },
    { id: newId("st"), stageId: "stage-create", releaseId: "release-v2", label: "Pull line items from saved templates" },
    { id: newId("st"), stageId: "stage-export", releaseId: "release-mvp", label: "Download as PDF" },
    { id: newId("st"), stageId: "stage-export", releaseId: "release-v2", label: "Email PDF to client direct" },
    { id: newId("st"), stageId: "stage-export", releaseId: "release-later", label: "Send via WhatsApp" },
    { id: newId("st"), stageId: "stage-followup", releaseId: "release-v2", label: "Reminder when invoice is overdue" },
    { id: newId("st"), stageId: "stage-followup", releaseId: "release-later", label: "Auto-reconcile against bank feed" },
  ],
});

export const defaultRetro = () => ({
  sprintLabel: "Sprint 12",
  sprintDates: `${new Date().toISOString().slice(0, 10)}`,
  facilitator: "Bob",
  shareSlug: Math.random().toString(36).slice(2, 10),
  anonymousByDefault: true,
  cards: {
    wentWell: [
      { id: newId("card"), text: "Shipped EMI grant generator on time without scope creep.", author: "" },
      { id: newId("card"), text: "Daily customer interviews held — 8 conversations done.", author: "" },
    ],
    didNot: [
      { id: newId("card"), text: "QA on cookie policy slipped to Friday and ate the slack.", author: "" },
      { id: newId("card"), text: "Two design tickets with unclear acceptance criteria.", author: "" },
    ],
    tryNext: [
      { id: newId("card"), text: "Write acceptance criteria before estimating.", author: "" },
      { id: newId("card"), text: "Reserve Friday afternoon for unscheduled QA, not feature work.", author: "" },
    ],
  },
});

export const defaultPmOkrTracker = () => ({
  quarter: "Q3 2026",
  companyTheme: "Personal PM goals — discovery, delivery, growth.",
  objectives: [
    {
      id: newId("obj"),
      title: "Build a healthy discovery cadence",
      keyResults: [
        { id: newId("kr"), title: "Hold 24 customer interviews", target: 24, current: 8, unit: "interviews", confidence: 70 },
        { id: newId("kr"), title: "Synthesise interviews into 6 themes monthly", target: 6, current: 2, unit: "themes", confidence: 60 },
        { id: newId("kr"), title: "Convert 3 themes into shipped experiments", target: 3, current: 1, unit: "experiments", confidence: 55 },
      ],
    },
    {
      id: newId("obj"),
      title: "Ship the shortlisted features without feature bloat",
      keyResults: [
        { id: newId("kr"), title: "Ship 4 of the 5 shortlisted PRDs", target: 4, current: 1, unit: "shipped", confidence: 55 },
        { id: newId("kr"), title: "Keep average PRD-to-ship cycle under 30 days", target: 30, current: 42, unit: "days", confidence: 45 },
      ],
    },
    {
      id: newId("obj"),
      title: "Improve activation funnel measurably",
      keyResults: [
        { id: newId("kr"), title: "Lift week-1 doc completions from 18% to 30%", target: 30, current: 22, unit: "%", confidence: 50 },
        { id: newId("kr"), title: "Cut signup-to-first-export time below 6 minutes", target: 6, current: 11, unit: "minutes", confidence: 60 },
      ],
    },
  ],
});

export const defaultLaunchCommsPlan = () => ({
  featureName: "Receipt OCR",
  oneLine: "Photograph or drop a receipt and the toolkit fills in the supplier, date, VAT, and total for you.",
  audience: "Existing freelancer and Ltd-director users on the Pro plan.",
  launchDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  pricing: "Included on Pro (£29/mo). Free tier: 5 receipts/month. Pro: unlimited.",
  callToAction: "Open the Receipt OCR tool from the dashboard.",
  hero: "End the quarterly bookkeeping panic.",
  benefits: "60% of receipts pass OCR with no manual fix. Auto-fills the tax estimator. UK-thermal-paper tested.",
  internalSlackOwner: "Bob",
  blogAuthor: "Northstar Studio",
  customerSenderName: "Bob",
  customerSenderRole: "Founder, Northstar Studio",
  salesAudience: "Accountancy practices and bookkeeping partners.",
});

export const defaultKillMemo = () => ({
  featureName: "Manual receipt entry",
  decisionDate: new Date().toISOString().slice(0, 10),
  sunsetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  decisionOwner: "Bob",
  approvers: "Founder + lead engineer",
  reason: "Adoption < 8% of monthly active users. Maintenance time blocking the OCR replacement. Confused UX vs OCR.",
  affectedUsers: "Roughly 320 active users in the last 30 days, mostly on the free tier.",
  migrationPath: "Existing entries remain readable. New entries route to OCR or manual line items in the invoice tool. Banner notice 30 and 7 days before sunset, plus an in-app modal on the deprecated screen.",
  alternativeOfferings: "Receipt OCR (Pro), invoice line items, expense calculator within the budget tool.",
  rollbackPlan: "Code remains in main behind a feature flag for 60 days post-sunset; can be re-enabled within 1 day if support load spikes.",
  successCriteria: "<2% drop in weekly active users. <5% increase in support tickets in the 30 days post-sunset. >40% of affected users adopt OCR within 30 days.",
});

export const defaultInterviewSynthesis = () => ({
  productHypothesis: "UK founders want a single tool for planning, contracts, and pitch decks without paying for a lawyer or accountant up-front.",
  segment: "First-time UK founders, 0-12 months, building a service or SaaS business with up to £100k starting capital.",
  themes: [
    {
      id: newId("theme"),
      label: "Trust signals & UK specificity",
      summary: "Founders distrust generic global templates. They want explicit UK references (HMRC, IR35, SEIS, Companies House) before they will trust an output for filing or signing.",
      nextStep: "Add an explicit UK badge and reference list to every export footer.",
      quotes: [
        { id: newId("q"), interviewee: "F1", quote: "If it doesn't say HMRC anywhere I'll just go to GOV.UK." },
        { id: newId("q"), interviewee: "F4", quote: "I had a US contract template, the IP clause was wrong for UK and our lawyer charged us £600 to fix it." },
      ],
    },
    {
      id: newId("theme"),
      label: "Speed > polish",
      summary: "Most founders want a working draft in under 5 minutes; they will iterate later. Pretty design is welcome but not the deciding factor.",
      nextStep: "Track time-to-first-export per tool. Surface a 'good enough draft' prompt on long forms.",
      quotes: [
        { id: newId("q"), interviewee: "F2", quote: "I just need something to send today. I'll polish it tomorrow." },
        { id: newId("q"), interviewee: "F7", quote: "Templates that take 30 minutes to fill in get abandoned at minute 12." },
      ],
    },
    {
      id: newId("theme"),
      label: "Bookkeeping pain dominates the year",
      summary: "Receipts and expenses come up in every interview as the biggest unsolved chore. Bank feeds and OCR are the most-requested features.",
      nextStep: "Prioritise the OCR PRD; preview Open Banking on the roadmap page to gauge intent-to-pay.",
      quotes: [
        { id: newId("q"), interviewee: "F3", quote: "I've got a shoebox of receipts. Every quarter I lose a Sunday." },
        { id: newId("q"), interviewee: "F5", quote: "Whatever fills in the supplier and total automatically — I'll pay for that." },
      ],
    },
  ],
});

export const ir35Questions = [
  {
    id: "substitution",
    label: "Substitution",
    question: "Can you send a substitute (someone else from your business) to do the work without the client's veto on individual?",
    pointsForOutside: 3,
    optionInsideLabel: "No — client requires me personally",
    optionOutsideLabel: "Yes — genuine, unfettered right of substitution",
  },
  {
    id: "control",
    label: "Control",
    question: "Does the client tell you how, when, and where to do the work?",
    pointsForOutside: 2,
    optionInsideLabel: "Yes — I'm directed like an employee",
    optionOutsideLabel: "No — I deliver outcomes, I choose the how",
  },
  {
    id: "moo",
    label: "Mutuality of obligation",
    question: "Is the client obliged to offer ongoing work and you obliged to accept it?",
    pointsForOutside: 2,
    optionInsideLabel: "Yes — open-ended ongoing engagement",
    optionOutsideLabel: "No — engagement is per-project, with discrete deliverables",
  },
  {
    id: "financial-risk",
    label: "Financial risk",
    question: "Do you bear genuine financial risk (rectifying defects at your own cost, providing equipment, fixed price)?",
    pointsForOutside: 1.5,
    optionInsideLabel: "No — paid time-and-materials with no rectification risk",
    optionOutsideLabel: "Yes — fixed-price or rectification-at-own-cost engagement",
  },
  {
    id: "integration",
    label: "Integration / part & parcel",
    question: "Are you integrated like an employee (perks, line management, internal systems)?",
    pointsForOutside: 1.5,
    optionInsideLabel: "Yes — line manager, perks, internal systems",
    optionOutsideLabel: "No — clearly external, identified as supplier",
  },
];

export const defaultIr35 = () => {
  const answers = {};
  ir35Questions.forEach((q) => { answers[q.id] = "outside"; });
  return {
    role: "Senior Product Manager (contract)",
    client: "Example Plc",
    engagementMonths: 6,
    answers,
    notes: "Captured during onboarding contract review.",
  };
};

export const defaultDayRate = () => ({
  dayRate: 600,
  daysPerYear: 220,
  expensesPerYear: 4000,
  pensionPercent: 5,
  permSalary: 95000,
  permPensionEmployer: 5,
  permBonusPercent: 10,
});
