import {
  ClipboardCheck,
  Grid3x3,
  AlertTriangle,
  Activity,
  MessageSquare,
  FileEdit,
  BookOpen,
  Map,
  Briefcase,
  Calculator,
  FileSignature,
} from "lucide-react";

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export const pmCards = [
  {
    id: "project-charter",
    title: "Project Charter",
    eyebrow: "Single-screen · existing tool",
    description: "Sponsor, scope, objectives, milestones, budget, governance. Re-uses the existing charter generator from the Strategy directory.",
    path: "/strategy/project-charter",
    action: "Open charter",
    Icon: ClipboardCheck,
  },
  {
    id: "raci-matrix",
    title: "RACI Matrix",
    eyebrow: "Single-screen",
    description: "Tasks vs. roles. Tools flag any task with no Accountable role and warn on multiple Accountables (only one allowed).",
    path: "/project-management/raci",
    action: "Build RACI",
    Icon: Grid3x3,
  },
  {
    id: "risk-register",
    title: "Risk Register",
    eyebrow: "Single-screen · auto-sorts",
    description: "Risk, probability, impact, owner, mitigation. Score (P × I) calculates live and the table sorts highest-risk first.",
    path: "/project-management/risk-register",
    action: "Track risks",
    Icon: AlertTriangle,
  },
  {
    id: "rag-status",
    title: "RAG Status Report",
    eyebrow: "Single-screen · weekly",
    description: "Traffic-light status per workstream, key decisions needed, blockers, and a clean PDF + email-ready format.",
    path: "/project-management/rag-status",
    action: "Run weekly status",
    Icon: Activity,
  },
  {
    id: "comms-plan",
    title: "Stakeholder Communication Plan",
    eyebrow: "Single-screen",
    description: "Audience, message, channel, frequency, owner. The plan you commit to in week one and update at every stage gate.",
    path: "/project-management/comms-plan",
    action: "Plan comms",
    Icon: MessageSquare,
  },
  {
    id: "change-request",
    title: "Change Request Form",
    eyebrow: "Single-screen",
    description: "What's changing, impact on scope / cost / time / risk, recommendation, and sign-off lines.",
    path: "/project-management/change-request",
    action: "Raise change",
    Icon: FileEdit,
  },
  {
    id: "lessons-learned",
    title: "Lessons-learned Log",
    eyebrow: "Single-screen",
    description: "What worked, what didn't, what you'd recommend next time. End-of-phase or end-of-project.",
    path: "/project-management/lessons-learned",
    action: "Capture lessons",
    Icon: BookOpen,
  },
  {
    id: "milestone-roadmap",
    title: "Milestone Roadmap One-Pager",
    eyebrow: "Single-screen",
    description: "A horizontal timeline of milestones — not a full Gantt — that fits on a slide and lands cleanly with execs.",
    path: "/project-management/milestone-roadmap",
    action: "Build roadmap",
    Icon: Map,
  },
  {
    id: "ir35-cross-sell",
    title: "IR35 Determinator",
    eyebrow: "Cross-sell · existing tool",
    description: "Interim PMs: pressure-test the engagement against CEST-style factors before signing.",
    path: "/product/ir35",
    action: "Open IR35 tool",
    Icon: Briefcase,
  },
  {
    id: "day-rate-cross-sell",
    title: "Day-Rate Comparator",
    eyebrow: "Cross-sell · existing tool",
    description: "Compare net take-home as Ltd, umbrella, or PAYE for interim PM day rates.",
    path: "/product/day-rate",
    action: "Compare rates",
    Icon: Calculator,
  },
  {
    id: "employment-contract-cross-sell",
    title: "Employment Contract Review",
    eyebrow: "Cross-sell · existing tool",
    description: "PAYE / IR35-aware contract generator for interim PMs going perm or reviewing an offered contract.",
    path: "/hiring/employment-contract",
    action: "Open contract review",
    Icon: FileSignature,
  },
];

export const defaultRaci = () => ({
  projectName: "Open Banking integration",
  date: new Date().toISOString().slice(0, 10),
  roles: [
    { id: "role-pm", label: "Project manager" },
    { id: "role-ba", label: "Business analyst" },
    { id: "role-eng", label: "Lead engineer" },
    { id: "role-design", label: "Designer" },
    { id: "role-compliance", label: "Compliance" },
    { id: "role-sponsor", label: "Sponsor" },
  ],
  tasks: [
    { id: newId("tsk"), label: "Approve scope and budget", assignments: { "role-pm": "R", "role-ba": "C", "role-eng": "C", "role-design": "I", "role-compliance": "C", "role-sponsor": "A" } },
    { id: newId("tsk"), label: "Write BRD and traceability matrix", assignments: { "role-pm": "C", "role-ba": "A", "role-eng": "C", "role-design": "I", "role-compliance": "C", "role-sponsor": "I" } },
    { id: newId("tsk"), label: "Design connect / consent flow", assignments: { "role-pm": "I", "role-ba": "C", "role-eng": "C", "role-design": "A", "role-compliance": "C", "role-sponsor": "I" } },
    { id: newId("tsk"), label: "Build and unit-test the integration", assignments: { "role-pm": "I", "role-ba": "C", "role-eng": "A", "role-design": "I", "role-compliance": "C", "role-sponsor": "I" } },
    { id: newId("tsk"), label: "FCA AISP application", assignments: { "role-pm": "C", "role-ba": "I", "role-eng": "I", "role-design": "I", "role-compliance": "A", "role-sponsor": "I" } },
    { id: newId("tsk"), label: "Run UAT with 30 beta users", assignments: { "role-pm": "R", "role-ba": "A", "role-eng": "C", "role-design": "C", "role-compliance": "I", "role-sponsor": "I" } },
    { id: newId("tsk"), label: "GA launch decision", assignments: { "role-pm": "C", "role-ba": "C", "role-eng": "C", "role-design": "I", "role-compliance": "C", "role-sponsor": "A" } },
  ],
});

export const defaultRiskRegister = () => ({
  projectName: "Open Banking integration",
  date: new Date().toISOString().slice(0, 10),
  risks: [
    { id: newId("rsk"), risk: "FCA AISP application is delayed past start of build", probability: 4, impact: 5, owner: "Compliance", mitigation: "File application week 1; weekly check-in with FCA case officer; have Plan B AISP partner on standby." },
    { id: newId("rsk"), risk: "TrueLayer pricing changes mid-build", probability: 2, impact: 4, owner: "Lead engineer", mitigation: "12-month locked pricing in MSA; dual-source design that can swap to Plaid UK." },
    { id: newId("rsk"), risk: "PSD2 90-day re-auth causes user drop-off", probability: 4, impact: 3, owner: "Lead BA", mitigation: "Pre-auth reminder emails; one-tap re-auth UX; bake it into the activation funnel." },
    { id: newId("rsk"), risk: "Categorisation accuracy misses ±2% target", probability: 3, impact: 4, owner: "Lead BA", mitigation: "Seed top-100 supplier rules; user-override learning loop; ship with a calibrated confidence indicator." },
    { id: newId("rsk"), risk: "Security incident with bank tokens", probability: 1, impact: 5, owner: "Lead engineer", mitigation: "AES-256 at rest; quarterly token rotation; pen-test before GA; documented incident response plan." },
    { id: newId("rsk"), risk: "Vendor cost overruns the paid-tier margin", probability: 3, impact: 3, owner: "Sponsor", mitigation: "Per-user cost ceiling in the MSA; price the Pro plan with +30% buffer; quarterly cost review." },
  ],
});

export const defaultRagStatus = () => ({
  projectName: "Open Banking integration",
  reportingWeek: new Date().toISOString().slice(0, 10),
  pm: "Bob",
  overall: "amber",
  summary: "On track on engineering, slipping on FCA approval. Recommending 2-week schedule buffer to absorb regulatory risk.",
  workstreams: [
    { id: newId("ws"), name: "FCA AISP application", status: "red", commentary: "Case officer requested additional governance evidence; preparing pack this week." },
    { id: newId("ws"), name: "TrueLayer integration", status: "green", commentary: "Sandbox calls working; first 24-month sync test scheduled Friday." },
    { id: newId("ws"), name: "Categorisation engine", status: "amber", commentary: "Rules library at 60% coverage; two suppliers blocking top users." },
    { id: newId("ws"), name: "Connect / revoke UX", status: "green", commentary: "Designs signed off; engineering kicks off Monday." },
    { id: newId("ws"), name: "Beta plan", status: "green", commentary: "30 beta users selected; comms plan agreed." },
  ],
  decisions: [
    { id: newId("dec"), label: "Approve 2-week schedule buffer for FCA approval", owner: "Sponsor", needBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) },
    { id: newId("dec"), label: "Sign off Plan B AISP partner contract", owner: "Sponsor", needBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) },
  ],
  blockers: [
    { id: newId("blk"), label: "Awaiting FCA case officer reply on governance evidence — chasing daily.", owner: "Compliance" },
  ],
});

export const defaultCommsPlan = () => ({
  projectName: "Open Banking integration",
  date: new Date().toISOString().slice(0, 10),
  rows: [
    { id: newId("c"), audience: "Sponsor", message: "RAG status, decisions needed, top risks", channel: "30-min weekly Zoom + written status", frequency: "Weekly", owner: "PM" },
    { id: newId("c"), audience: "Engineering team", message: "Sprint goals, blockers, demo", channel: "Standup + sprint review", frequency: "Daily / 2-weekly", owner: "PM" },
    { id: newId("c"), audience: "Compliance", message: "FCA milestone updates, evidence asks", channel: "Email + 30-min weekly call", frequency: "Weekly", owner: "Compliance lead" },
    { id: newId("c"), audience: "Beta users", message: "Onboarding, feedback channels, release notes", channel: "Email + in-app banner", frequency: "Bi-weekly", owner: "Lead BA" },
    { id: newId("c"), audience: "All paid customers", message: "Launch teaser, GA announcement, comms plan", channel: "Email + blog", frequency: "Once per milestone", owner: "Marketing" },
    { id: newId("c"), audience: "Wider company", message: "Project status summary, wins, risks", channel: "All-hands written update", frequency: "Monthly", owner: "PM" },
  ],
});

export const defaultChangeRequest = () => ({
  crNumber: "CR-001",
  projectName: "Open Banking integration",
  raisedBy: "Lead engineer",
  raisedDate: new Date().toISOString().slice(0, 10),
  decisionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  changeSummary: "Add a fallback to Plaid UK as a second AISP provider.",
  reason: "FCA approval risk. If our AISP application slips past the build date we need a Plan B to keep the launch on schedule.",
  scopeImpact: "Add abstraction layer so we can route per bank to either TrueLayer or Plaid. Adds 2 person-weeks of engineering effort.",
  costImpact: "+£4,500 build cost. Plaid baseline pricing is comparable to TrueLayer; no ongoing cost increase if not used.",
  timeImpact: "Adds 1 week to schedule when run in parallel with main build.",
  riskImpact: "Reduces the FCA-delay risk from R to A. Slightly increases vendor-management overhead.",
  alternativesConsidered: "Wait for FCA approval (current plan, exposes us to schedule risk). Switch entirely to Plaid (loses TrueLayer's UK-specific advantages).",
  recommendation: "Approve the change. Schedule and cost overhead are modest given the regulatory risk it removes.",
  approverName: "Bob",
  approverTitle: "Sponsor",
  status: "Pending",
});

export const defaultLessonsLearned = () => ({
  projectName: "Open Banking integration",
  phase: "End of Beta",
  date: new Date().toISOString().slice(0, 10),
  pm: "Bob",
  rows: [
    { id: newId("ll"), category: "What worked", label: "Daily standup with compliance", detail: "Weekly cadence wasn't enough during FCA approval. Daily 15-min sync caught issues a week earlier than the previous cycle.", recommendation: "Default to daily sync any time a regulatory dependency is on the critical path." },
    { id: newId("ll"), category: "What worked", label: "30-user beta cohort", detail: "Sized the beta so we could read every piece of feedback. Larger cohorts in past projects got noisy.", recommendation: "Cap beta at 30 for any feature with a behavioural learning goal." },
    { id: newId("ll"), category: "What didn't", label: "Categorisation rules library", detail: "Started with 50 suppliers; should have started with the top-100 ranked by user spend.", recommendation: "Always seed from real user data, not assumed coverage." },
    { id: newId("ll"), category: "What didn't", label: "Initial sync performance", detail: "First 24-month sync took up to 3 minutes for active accounts. Customers thought the connection had failed.", recommendation: "Always ship with a progress indicator and a 'we'll email you when done' fallback for >60s ops." },
    { id: newId("ll"), category: "Recommendation", label: "FCA pre-application meeting", detail: "Pre-application meeting saved at least 4 weeks vs. learning the rules during the formal process.", recommendation: "Book pre-application meetings on day 1 of any FCA-touching project." },
  ],
});

export const defaultMilestoneRoadmap = () => ({
  projectName: "Open Banking integration",
  pm: "Bob",
  date: new Date().toISOString().slice(0, 10),
  milestones: [
    { id: newId("m"), label: "Project kick-off", weekOffset: 0, lane: "Plan", complete: true, note: "Charter and BRD signed off" },
    { id: newId("m"), label: "FCA pre-application meeting", weekOffset: 2, lane: "Plan", complete: true, note: "" },
    { id: newId("m"), label: "TrueLayer sandbox connected", weekOffset: 4, lane: "Build", complete: true, note: "" },
    { id: newId("m"), label: "Connect / consent UX shipped", weekOffset: 6, lane: "Build", complete: false, note: "" },
    { id: newId("m"), label: "Categorisation engine v1", weekOffset: 8, lane: "Build", complete: false, note: "Top-100 rules library" },
    { id: newId("m"), label: "FCA AISP approval received", weekOffset: 9, lane: "Compliance", complete: false, note: "Critical path" },
    { id: newId("m"), label: "Beta with 30 users", weekOffset: 10, lane: "Launch", complete: false, note: "" },
    { id: newId("m"), label: "GA launch", weekOffset: 12, lane: "Launch", complete: false, note: "Comms + email + blog" },
  ],
  totalWeeks: 12,
});
