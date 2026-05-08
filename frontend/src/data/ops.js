import { Handshake, Target, Users, Trophy } from "lucide-react";

export const opsCards = [
  {
    id: "founder-agreement",
    title: "Founder Agreement & Vesting",
    eyebrow: "Co-founder split",
    description: "Document founder equity splits, roles, vesting schedules, and IP assignment. Avoid the classic 'we never wrote it down' mistake.",
    path: "/ops/founder-agreement",
    action: "Build agreement",
    Icon: Handshake,
  },
  {
    id: "okr-tracker",
    title: "OKR Tracker",
    eyebrow: "Quarterly goals",
    description: "Set 3 objectives and 3-5 measurable key results per quarter. Track progress, weight, and confidence — exportable as a goal sheet.",
    path: "/ops/okr-tracker",
    action: "Track OKRs",
    Icon: Target,
  },
  {
    id: "interview-script",
    title: "Customer Interview Script",
    eyebrow: "Discovery",
    description: "Build a problem / solution interview script following The Mom Test pattern: warm-up, behaviour, pain, current solutions, willingness to pay.",
    path: "/ops/interview-script",
    action: "Generate script",
    Icon: Users,
  },
  {
    id: "competitor-matrix",
    title: "Competitor Analysis Matrix",
    eyebrow: "Positioning",
    description: "Score competitors against the criteria your customers care about and see where you genuinely differentiate.",
    path: "/ops/competitor-matrix",
    action: "Build matrix",
    Icon: Trophy,
  },
];

const newId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export const defaultFounderAgreement = () => ({
  companyName: "Northstar Studio Ltd",
  effectiveDate: new Date().toISOString().slice(0, 10),
  governingLaw: "England and Wales",
  vestingSummary: "All founder equity vests over 4 years with a 1-year cliff (25% on the first anniversary), then monthly thereafter (1/48). Unvested shares are bought back at nominal value if a founder leaves.",
  ipAssignment: "Each founder assigns to the Company all intellectual property created in connection with the business, whether before incorporation or after.",
  decisionMaking: "Day-to-day decisions: by the responsible founder. Strategic decisions (raising capital, hiring senior leadership, taking on debt over £25k, sale of the business): unanimous founder approval.",
  exitClause: "If a founder voluntarily leaves before the cliff: all shares revert. After the cliff: only vested shares retained. 'Bad leaver' (gross misconduct, breach): all shares forfeit at nominal value.",
  founders: [
    { id: newId("founder"), name: "Founder A", role: "CEO — strategy, fundraising, sales", equityPercent: 50, sharesGranted: 500000, vestingMonths: 48, cliffMonths: 12, fullTime: true },
    { id: newId("founder"), name: "Founder B", role: "CTO — product, engineering", equityPercent: 50, sharesGranted: 500000, vestingMonths: 48, cliffMonths: 12, fullTime: true },
  ],
});

export const defaultOkrTracker = () => ({
  quarter: "Q2 2026",
  companyTheme: "Reach product-market fit with paying UK SMEs.",
  objectives: [
    {
      id: newId("obj"),
      title: "Land 50 paying customers on the Pro plan",
      keyResults: [
        { id: newId("kr"), title: "Drive 4,000 visits/mo from organic UK searches", target: 4000, current: 1500, unit: "visits", confidence: 60 },
        { id: newId("kr"), title: "Convert 8% of trials to paid", target: 8, current: 4.5, unit: "%", confidence: 50 },
        { id: newId("kr"), title: "Launch annual plan and convert 20% of new paid users", target: 20, current: 0, unit: "%", confidence: 40 },
      ],
    },
    {
      id: newId("obj"),
      title: "Improve activation so 60% of trials reach a-ha moment in week 1",
      keyResults: [
        { id: newId("kr"), title: "Cut signup-to-first-export from 14 mins to 5 mins", target: 5, current: 11, unit: "mins", confidence: 70 },
        { id: newId("kr"), title: "Ship guided checklist + sample data in onboarding", target: 1, current: 0, unit: "ship", confidence: 80 },
      ],
    },
  ],
});

export const defaultInterviewScript = () => ({
  productHypothesis: "UK founders need a single tool to produce a polished business plan, contracts, and pitch deck without paying a lawyer or accountant up-front.",
  segment: "First-time UK founders, 0-12 months from launch, building a service or SaaS business with up to £100k of starting capital.",
  interviewerName: "Your Name",
  intervieweeName: "First Name Last Name",
  interviewDate: new Date().toISOString().slice(0, 10),
  durationMinutes: 30,
  rapportPrompts: "Thanks for taking the time. Quick context: I'm not selling anything today — I'm trying to understand how founders like you handle planning and admin in your first year. Mind if I record so I don't have to scribble?",
  warmup: [
    "Tell me about what you're building.",
    "How long have you been working on it?",
    "Walk me through a typical week — where does most of your time go?",
  ],
  behaviour: [
    "Last time you sat down to write a business plan or investor doc, what did you actually do?",
    "What tools or templates were on your screen?",
    "Where did you get stuck or skip ahead?",
  ],
  pain: [
    "When was the last time the lack of a structured plan caused a real problem? What happened?",
    "How much did that cost you in time or money?",
    "What did you do about it?",
  ],
  currentSolutions: [
    "What have you tried so far to solve this?",
    "What did you like about each? What stopped you using them?",
    "What would have to be true for you to switch tools?",
  ],
  willingnessToPay: [
    "If a tool did exactly this well, what would you pay per month? Per year?",
    "Who would actually approve that spend?",
    "What budget line does it come out of?",
  ],
  closing: "Final question: who else should I speak to who's tackling this same problem? Would you be open to me coming back in a few weeks with something to show you?",
});

export const defaultCompetitorMatrix = () => ({
  productName: "Northstar Studio",
  segment: "UK first-time founders",
  criteria: [
    { id: newId("crit"), label: "UK-specific (HMRC, IR35, SEIS)", weight: 25 },
    { id: newId("crit"), label: "Document export quality", weight: 20 },
    { id: newId("crit"), label: "Speed to first useful output", weight: 20 },
    { id: newId("crit"), label: "Pricing", weight: 15 },
    { id: newId("crit"), label: "Coverage of legal docs", weight: 20 },
  ],
  competitors: [
    {
      id: newId("comp"),
      name: "Northstar Studio",
      isUs: true,
      scores: { 0: 9, 1: 8, 2: 9, 3: 8, 4: 8 },
      notes: "UK-first, fast, integrated. Limited brand awareness.",
    },
    {
      id: newId("comp"),
      name: "Generic template marketplace",
      isUs: false,
      scores: { 0: 4, 1: 6, 2: 7, 3: 9, 4: 5 },
      notes: "Cheap and broad but not UK-specific or interactive.",
    },
    {
      id: newId("comp"),
      name: "Local accountant / consultant",
      isUs: false,
      scores: { 0: 9, 1: 7, 2: 3, 3: 3, 4: 7 },
      notes: "High quality bespoke output but slow and expensive.",
    },
  ],
});
