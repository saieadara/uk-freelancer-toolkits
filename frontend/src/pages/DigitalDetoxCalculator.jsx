import { useMemo } from "react";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { calculateDigitalDetox, formatNumber } from "../utils/planning";
import { formatMoney } from "../utils/calculations";
import { downloadElementAsPdf } from "../utils/pdf";

export default function DigitalDetoxCalculator() {
  const [detox, setDetox] = useLocalStorage("planning-digital-detox", {
    dailyHours: 5,
    targetHours: 2,
    activeDays: 7,
    hourlyValue: 18,
  });
  const result = useMemo(() => calculateDigitalDetox(detox), [detox]);
  const update = (field, value) => setDetox({ ...detox, [field]: value });
  const chartData = [
    { name: "Week", hours: result.savedWeekly },
    { name: "Month", hours: result.savedMonthly },
    { name: "Year", hours: result.savedYearly },
  ];

  return (
    <div className="tool-page planning-tool-page" data-testid="digital-detox-page">
      <section className="tool-intro" data-testid="digital-detox-intro-section">
        <div>
          <p className="eyebrow" data-testid="digital-detox-eyebrow">Time reclaimed</p>
          <h1 data-testid="digital-detox-title">Digital Detox Calculator</h1>
          <p data-testid="digital-detox-description">Calculate the weekly, monthly, and yearly time you can reclaim by reducing daily screen time.</p>
        </div>
        <button className="primary-button" onClick={() => downloadElementAsPdf("digital-detox-summary-pdf", "digital-detox-summary.pdf")} data-testid="digital-detox-download-button"><Download size={17} /> Download summary</button>
      </section>

      <section className="planning-layout" data-testid="digital-detox-layout">
        <div className="builder-panel planning-input-panel" data-testid="digital-detox-input-panel">
          <div className="two-column-fields">
            <label className="field"><span>Current daily screen time</span><input type="number" value={detox.dailyHours} onChange={(event) => update("dailyHours", event.target.value)} data-testid="detox-daily-hours-input" /></label>
            <label className="field"><span>Target daily screen time</span><input type="number" value={detox.targetHours} onChange={(event) => update("targetHours", event.target.value)} data-testid="detox-target-hours-input" /></label>
            <label className="field"><span>Days per week</span><input type="number" min="1" max="7" value={detox.activeDays} onChange={(event) => update("activeDays", event.target.value)} data-testid="detox-active-days-input" /></label>
            <label className="field"><span>Optional hourly value</span><input type="number" value={detox.hourlyValue} onChange={(event) => update("hourlyValue", event.target.value)} data-testid="detox-hourly-value-input" /></label>
          </div>
        </div>

        <div className="planning-summary-panel" id="digital-detox-summary-pdf" data-testid="digital-detox-summary-panel">
          <div className="summary-header"><p className="eyebrow">Detox summary</p><h2 data-testid="digital-detox-summary-title">Screen-time savings</h2></div>
          <div className="planning-metrics" data-testid="digital-detox-metrics">
            <div data-testid="detox-daily-saved-result"><span>Daily saved</span><strong>{formatNumber(result.savedDaily, 1)} hrs</strong></div>
            <div data-testid="detox-weekly-saved-result"><span>Weekly saved</span><strong>{formatNumber(result.savedWeekly, 1)} hrs</strong></div>
            <div data-testid="detox-monthly-saved-result"><span>Monthly saved</span><strong>{formatNumber(result.savedMonthly, 1)} hrs</strong></div>
            <div data-testid="detox-yearly-saved-result"><span>Yearly saved</span><strong>{formatNumber(result.savedYearly, 0)} hrs</strong></div>
            <div className="wide-result" data-testid="detox-yearly-value-result"><span>Optional yearly value</span><strong>{formatMoney(result.valueYearly)}</strong></div>
          </div>
          <div className="chart-box" data-testid="digital-detox-chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="hours" fill="#171c20" /></BarChart>
            </ResponsiveContainer>
          </div>
          <section className="recommendation-list" data-testid="digital-detox-recommendations">
            <h3>Recommendation</h3>
            <p data-testid="detox-recommendation-0">Start by removing the highest-friction hour first: late-night scrolling, morning checking, or idle app switching.</p>
          </section>
        </div>
      </section>
    </div>
  );
}