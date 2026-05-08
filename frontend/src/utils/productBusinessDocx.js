import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { managementPrdSections } from "../data/productBusiness";

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

export const downloadProductBusinessDocx = async (state) => {
  const doc = new Document({
    creator: "UK Freelancer Toolkit",
    title: "All-in-One Product Business Management System PRD",
    sections: [{ properties: {}, children: [
      new Paragraph({ text: "All-in-One Product Business Management System", heading: HeadingLevel.TITLE, spacing: { after: 180 } }),
      new Paragraph({ children: [new TextRun("Integrated workspace replacing purchases, inventory, production, sales, invoices, reports, tasks, and employee spreadsheets.")], spacing: { after: 180 } }),
      ...managementPrdSections.flatMap(([title, body]) => [new Paragraph({ text: title, heading: HeadingLevel.HEADING_1, spacing: { before: 180, after: 80 } }), new Paragraph({ text: body, spacing: { after: 100 } })]),
      new Paragraph({ text: "Seed Data Snapshot", heading: HeadingLevel.HEADING_1, spacing: { before: 220, after: 120 } }),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        ["Products", String(state.products.length)], ["Suppliers", String(state.suppliers.length)], ["Clients", String(state.clients.length)], ["Purchases", String(state.purchases.length)], ["Invoices", String(state.invoices.length)], ["Tasks", String(state.tasks.length)], ["Employees", String(state.employees.length)],
      ].map(([label, value]) => new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })] }), new TableCell({ children: [new Paragraph(value)] })] })) }),
    ] }],
  });
  saveBlob(await Packer.toBlob(doc), "product-business-management-system-prd.docx");
};