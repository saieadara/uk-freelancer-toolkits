import html2pdf from "html2pdf.js";

export const downloadElementAsPdf = async (elementId, filename) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const options = {
    margin: 0,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };
  await html2pdf().set(options).from(element).save();
};
