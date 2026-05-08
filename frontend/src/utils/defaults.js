import { addDaysIso, todayIso } from "./calculations";

export const defaultLineItems = [
  { id: "line-1", description: "Freelance consulting", quantity: 1, rate: 750 },
];

export const createDefaultDocument = (type = "invoice") => {
  const issueDate = todayIso();
  const prefix = type === "quote" ? "QUO" : "INV";
  return {
    documentType: type,
    documentNumber: `${prefix}-${new Date().getFullYear()}-001`,
    issueDate,
    dueDate: addDaysIso(issueDate, type === "quote" ? 14 : 30),
    terms: type === "quote" ? "Valid for 14 days" : "Net 30",
    senderName: "Your Business Name",
    senderAddress: "Your address\nUnited Kingdom",
    senderEmail: "hello@example.co.uk",
    senderVat: "GB 123 4567 89",
    clientName: "Client Business Name",
    clientAddress: "Client address\nUnited Kingdom",
    clientVat: "",
    items: defaultLineItems,
    vatMode: "standard",
    paymentDetails: "Bank: Your Bank\nSort code: 00-00-00\nAccount: 00000000",
    notes: type === "quote" ? "Thank you for the opportunity to quote for this work." : "Thank you for your business.",
  };
};

export const defaultReceipt = () => ({
  receiptNumber: `RCT-${new Date().getFullYear()}-001`,
  date: todayIso(),
  receivedFrom: "Client Name",
  description: "Payment for freelance services",
  paymentMethod: "Bank transfer",
  amount: 500,
  issuerName: "Your Business Name",
  issuerAddress: "Your address\nUnited Kingdom",
  notes: "Payment received with thanks.",
});