export const vatModes = {
  standard: { label: "Standard 20%", rate: 0.2, note: "VAT charged at the UK standard rate." },
  exempt: { label: "Exempt", rate: 0, note: "VAT exempt supply." },
  outside: { label: "Outside scope", rate: 0, note: "Outside the scope of UK VAT." },
  reverse: { label: "Reverse charge", rate: 0, note: "Reverse charge: customer to account for VAT." },
};

export const formatMoney = (value) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(value || 0));

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const addDaysIso = (dateIso, days) => {
  const date = new Date(dateIso || todayIso());
  date.setDate(date.getDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
};

export const calculateLineAmount = (item) => Number(item.quantity || 0) * Number(item.rate || 0);

export const calculateDocumentTotals = (items, vatMode = "standard") => {
  const subtotal = items.reduce((sum, item) => sum + calculateLineAmount(item), 0);
  const vatRate = vatModes[vatMode]?.rate || 0;
  const vat = subtotal * vatRate;
  return { subtotal, vat, total: subtotal + vat, vatRate };
};

export const calculateVat = (amount, mode = "add", rate = 20) => {
  const numericAmount = Number(amount || 0);
  const decimalRate = Number(rate || 0) / 100;
  if (mode === "remove") {
    const net = decimalRate === 0 ? numericAmount : numericAmount / (1 + decimalRate);
    const vat = numericAmount - net;
    return { net, vat, gross: numericAmount };
  }
  const vat = numericAmount * decimalRate;
  return { net: numericAmount, vat, gross: numericAmount + vat };
};

export const calculateTaxEstimate = (income, expenses) => {
  const profit = Math.max(0, Number(income || 0) - Number(expenses || 0));
  const allowanceTaper = profit > 100000 ? Math.min(12570, (profit - 100000) / 2) : 0;
  const personalAllowance = Math.max(0, 12570 - allowanceTaper);
  const taxable = Math.max(0, profit - personalAllowance);
  const basicBand = Math.min(taxable, 37700);
  const higherBand = Math.min(Math.max(taxable - 37700, 0), 87440);
  const additionalBand = Math.max(taxable - 125140, 0);
  const incomeTax = basicBand * 0.2 + higherBand * 0.4 + additionalBand * 0.45;
  const class4Lower = Math.max(0, Math.min(profit, 50270) - 12570) * 0.06;
  const class4Upper = Math.max(0, profit - 50270) * 0.02;
  const nationalInsurance = class4Lower + class4Upper;
  return {
    profit,
    personalAllowance,
    taxable,
    incomeTax,
    nationalInsurance,
    total: incomeTax + nationalInsurance,
  };
};