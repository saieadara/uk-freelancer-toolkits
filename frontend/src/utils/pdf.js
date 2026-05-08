import html2pdf from "html2pdf.js";

const WATERMARK_TEXT = "Sai Eadara • UK Freelancer Toolkit";
const WATERMARK_CLASS = "download-watermark";

const attachWatermark = (element) => {
  const watermark = document.createElement("div");
  watermark.className = WATERMARK_CLASS;
  watermark.setAttribute("aria-hidden", "true");
  watermark.textContent = WATERMARK_TEXT;
  element.appendChild(watermark);
  return watermark;
};

export const downloadElementAsPdf = async (elementId, filename) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const watermark = attachWatermark(element);
  const options = {
    margin: 0,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };
  try {
    await html2pdf().set(options).from(element).save();
  } finally {
    watermark.remove();
  }
};
