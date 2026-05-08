// Per-tool PPTX builders for the 6 minimal strategy artefacts.
// Uses pptxgenjs 3.x (browser-friendly) to produce a single 16:9 slide that mirrors the on-screen layout.
import PptxGenJS from "pptxgenjs";

const slugify = (value) => (value || "untitled").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const safe = (value, fallback = "—") => {
  const v = (value ?? "").toString().trim();
  return v.length ? v : fallback;
};

// Slide is 13.33 × 7.5 inches in WIDE layout
const SLIDE_W = 13.33;
const SLIDE_H = 7.5;
const COLOUR = {
  ink: "111111",
  muted: "6B7280",
  faint: "9CA3AF",
  border: "E5E7EB",
  bgLight: "FAFAFA",
  white: "FFFFFF",
  highlight: "111111",
};

const titleStyle = { fontFace: "Helvetica", fontSize: 22, bold: true, color: COLOUR.ink };
const eyebrowStyle = { fontFace: "Helvetica", fontSize: 9, color: COLOUR.muted, charSpacing: 4 };
const labelStyle = { fontFace: "Helvetica", fontSize: 8, bold: true, color: COLOUR.muted, charSpacing: 4 };
const bodyStyle = { fontFace: "Helvetica", fontSize: 10, color: "374151" };
const tinyStyle = { fontFace: "Helvetica", fontSize: 8, color: COLOUR.faint };

const newDeck = () => {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = "Strategy Artefact";
  return pptx;
};

const addHeader = (slide, eyebrow, title, subtitle) => {
  slide.addText(eyebrow.toUpperCase(), { x: 0.4, y: 0.3, w: 12.5, h: 0.25, ...eyebrowStyle });
  slide.addText(title, { x: 0.4, y: 0.55, w: 12.5, h: 0.6, ...titleStyle });
  if (subtitle) slide.addText(subtitle, { x: 0.4, y: 1.1, w: 12.5, h: 0.3, fontFace: "Helvetica", fontSize: 10, color: COLOUR.muted });
  slide.addShape("line", { x: 0.4, y: 1.4, w: 12.5, h: 0, line: { color: COLOUR.border, width: 1 } });
};

const addFooter = (slide, leftText, rightText) => {
  slide.addText(leftText || "", { x: 0.4, y: 7.15, w: 8, h: 0.25, fontFace: "Helvetica", fontSize: 8, color: COLOUR.faint });
  slide.addText(rightText || "", { x: 8.5, y: 7.15, w: 4.5, h: 0.25, fontFace: "Helvetica", fontSize: 8, color: COLOUR.faint, align: "right" });
};

// ------------- BCG -------------
const bcgQuadrantOf = (bu, growthT, shareT) => {
  const high = Number(bu.growth) >= Number(growthT);
  const big = Number(bu.share) >= Number(shareT);
  if (high && big) return "stars";
  if (!high && big) return "cows";
  if (high && !big) return "question";
  return "dogs";
};

export const exportBcgPptx = async (state) => {
  const pptx = newDeck();
  const slide = pptx.addSlide();
  slide.background = { color: COLOUR.white };

  addHeader(
    slide,
    `BCG Growth-Share Matrix · ${state.bus.length} BUs`,
    safe(state.productName, "Untitled portfolio"),
    `Growth threshold ${state.growthThreshold}% · Share threshold ${state.shareThreshold}× · ${state.date}`,
  );

  // 2x2 plot
  const plotX = 0.4;
  const plotY = 1.7;
  const plotW = 8.0;
  const plotH = 5.0;
  slide.addShape("rect", { x: plotX, y: plotY, w: plotW, h: plotH, line: { color: COLOUR.border, width: 1 }, fill: { color: COLOUR.bgLight } });
  slide.addShape("line", { x: plotX + plotW / 2, y: plotY, w: 0, h: plotH, line: { color: COLOUR.border, width: 1 } });
  slide.addShape("line", { x: plotX, y: plotY + plotH / 2, w: plotW, h: 0, line: { color: COLOUR.border, width: 1 } });

  const halfW = plotW / 2;
  const halfH = plotH / 2;
  // quadrant labels
  slide.addText("Stars · Invest", { x: plotX + 0.15, y: plotY + 0.1, w: halfW - 0.3, h: 0.25, ...labelStyle, color: COLOUR.ink });
  slide.addText("Question marks · Build or divest", { x: plotX + halfW + 0.15, y: plotY + 0.1, w: halfW - 0.3, h: 0.25, ...labelStyle, color: COLOUR.ink });
  slide.addText("Cash cows · Milk", { x: plotX + 0.15, y: plotY + halfH + 0.1, w: halfW - 0.3, h: 0.25, ...labelStyle, color: COLOUR.ink });
  slide.addText("Dogs · Divest", { x: plotX + halfW + 0.15, y: plotY + halfH + 0.1, w: halfW - 0.3, h: 0.25, ...labelStyle, color: COLOUR.ink });

  // axes
  slide.addText("Market growth", { x: plotX, y: plotY - 0.3, w: plotW, h: 0.25, ...tinyStyle, align: "center" });
  slide.addText("High share", { x: plotX, y: plotY + plotH + 0.05, w: halfW, h: 0.25, ...tinyStyle });
  slide.addText("Low share", { x: plotX + halfW, y: plotY + plotH + 0.05, w: halfW, h: 0.25, ...tinyStyle, align: "right" });

  // bubbles
  const GROWTH_MAX = 30;
  const SHARE_MAX = 4;
  const maxRevenue = Math.max(0, ...state.bus.map((b) => Number(b.revenue || 0)));
  state.bus.forEach((bu) => {
    const growth = Math.min(Math.max(Number(bu.growth || 0), 0), GROWTH_MAX);
    const share = Math.min(Math.max(Number(bu.share || 0), 0), SHARE_MAX);
    const yPct = 1 - growth / GROWTH_MAX;
    const xPct = 1 - share / SHARE_MAX; // BCG convention: high share on the left
    const r = Number(bu.revenue || 0);
    const norm = maxRevenue > 0 ? Math.sqrt(r / maxRevenue) : 0.5;
    const size = Math.max(0.35, Math.min(0.9, 0.35 + norm * 0.55));
    const cx = plotX + xPct * plotW;
    const cy = plotY + yPct * plotH;
    slide.addShape("ellipse", {
      x: cx - size / 2,
      y: cy - size / 2,
      w: size,
      h: size,
      line: { color: COLOUR.ink, width: 1.2 },
      fill: { color: COLOUR.ink, transparency: 88 },
    });
    slide.addText(safe(bu.name).slice(0, 2).toUpperCase(), {
      x: cx - size / 2,
      y: cy - size / 2,
      w: size,
      h: size,
      fontFace: "Helvetica",
      fontSize: 8,
      bold: true,
      align: "center",
      valign: "middle",
      color: COLOUR.ink,
    });
  });

  // BU side panel
  const sideX = 8.6;
  const sideY = 1.7;
  const sideW = 4.4;
  slide.addText("BUSINESS UNITS", { x: sideX, y: sideY, w: sideW, h: 0.25, ...labelStyle });
  const buRows = [["Unit", "Growth %", "Share ×", "Quadrant"]];
  state.bus.forEach((bu) => {
    const q = bcgQuadrantOf(bu, state.growthThreshold, state.shareThreshold);
    const qLabel = { stars: "Stars", cows: "Cash cows", question: "?", dogs: "Dogs" }[q];
    buRows.push([safe(bu.name), `${bu.growth}%`, `${bu.share}×`, qLabel]);
  });
  slide.addTable(buRows, {
    x: sideX,
    y: sideY + 0.3,
    w: sideW,
    fontFace: "Helvetica",
    fontSize: 9,
    color: COLOUR.ink,
    border: { type: "solid", color: COLOUR.border, pt: 0.5 },
  });

  // strategy guide footer (4 columns)
  const guides = [
    { name: "Stars", action: "Invest", desc: "Leaders — invest to maintain dominance and fund future cash." },
    { name: "Question marks", action: "Build or divest", desc: "Selectively invest if they can become stars; otherwise divest." },
    { name: "Cash cows", action: "Milk", desc: "Mature, profitable — milk to fund stars and selected question marks." },
    { name: "Dogs", action: "Divest", desc: "Weak — divest, liquidate, or reposition." },
  ];
  guides.forEach((g, i) => {
    const x = 0.4 + i * 3.2;
    slide.addText([
      { text: `${g.name} `, options: { bold: true, fontSize: 9, color: COLOUR.ink } },
      { text: `· ${g.action}`, options: { fontSize: 9, color: COLOUR.muted } },
      { text: `\n${g.desc}`, options: { fontSize: 8.5, color: "374151" } },
    ], { x, y: 6.85, w: 3.1, h: 0.5 });
  });

  addFooter(slide, "BCG Growth-Share Matrix · UK Freelancer Toolkit", state.date);
  await pptx.writeFile({ fileName: `${slugify(state.productName)}-bcg.pptx` });
};

// ------------- Ansoff -------------
export const exportAnsoffPptx = async (state) => {
  const pptx = newDeck();
  const slide = pptx.addSlide();
  slide.background = { color: COLOUR.white };

  addHeader(slide, "Ansoff Matrix · Product/Market Expansion Grid", safe(state.productName, "Untitled"), state.date);

  // axis labels
  slide.addText("PRODUCTS →", { x: 2.4, y: 1.6, w: 10.5, h: 0.25, ...labelStyle });
  slide.addText("Existing", { x: 2.4, y: 1.85, w: 5.25, h: 0.3, fontFace: "Helvetica", fontSize: 10, color: COLOUR.muted, align: "center" });
  slide.addText("New", { x: 7.65, y: 1.85, w: 5.25, h: 0.3, fontFace: "Helvetica", fontSize: 10, color: COLOUR.muted, align: "center" });
  slide.addText("MARKETS ↓", { x: 0.4, y: 2.2, w: 1.9, h: 0.25, ...labelStyle });

  // 2x2 cells
  const cellW = 5.2;
  const cellH = 2.0;
  const cells = [
    { x: 2.4, y: 2.2, label: "Existing", risk: 1, name: "Market penetration", desc: "Sell more of existing products to existing customers.", value: state.marketPenetration },
    { x: 7.65, y: 2.2, label: null, risk: 2, name: "Product development", desc: "New products for current customers.", value: state.productDevelopment },
    { x: 2.4, y: 4.3, label: "New", risk: 3, name: "Market development", desc: "Existing products in new markets / segments.", value: state.marketDevelopment },
    { x: 7.65, y: 4.3, label: null, risk: 4, name: "Diversification", desc: "New products in new markets. Highest risk.", value: state.diversification },
  ];
  cells.forEach((c) => {
    if (c.label) slide.addText(c.label, { x: 0.4, y: c.y + cellH / 2 - 0.15, w: 1.9, h: 0.3, fontFace: "Helvetica", fontSize: 10, color: COLOUR.muted, align: "center" });
    slide.addShape("rect", { x: c.x, y: c.y, w: cellW, h: cellH, line: { color: COLOUR.border, width: 1 }, fill: { color: COLOUR.white } });
    slide.addText([
      { text: c.name, options: { bold: true, fontSize: 11, color: COLOUR.ink } },
      { text: `   Risk ${c.risk}`, options: { fontSize: 8, color: COLOUR.muted } },
    ], { x: c.x + 0.15, y: c.y + 0.1, w: cellW - 0.3, h: 0.3 });
    slide.addText(c.desc, { x: c.x + 0.15, y: c.y + 0.4, w: cellW - 0.3, h: 0.3, fontFace: "Helvetica", fontSize: 8.5, color: COLOUR.faint });
    slide.addText(safe(c.value), { x: c.x + 0.15, y: c.y + 0.7, w: cellW - 0.3, h: cellH - 0.85, fontFace: "Helvetica", fontSize: 9.5, color: "374151", valign: "top" });
  });

  // mnemonic + recommendation
  slide.addText([
    { text: "Memory hook · ", options: { fontSize: 9, color: COLOUR.muted } },
    { text: "Coca-Cola sells more · Apple builds newer · Netflix goes wider · Amazon branches out", options: { fontSize: 9, color: COLOUR.ink, bold: true } },
  ], { x: 0.4, y: 6.4, w: 12.5, h: 0.3 });

  slide.addText([
    { text: "Recommendation · ", options: { bold: true, fontSize: 9.5, color: COLOUR.ink } },
    { text: safe(state.recommendation), options: { fontSize: 9.5, color: "374151" } },
  ], { x: 0.4, y: 6.75, w: 12.5, h: 0.4 });

  addFooter(slide, "Ansoff Matrix · UK Freelancer Toolkit", state.date);
  await pptx.writeFile({ fileName: `${slugify(state.productName)}-ansoff.pptx` });
};

// ------------- PESTEL -------------
export const exportPestelPptx = async (state) => {
  const pptx = newDeck();
  const slide = pptx.addSlide();
  slide.background = { color: COLOUR.white };

  const total = Object.values(state.factors).reduce((sum, f) => sum + Number(f.impact || 0), 0);
  addHeader(slide, "PESTEL · Macro Environment Scan", safe(state.productName), `${state.scope} · Total impact ${total}/30 · ${state.date}`);

  const factors = [
    { id: "political", letter: "P", label: "Political" },
    { id: "economic", letter: "E", label: "Economic" },
    { id: "social", letter: "S", label: "Social" },
    { id: "technology", letter: "T", label: "Technological" },
    { id: "environmental", letter: "E", label: "Environmental" },
    { id: "legal", letter: "L", label: "Legal" },
  ];

  // 3x2 grid
  const gridX = 0.4;
  const gridY = 1.7;
  const cellW = 4.2;
  const cellH = 2.4;
  factors.forEach((factor, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = gridX + col * (cellW + 0.1);
    const y = gridY + row * (cellH + 0.1);
    const value = state.factors[factor.id];
    slide.addShape("rect", { x, y, w: cellW, h: cellH, line: { color: COLOUR.border, width: 1 }, fill: { color: COLOUR.white } });
    slide.addShape("rect", { x: x + 0.15, y: y + 0.15, w: 0.3, h: 0.3, line: { color: COLOUR.ink, width: 0 }, fill: { color: COLOUR.ink } });
    slide.addText(factor.letter, { x: x + 0.15, y: y + 0.15, w: 0.3, h: 0.3, fontFace: "Helvetica", fontSize: 11, bold: true, color: COLOUR.white, align: "center", valign: "middle" });
    slide.addText(factor.label, { x: x + 0.55, y: y + 0.15, w: cellW - 1.1, h: 0.3, fontFace: "Helvetica", fontSize: 10, bold: true, color: COLOUR.ink });
    slide.addText(`${value.impact}/5`, { x: x + cellW - 0.55, y: y + 0.15, w: 0.4, h: 0.3, fontFace: "Helvetica", fontSize: 9, color: COLOUR.muted, align: "right" });
    slide.addText(safe(value.items), { x: x + 0.15, y: y + 0.6, w: cellW - 0.3, h: cellH - 0.75, fontFace: "Helvetica", fontSize: 9, color: "374151", valign: "top" });
  });

  slide.addText([
    { text: "Top 3 forces · ", options: { bold: true, fontSize: 9.5, color: COLOUR.ink } },
    { text: safe(state.topForces), options: { fontSize: 9.5, color: "374151" } },
  ], { x: 0.4, y: 6.7, w: 12.5, h: 0.25 });
  slide.addText([
    { text: "Implications · ", options: { bold: true, fontSize: 9.5, color: COLOUR.ink } },
    { text: safe(state.implications), options: { fontSize: 9.5, color: "374151" } },
  ], { x: 0.4, y: 6.95, w: 12.5, h: 0.25 });

  addFooter(slide, "PESTEL · UK Freelancer Toolkit", state.date);
  await pptx.writeFile({ fileName: `${slugify(state.productName)}-pestel.pptx` });
};

// ------------- BMC (Osterwalder) -------------
export const exportBmcPptx = async (state) => {
  const pptx = newDeck();
  const slide = pptx.addSlide();
  slide.background = { color: COLOUR.white };

  addHeader(slide, "Business Model Canvas · Osterwalder", safe(state.productName), state.date);

  // 9-block canvas (4 rows of cells, but proper Osterwalder layout)
  const canvasX = 0.4;
  const canvasY = 1.7;
  const canvasW = 12.5;
  const topRowH = 4.0;
  const bottomRowH = 1.4;
  const colW = canvasW / 5;

  // Top region: 5 columns × 2 sub-rows for split cells
  const cells = [
    { id: "partners", title: "Key partners", x: canvasX, y: canvasY, w: colW, h: topRowH, value: state.partners },
    { id: "activities", title: "Key activities", x: canvasX + colW, y: canvasY, w: colW, h: topRowH / 2, value: state.activities },
    { id: "resources", title: "Key resources", x: canvasX + colW, y: canvasY + topRowH / 2, w: colW, h: topRowH / 2, value: state.resources },
    { id: "value", title: "Value proposition", x: canvasX + 2 * colW, y: canvasY, w: colW, h: topRowH, value: state.value, accent: true },
    { id: "relationships", title: "Customer relationships", x: canvasX + 3 * colW, y: canvasY, w: colW, h: topRowH / 2, value: state.relationships },
    { id: "channels", title: "Channels", x: canvasX + 3 * colW, y: canvasY + topRowH / 2, w: colW, h: topRowH / 2, value: state.channels },
    { id: "segments", title: "Customer segments", x: canvasX + 4 * colW, y: canvasY, w: colW, h: topRowH, value: state.segments },
    { id: "cost", title: "Cost structure", x: canvasX, y: canvasY + topRowH, w: canvasW / 2, h: bottomRowH, value: state.cost },
    { id: "revenue", title: "Revenue streams", x: canvasX + canvasW / 2, y: canvasY + topRowH, w: canvasW / 2, h: bottomRowH, value: state.revenue },
  ];
  cells.forEach((c) => {
    slide.addShape("rect", { x: c.x, y: c.y, w: c.w, h: c.h, line: { color: COLOUR.border, width: 1 }, fill: { color: c.accent ? COLOUR.bgLight : COLOUR.white } });
    slide.addText(c.title, { x: c.x + 0.1, y: c.y + 0.08, w: c.w - 0.2, h: 0.3, fontFace: "Helvetica", fontSize: 10, bold: true, color: COLOUR.ink });
    slide.addText(safe(c.value), { x: c.x + 0.1, y: c.y + 0.4, w: c.w - 0.2, h: c.h - 0.5, fontFace: "Helvetica", fontSize: 8.5, color: "374151", valign: "top" });
  });

  slide.addText([
    { text: "Riskiest assumption · ", options: { bold: true, fontSize: 9.5, color: COLOUR.ink } },
    { text: safe(state.riskiestAssumption), options: { fontSize: 9.5, color: "374151" } },
  ], { x: 0.4, y: 7.15, w: 12.5, h: 0.3 });

  addFooter(slide, "Business Model Canvas · UK Freelancer Toolkit", state.date);
  await pptx.writeFile({ fileName: `${slugify(state.productName)}-bmc.pptx` });
};

// ------------- VRIO -------------
const verdictOf = (r) => {
  if (!r.valuable) return "Disadvantage";
  if (!r.rare) return "Parity";
  if (!r.imitable) return "Temporary";
  if (!r.organised) return "Unused";
  return "Sustained";
};

export const exportVrioPptx = async (state) => {
  const pptx = newDeck();
  const slide = pptx.addSlide();
  slide.background = { color: COLOUR.white };

  addHeader(slide, "VRIO · Resource-Based View", safe(state.productName), state.date);

  const rows = [["Resource / capability", "V", "R", "I", "O", "Verdict", "Note"]];
  state.resources.forEach((r) => {
    rows.push([
      safe(r.name),
      r.valuable ? "✓" : "—",
      r.rare ? "✓" : "—",
      r.imitable ? "✓" : "—",
      r.organised ? "✓" : "—",
      verdictOf(r),
      safe(r.note),
    ]);
  });

  slide.addTable(rows, {
    x: 0.4,
    y: 1.7,
    w: 12.5,
    fontFace: "Helvetica",
    fontSize: 10,
    color: COLOUR.ink,
    border: { type: "solid", color: COLOUR.border, pt: 0.5 },
    colW: [3.4, 0.7, 0.7, 0.7, 0.7, 1.6, 4.7],
  });

  addFooter(slide, "VRIO Framework · UK Freelancer Toolkit", state.date);
  await pptx.writeFile({ fileName: `${slugify(state.productName)}-vrio.pptx` });
};

// ------------- RCA -------------
export const exportRcaPptx = async (state) => {
  const pptx = newDeck();
  const slide = pptx.addSlide();
  slide.background = { color: COLOUR.white };

  addHeader(slide, "5 Whys + Fishbone · Root Cause Diagnosis", safe(state.problem).slice(0, 90), `${state.detectedDate} · Owner ${state.owner}`);

  // Why cascade across the slide
  const cascadeY = 1.7;
  const cascadeH = 2.2;
  const padding = 0.15;
  const gap = 0.1;
  const totalW = 12.5;
  const stepW = (totalW - gap * (state.whys.length - 1)) / Math.max(state.whys.length, 1);
  state.whys.forEach((why, i) => {
    const x = 0.4 + i * (stepW + gap);
    slide.addShape("rect", { x, y: cascadeY, w: stepW, h: cascadeH, line: { color: COLOUR.border, width: 1 }, fill: { color: COLOUR.white } });
    slide.addText(`Why ${i + 1}`, { x: x + padding, y: cascadeY + padding, w: stepW - padding * 2, h: 0.25, ...labelStyle });
    slide.addText(safe(why.question), { x: x + padding, y: cascadeY + 0.45, w: stepW - padding * 2, h: 0.55, fontFace: "Helvetica", fontSize: 9.5, bold: true, color: COLOUR.ink });
    slide.addText(safe(why.answer), { x: x + padding, y: cascadeY + 1.05, w: stepW - padding * 2, h: cascadeH - 1.2, fontFace: "Helvetica", fontSize: 9, color: "374151", valign: "top" });
  });

  // fishbone (optional)
  let yCursor = cascadeY + cascadeH + 0.25;
  if (state.fishboneEnabled) {
    const cats = [
      { id: "people", label: "People" },
      { id: "process", label: "Process" },
      { id: "technology", label: "Technology" },
      { id: "materials", label: "Materials" },
      { id: "environment", label: "Environment" },
      { id: "measurement", label: "Measurement" },
    ];
    const cellW = 12.5 / 6 - 0.05;
    const cellH = 1.4;
    cats.forEach((cat, i) => {
      const x = 0.4 + i * (cellW + 0.05);
      slide.addShape("rect", { x, y: yCursor, w: cellW, h: cellH, line: { color: COLOUR.border, width: 1 }, fill: { color: COLOUR.bgLight } });
      slide.addText(cat.label, { x: x + 0.1, y: yCursor + 0.08, w: cellW - 0.2, h: 0.25, fontFace: "Helvetica", fontSize: 9, bold: true, color: COLOUR.ink });
      slide.addText(safe(state.fishbone?.[cat.id]), { x: x + 0.1, y: yCursor + 0.35, w: cellW - 0.2, h: cellH - 0.45, fontFace: "Helvetica", fontSize: 8.5, color: "374151", valign: "top" });
    });
    yCursor += cellH + 0.15;
  }

  // root cause + countermeasure strip
  slide.addShape("rect", { x: 0.4, y: yCursor, w: 12.5, h: 7.4 - yCursor, line: { color: COLOUR.ink, width: 1 }, fill: { color: COLOUR.white } });
  slide.addText("ROOT CAUSE + COUNTERMEASURE", { x: 0.55, y: yCursor + 0.08, w: 12.2, h: 0.22, ...labelStyle, color: COLOUR.ink });
  slide.addText([
    { text: "Cause · ", options: { bold: true, fontSize: 9, color: COLOUR.ink } },
    { text: safe(state.rootCause), options: { fontSize: 9, color: "374151" } },
  ], { x: 0.55, y: yCursor + 0.32, w: 12.2, h: 0.3 });
  slide.addText([
    { text: "Action · ", options: { bold: true, fontSize: 9, color: COLOUR.ink } },
    { text: `${safe(state.countermeasure)}  ·  Owner ${safe(state.owner2)}  ·  Due ${safe(state.deadline)}`, options: { fontSize: 9, color: "374151" } },
  ], { x: 0.55, y: yCursor + 0.6, w: 12.2, h: 0.3 });

  addFooter(slide, "5 Whys + Ishikawa · UK Freelancer Toolkit", state.detectedDate);
  await pptx.writeFile({ fileName: `rca-${slugify(state.detectedDate)}.pptx` });
};
