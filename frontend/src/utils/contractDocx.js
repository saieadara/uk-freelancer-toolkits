import { Document, HeadingLevel, ImageRun, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";

const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const hex = (colour, fallback) => String(colour || fallback).replace("#", "").toUpperCase();
const p = (text, colours) => new Paragraph({ children: [new TextRun({ text: text || " ", color: colours.font, size: 21 })], spacing: { after: 100 } });
const h = (text, colours) => new Paragraph({ children: [new TextRun({ text, bold: true, color: colours.font, size: 32 })], heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 } });
const clause = (number, title, text, colours) => [new Paragraph({ children: [new TextRun({ text: `${number}. ${title}`, bold: true, color: colours.accent, size: 25 })], spacing: { before: 140, after: 80 } }), p(text, colours)];
const lines = (text, colours) => String(text || "").split("\n").filter(Boolean).map((line) => new Paragraph({ children: [new TextRun({ text: line, color: colours.font })], bullet: { level: 0 }, spacing: { after: 70 } }));
const infoTable = (rows, colours) => new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map(([label, value]) => new TableRow({ children: [new TableCell({ shading: { fill: colours.document }, width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, color: colours.accent })] })] }), new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, children: [p(value, colours)] })] })) });
const imageParagraph = async (image, width = 90, height = 90) => {
  if (!image) return [];
  try {
    const bytes = new Uint8Array(await (await fetch(image)).arrayBuffer());
    return [new Paragraph({ children: [new ImageRun({ data: bytes, transformation: { width, height } })], spacing: { after: 90 } })];
  } catch (_error) { return []; }
};

export const downloadContractDocx = async (contract) => {
  const colours = { document: hex(contract.documentColor, "FFF5F5"), font: hex(contract.fontColor, "202020"), accent: hex(contract.accentColor, "C24A4A") };
  const logo = await imageParagraph(contract.brandLogo, 90, 90);
  const consultantSignature = await imageParagraph(contract.consultantSignatureImage, 160, 55);
  const clientSignature = await imageParagraph(contract.clientSignatureImage, 160, 55);
  const doc = new Document({
    creator: "UK Freelancer Toolkit",
    title: `${contract.contractTitle} - ${contract.consultantBusiness}`,
    background: { color: colours.document },
    sections: [{ properties: {}, children: [
      ...logo,
      new Paragraph({ children: [new TextRun({ text: contract.contractTitle, bold: true, color: colours.font, size: 46 })], heading: HeadingLevel.TITLE, spacing: { after: 160 } }),
      p(`Effective date: ${contract.effectiveDate}`, colours),
      p(`Consultant: ${contract.consultantBusiness} (${contract.consultantName})`, colours),
      p(`Client: ${contract.clientBusiness} (${contract.clientName})`, colours),
      h("Party Information", colours),
      infoTable([["Consultant address", contract.consultantAddress], ["Consultant email", contract.consultantEmail], ["Consultant phone", contract.consultantPhone], ["Client address", contract.clientAddress], ["Client email", contract.clientEmail]], colours),
      h("Engagement", colours),
      ...clause("1", "Appointment", `The client appoints the consultant to provide services for ${contract.projectName}.`, colours),
      ...clause("2", "Purpose", contract.purpose, colours),
      new Paragraph({ children: [new TextRun({ text: "3. Objectives", bold: true, color: colours.accent, size: 25 })] }),
      ...lines(contract.objectives, colours),
      h("Scope and Deliverables", colours),
      new Paragraph({ children: [new TextRun({ text: "4. Scope of Work", bold: true, color: colours.accent, size: 25 })] }),
      ...lines(contract.scopeOfWork, colours),
      ...clause("5", "Out of Scope", contract.outOfScope, colours),
      new Paragraph({ children: [new TextRun({ text: "6. Deliverables", bold: true, color: colours.accent, size: 25 })] }),
      ...lines(contract.deliverables, colours),
      ...clause("7", "Term", `${contract.term} Start date: ${contract.startDate}${contract.endDate ? ` End date: ${contract.endDate}.` : ""}`, colours),
      h("Fees and Payment", colours),
      infoTable([["Fee structure", contract.feeStructure], ["Fee amount", contract.feeAmount], ["Payment schedule", contract.paymentSchedule], ["Late payment", contract.latePayment], ["Expenses", contract.expenses]], colours),
      h("Legal Terms", colours),
      ...clause("8", "Client Responsibilities", contract.clientResponsibilities, colours),
      ...clause("9", "Confidentiality", contract.confidentiality, colours),
      ...clause("10", "Intellectual Property", contract.intellectualProperty, colours),
      ...clause("11", "Independent Contractor", contract.independentContractor, colours),
      ...clause("12", "Termination", contract.termination, colours),
      ...clause("13", "Liability", contract.liability, colours),
      ...clause("14", "Governing Law", `This agreement is governed by the laws of ${contract.governingLaw}.`, colours),
      ...clause("15", "Notices", contract.notices, colours),
      h("Signatures", colours),
      new Paragraph({ children: [new TextRun({ text: "Consultant", bold: true, color: colours.accent })] }),
      ...(consultantSignature.length ? consultantSignature : [p(`Typed signature: ${contract.consultantSignatureName || contract.consultantName}`, colours)]),
      p(`Title: ${contract.consultantSignatureTitle || "Consultant"}`, colours),
      p(`Date: ${contract.consultantSignatureDate || contract.signatureDate}`, colours),
      new Paragraph({ children: [new TextRun({ text: "Client", bold: true, color: colours.accent })] }),
      ...(clientSignature.length ? clientSignature : [p(`Typed signature: ${contract.clientSignatureName || contract.clientName}`, colours)]),
      p(`Title: ${contract.clientSignatureTitle || "Client"}`, colours),
      p(`Date: ${contract.clientSignatureDate || contract.signatureDate}`, colours),
      p(contract.disclaimer, colours),
    ] }],
  });
  const blob = await Packer.toBlob(doc);
  saveBlob(blob, `${(contract.consultantBusiness || "consulting-contract").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-client-contract.docx`);
};