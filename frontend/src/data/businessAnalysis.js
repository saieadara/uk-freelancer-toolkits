import {
  FileText,
  ListTree,
  Workflow,
  Database,
  GitCompareArrows,
  Users,
  ScrollText,
  CheckSquare,
  Briefcase,
  Calculator,
  Handshake,
} from "lucide-react";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export const baCards = [
  {
    id: "brd",
    title: "Business Requirements Doc (BRD)",
    eyebrow: "Guided builder",
    description: "Need, scope, functional + non-functional requirements, constraints, assumptions, and approvals — board-ready format.",
    path: "/business-analysis/brd",
    action: "Build BRD",
    Icon: FileText,
  },
  {
    id: "rtm",
    title: "Requirements Traceability Matrix",
    eyebrow: "Guided builder",
    description: "Each requirement → linked design element → test case → approver. Coverage at a glance.",
    path: "/business-analysis/traceability",
    action: "Trace requirements",
    Icon: ListTree,
  },
  {
    id: "process-flow",
    title: "As-Is / To-Be Process Flow",
    eyebrow: "Guided builder + canvas",
    description: "Side-by-side numbered steps for current and future state with gap callouts aligned row-by-row.",
    path: "/business-analysis/process-flow",
    action: "Map processes",
    Icon: Workflow,
  },
  {
    id: "data-dictionary",
    title: "Data Dictionary",
    eyebrow: "Guided builder",
    description: "Field name, type, source, owner, definition. Foundation for any data project or migration.",
    path: "/business-analysis/data-dictionary",
    action: "Build dictionary",
    Icon: Database,
  },
  {
    id: "gap-analysis",
    title: "Gap Analysis",
    eyebrow: "Single-screen",
    description: "Current state, future state, gap, action, owner, deadline — closeable items, not abstract observations.",
    path: "/business-analysis/gap-analysis",
    action: "Run gap analysis",
    Icon: GitCompareArrows,
  },
  {
    id: "stakeholder-map",
    title: "Stakeholder Map",
    eyebrow: "Power / interest grid",
    description: "Place each stakeholder on a Power × Interest 2×2 and pair with an engagement plan per quadrant.",
    path: "/business-analysis/stakeholder-map",
    action: "Map stakeholders",
    Icon: Users,
  },
  {
    id: "use-case",
    title: "Use Case Specification",
    eyebrow: "Single-screen",
    description: "Actor, preconditions, main flow, alternate flow, postconditions — the BA classic in a single screen.",
    path: "/business-analysis/use-case",
    action: "Spec use case",
    Icon: ScrollText,
  },
  {
    id: "acceptance-criteria",
    title: "Acceptance Criteria Sheet",
    eyebrow: "Given / When / Then",
    description: "BDD-style criteria, each linked to a story id and a test case so coverage stays honest.",
    path: "/business-analysis/acceptance-criteria",
    action: "Write criteria",
    Icon: CheckSquare,
  },
  {
    id: "ir35-cross-sell",
    title: "IR35 Determinator",
    eyebrow: "Cross-sell · existing tool",
    description: "Contract BAs: pressure-test the engagement against CEST-style factors before signing.",
    path: "/product/ir35",
    action: "Open IR35 tool",
    Icon: Briefcase,
  },
  {
    id: "day-rate-cross-sell",
    title: "Day-Rate Comparator",
    eyebrow: "Cross-sell · existing tool",
    description: "Compare net take-home as Ltd, umbrella, or PAYE for contract BA day rates.",
    path: "/product/day-rate",
    action: "Compare rates",
    Icon: Calculator,
  },
  {
    id: "consulting-contract-cross-sell",
    title: "Public-sector / Consulting Contract",
    eyebrow: "Cross-sell · existing tool",
    description: "Generate the engagement contract with PDF and Word export — adapt the consulting contract for public-sector or commercial BA work.",
    path: "/startup/consulting-client-contract",
    action: "Open contract",
    Icon: Handshake,
  },
];

const newReq = (id, area, text, priority = "Must") => ({ id, area, text, priority });
const newNfReq = (id, category, text, target) => ({ id, category, text, target });

export const defaultBrd = () => ({
  projectName: "Open Banking integration for UK Freelancer Toolkit",
  sponsor: "Bob, Founder",
  ba: "Lead BA",
  date: new Date().toISOString().slice(0, 10),
  businessNeed: "Customers spend hours each quarter typing receipts and expenses into the toolkit. Without bank data, the tax estimate is too rough to trust for self-assessment, leading to lost confidence and churn at renewal.",
  objectives: "Auto-populate income and expense data; reduce manual data entry by 80%; deliver tax-estimate accuracy within ±2% of the user's own figure; maintain UK GDPR + PSD2 compliance throughout.",
  scopeIn: "TrueLayer integration with the 6 biggest UK retail banks; consent + revoke flow; daily transaction sync; rules-based categorisation engine; admin dashboard for sync health.",
  scopeOut: "Multi-currency accounts; reconciliation with third-party accounting software; Making Tax Digital submissions; commercial banking accounts.",
  assumptions: "Customers will accept a re-auth every 90 days as required by PSD2; TrueLayer pricing remains within £2.50 / connected user / month.",
  constraints: "Must be FCA AISP-registered; 12-week delivery window; one engineering team-quarter of effort.",
  functional: [
    newReq("FR-01", "Connect", "User can initiate a connection with one of the 6 supported banks via OAuth handshake.", "Must"),
    newReq("FR-02", "Sync", "Toolkit fetches transactions for the previous 24 months on first connect, then daily incremental.", "Must"),
    newReq("FR-03", "Categorise", "Each transaction is auto-categorised as income, expense, VAT, or unknown using configurable rules.", "Must"),
    newReq("FR-04", "Override", "User can recategorise any transaction; the rule learns from the override.", "Should"),
    newReq("FR-05", "Revoke", "User can revoke bank consent at any time; revoke completes within 30 seconds and stops further sync.", "Must"),
  ],
  nonFunctional: [
    newNfReq("NF-01", "Performance", "Initial sync of 24 months of data completes within 60 seconds for 95% of accounts.", "<60s p95"),
    newNfReq("NF-02", "Availability", "Bank connection service is available 99.5% of the time excluding planned maintenance.", "99.5% uptime"),
    newNfReq("NF-03", "Security", "All bank tokens encrypted at rest with AES-256; rotated quarterly.", "AES-256, 90-day rotation"),
    newNfReq("NF-04", "Compliance", "Service operates as an FCA-authorised AISP; PSD2 SCA + 90-day re-auth.", "FCA AISP"),
  ],
  approvers: "Founder; Lead Engineer; Compliance Counsel.",
});

export const defaultTraceability = () => ({
  projectName: "Open Banking integration",
  baseline: "v1.0 — January 2026",
  rows: [
    { id: newId("row"), reqId: "FR-01", requirement: "User can connect a UK bank account via OAuth.", design: "DD-CONNECT-01", testCase: "T-CONN-OAUTH-1", approver: "Lead Engineer", status: "Implemented" },
    { id: newId("row"), reqId: "FR-02", requirement: "Toolkit fetches 24 months of transactions on first connect.", design: "DD-SYNC-INIT", testCase: "T-SYNC-INIT-1", approver: "Lead Engineer", status: "In progress" },
    { id: newId("row"), reqId: "FR-03", requirement: "Auto-categorise transactions.", design: "DD-RULES-ENGINE", testCase: "T-CAT-AUTO-1", approver: "Lead BA", status: "In progress" },
    { id: newId("row"), reqId: "FR-04", requirement: "User can override category and rule learns.", design: "DD-OVERRIDE", testCase: "T-CAT-OVERRIDE-1", approver: "Lead BA", status: "Not started" },
    { id: newId("row"), reqId: "FR-05", requirement: "User can revoke consent at any time.", design: "DD-REVOKE", testCase: "T-CONS-REVOKE-1", approver: "Compliance", status: "Not started" },
    { id: newId("row"), reqId: "NF-01", requirement: "Initial sync ≤ 60s p95.", design: "DD-PERF-LOAD", testCase: "T-PERF-LOAD-1", approver: "Lead Engineer", status: "Not started" },
  ],
});

export const defaultProcessFlow = () => ({
  processName: "Quarterly bookkeeping for UK freelancer",
  owner: "Customer Success",
  date: new Date().toISOString().slice(0, 10),
  asIs: [
    { id: newId("st"), label: "Receive paper or PDF receipts in inbox", actor: "Customer" },
    { id: newId("st"), label: "Manually open spreadsheet, type each line", actor: "Customer" },
    { id: newId("st"), label: "Re-key totals into the toolkit invoice generator", actor: "Customer" },
    { id: newId("st"), label: "Estimate tax with rough income figure", actor: "Customer" },
    { id: newId("st"), label: "Submit Self Assessment with mismatched numbers", actor: "Customer" },
  ],
  toBe: [
    { id: newId("st"), label: "Bank feed and OCR pull transactions automatically", actor: "Toolkit" },
    { id: newId("st"), label: "Categorisation rules apply; user reviews exceptions only", actor: "Customer" },
    { id: newId("st"), label: "Toolkit pushes pre-validated totals into invoices and tax estimate", actor: "Toolkit" },
    { id: newId("st"), label: "Tax estimate refreshes daily with live data", actor: "Toolkit" },
    { id: newId("st"), label: "Submit Self Assessment with fully traceable numbers", actor: "Customer" },
  ],
  gaps: [
    { id: newId("gap"), label: "No automated data ingestion today", impact: "Hours of manual entry per quarter" },
    { id: newId("gap"), label: "No transaction-level categorisation engine", impact: "Categories inconsistent across periods" },
    { id: newId("gap"), label: "Tax estimate is disconnected from real numbers", impact: "Customers don't trust the figure" },
    { id: newId("gap"), label: "No daily refresh; numbers go stale", impact: "Year-end surprises" },
    { id: newId("gap"), label: "No audit-trail link between bank record and toolkit", impact: "Tougher to defend if HMRC queries" },
  ],
});

export const defaultDataDictionary = () => ({
  domain: "Open Banking transaction store",
  source: "TrueLayer Data API",
  owner: "Lead Engineer",
  date: new Date().toISOString().slice(0, 10),
  fields: [
    { id: newId("fld"), name: "transaction_id", type: "uuid", source: "TrueLayer", owner: "Lead Engineer", definition: "Stable unique identifier per transaction; primary key in our store." },
    { id: newId("fld"), name: "amount_pennies", type: "integer", source: "TrueLayer", owner: "Lead Engineer", definition: "Signed amount in pennies; positive = credit, negative = debit." },
    { id: newId("fld"), name: "currency", type: "string(3)", source: "TrueLayer", owner: "Lead Engineer", definition: "ISO-4217 currency code; expected GBP for UK accounts." },
    { id: newId("fld"), name: "merchant_name", type: "string(80)", source: "TrueLayer + enrichment", owner: "Data team", definition: "Cleaned merchant string used for categorisation rules." },
    { id: newId("fld"), name: "category", type: "string(40)", source: "Toolkit categorisation engine", owner: "Lead BA", definition: "Mapped category — income, vat, expense_*, transfer, unknown." },
    { id: newId("fld"), name: "vat_amount_pennies", type: "integer", source: "Derived", owner: "Lead BA", definition: "VAT inferred from supplier rules; null if unknown." },
    { id: newId("fld"), name: "user_overridden", type: "boolean", source: "Toolkit UI", owner: "Lead BA", definition: "True if the user changed the category manually." },
  ],
});

export const defaultGapAnalysis = () => ({
  area: "Quarterly bookkeeping",
  date: new Date().toISOString().slice(0, 10),
  rows: [
    { id: newId("gap"), current: "All transactions typed manually", future: "Auto-fed from bank + OCR", gap: "No ingestion pipeline; no categorisation engine", action: "Build TrueLayer integration + rules engine", owner: "Lead Engineer", deadline: "End Q3 2026", priority: "High" },
    { id: newId("gap"), current: "Rough tax estimate using user-entered figures", future: "Tax estimate driven by live bank data", gap: "Estimator detached from transaction store", action: "Wire estimator to categorised transaction feed", owner: "Lead BA", deadline: "Mid Q3 2026", priority: "High" },
    { id: newId("gap"), current: "No audit trail between numbers and source", future: "Every figure traces to a transaction id", gap: "Reporting layer doesn't preserve provenance", action: "Add provenance metadata across reporting layer", owner: "Lead Engineer", deadline: "End Q3 2026", priority: "Medium" },
    { id: newId("gap"), current: "Manual VAT category guesswork", future: "Rules-based VAT inference per supplier", gap: "No supplier rules library", action: "Seed rules library from top 100 UK SaaS suppliers", owner: "Lead BA", deadline: "Mid Q3 2026", priority: "Medium" },
  ],
});

export const defaultStakeholderMap = () => ({
  projectName: "Open Banking integration",
  date: new Date().toISOString().slice(0, 10),
  stakeholders: [
    { id: newId("sh"), name: "Founder (Bob)", role: "Sponsor", power: 9, interest: 9, strategy: "Manage closely — weekly steering, pre-read every milestone." },
    { id: newId("sh"), name: "Lead Engineer", role: "Build owner", power: 7, interest: 9, strategy: "Manage closely — pair on design decisions, escalate blockers." },
    { id: newId("sh"), name: "Compliance Counsel", role: "FCA AISP application", power: 8, interest: 5, strategy: "Keep satisfied — milestone updates and clear ask cadence." },
    { id: newId("sh"), name: "Existing paid users (Pro)", role: "Beneficiary", power: 4, interest: 8, strategy: "Keep informed — beta invites, monthly product update." },
    { id: newId("sh"), name: "Free-tier users", role: "Future paid pipeline", power: 2, interest: 5, strategy: "Monitor — release notes only." },
    { id: newId("sh"), name: "TrueLayer account manager", role: "Vendor", power: 6, interest: 4, strategy: "Keep satisfied — quarterly business review, escalation contact." },
    { id: newId("sh"), name: "HMRC / regulators", role: "Oversight", power: 9, interest: 2, strategy: "Manage carefully — proactive disclosure, compliance audit prep." },
  ],
  quadrants: {
    "high-high": { label: "Manage closely (high power · high interest)" },
    "high-low": { label: "Keep satisfied (high power · low interest)" },
    "low-high": { label: "Keep informed (low power · high interest)" },
    "low-low": { label: "Monitor (low power · low interest)" },
  },
});

export const defaultUseCase = () => ({
  ucId: "UC-001",
  title: "Connect a UK bank account",
  ba: "Lead BA",
  date: new Date().toISOString().slice(0, 10),
  primaryActor: "Authenticated paid user",
  supportingActors: "TrueLayer OAuth provider; bank login system",
  trigger: "User clicks 'Connect bank' on the dashboard.",
  preconditions: "User is authenticated; user is on a Pro plan; user has not yet exceeded their bank-connection quota; UK bank from supported list.",
  postconditionsSuccess: "Bank account is linked; first sync started; user sees the live sync status; tokens encrypted and stored.",
  postconditionsFailure: "No bank connection persisted; no tokens stored; user sees a clear error and recovery action.",
  mainFlow: [
    "User clicks 'Connect bank' on the dashboard.",
    "Toolkit displays the list of supported UK banks.",
    "User selects a bank.",
    "Toolkit redirects to the bank OAuth screen via TrueLayer.",
    "User authenticates with the bank and approves data sharing scopes.",
    "Bank redirects back to the toolkit with a one-time code.",
    "Toolkit exchanges the code for an access token via TrueLayer.",
    "Toolkit stores the encrypted token and queues an initial 24-month sync.",
    "Toolkit displays a confirmation screen with sync progress.",
  ],
  alternateFlows: [
    "A1 · User cancels at the bank screen — toolkit returns to dashboard with no connection.",
    "A2 · Bank rejects the consent — toolkit shows error and offers retry or different bank.",
    "A3 · TrueLayer is unavailable — toolkit displays maintenance notice and disables the Connect button.",
    "E1 · Token exchange fails — toolkit logs the error, alerts ops, and shows the user a generic retry message.",
  ],
  businessRules: "Maximum 3 bank connections per user. Re-auth required every 90 days per PSD2. Tokens encrypted at rest with AES-256.",
  notes: "Linked to FR-01 in the BRD and DD-CONNECT-01 in the design pack.",
});

export const defaultAcceptanceCriteria = () => ({
  storyTitle: "Connect a UK bank account",
  storyId: "STORY-201",
  ba: "Lead BA",
  date: new Date().toISOString().slice(0, 10),
  context: "First-time user with a Pro plan connecting their first bank to populate the tax estimator.",
  rows: [
    { id: newId("ac"), acId: "AC-001", given: "I am an authenticated Pro user with no banks connected", when: "I click 'Connect bank' and complete the OAuth flow with a supported UK bank", then: "The bank appears in my Connections list and the initial 24-month sync starts", testId: "T-CONN-OAUTH-1" },
    { id: newId("ac"), acId: "AC-002", given: "I am an authenticated Pro user with one bank already connected", when: "I add a second supported UK bank", then: "Both banks appear in the Connections list with independent sync status", testId: "T-CONN-OAUTH-2" },
    { id: newId("ac"), acId: "AC-003", given: "I am authenticated and the bank login fails", when: "I return to the toolkit", then: "I see a clear error and a retry CTA without losing my place", testId: "T-CONN-ERR-1" },
    { id: newId("ac"), acId: "AC-004", given: "I have an active bank connection", when: "I click 'Revoke' next to that connection", then: "The connection disappears within 30 seconds and no further sync occurs", testId: "T-CONS-REVOKE-1" },
  ],
});
