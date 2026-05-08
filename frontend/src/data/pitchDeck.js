export const pitchDeckSlides = [
  {
    id: "title",
    number: 1,
    label: "Title",
    prompt: "Company name, one-line tagline, founder name, and date.",
    placeholder: "Northstar Studio — practical launch planning for ambitious founders.\nFounder: Your Name · April 2026",
  },
  {
    id: "problem",
    number: 2,
    label: "Problem",
    prompt: "What pain are you solving? Who feels it most acutely?",
    placeholder: "Founders waste months on scattered planning docs. They need clarity, not more software.",
  },
  {
    id: "solution",
    number: 3,
    label: "Solution",
    prompt: "What is your product? What outcome does it create?",
    placeholder: "A guided toolkit that turns ideas into investor-ready plans, contracts, and pitch decks in one afternoon.",
  },
  {
    id: "market",
    number: 4,
    label: "Market",
    prompt: "Total addressable market, segment you'll win first, why now.",
    placeholder: "TAM £820m UK SME planning software. Beachhead: 50k newly-formed Ltds per year on Companies House.",
  },
  {
    id: "product",
    number: 5,
    label: "Product",
    prompt: "Show the product. Screenshots, key flows, what makes it feel inevitable.",
    placeholder: "Live builder with editable sections, branded PDF + Word export, and a UK-specific compliance layer (VAT, IR35, SEIS).",
  },
  {
    id: "traction",
    number: 6,
    label: "Traction",
    prompt: "Real numbers — users, revenue, growth, retention, partnerships.",
    placeholder: "1,200 founders signed up in 90 days · £18k MRR · 9% MoM growth · 38 paying customers.",
  },
  {
    id: "businessModel",
    number: 7,
    label: "Business Model",
    prompt: "How you make money. Pricing, ACV, payback, margins.",
    placeholder: "£29/mo Pro plan, £99/mo Studio plan. 78% gross margin. CAC payback in 4 months.",
  },
  {
    id: "competition",
    number: 8,
    label: "Competition",
    prompt: "How you're different from incumbents and what you do better.",
    placeholder: "Generic legal templates lack UK specificity. Accounting software is overkill. We sit in the middle: opinionated, fast, UK-native.",
  },
  {
    id: "team",
    number: 9,
    label: "Team",
    prompt: "Founders + key hires. Why this team will win.",
    placeholder: "Founder: 8 yrs running an agency for SMEs · Co-founder: ex-HMRC tax adviser · Lead engineer: scaled two SaaS products to acquisition.",
  },
  {
    id: "ask",
    number: 10,
    label: "The Ask",
    prompt: "How much you're raising, valuation, what the money does, milestones.",
    placeholder: "Raising £600k SEIS+EIS at £4m post. 18 months runway. Goal: £75k MRR and Series A readiness by Q2 2027.",
  },
];

export const defaultPitchDeck = () => {
  const slides = {};
  pitchDeckSlides.forEach((slide) => {
    slides[slide.id] = "";
  });
  return {
    company: "Northstar Studio",
    tagline: "Practical launch planning for ambitious founders.",
    founder: "Your Name",
    deckDate: new Date().toISOString().slice(0, 10),
    slides,
  };
};
