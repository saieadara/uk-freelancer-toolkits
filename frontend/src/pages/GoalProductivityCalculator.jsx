import { useMemo } from "react";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { calculateGoalPlan, formatNumber } from "../utils/planning";
import { downloadElementAsPdf } from "../utils/pdf";

const nextMonth = () => {
  const date = new Date();
  date.setDate(date.getDate() + 45);
  return date.toISOString().slice(0, 10);
};

export default function GoalProductivityCalculator() {
  const [plan, setPlan] = useLocalStorage("planning-goal-productivity", {
    goalName: "Launch client outreach campaign",
    target: 100,
    current: 25,
    deadline: nextMonth(),
    weeklyHours: 8,
    focusQuality: 7,
    distractions: 3,
    completionRate: 72,
  });
  const result = useMemo(() => calculateGoalPlan(plan), [plan]);
  const chartData = [
    { name: "Current", value: Number(plan.current || 0) },
    { name: "Remaining", value: result.remaining },
    { name: "Weekly target", value: result.weeklyTarget },
  ];
  const update = (field, value) => setPlan({ ...plan, [field]: value });

  return (
    <div className="tool-page planning-tool-page" data-testid="goal-productivity-page">
      <section className="tool-intro" data-testid="goal-productivity-intro-section">
        <div>
          <p className="eyebrow" data-testid="goal-productivity-eyebrow">Execution plan</p>
          <h1 data-testid="goal-productivity-title">Goal & Productivity Calculator</h1>
          <p data-testid="goal-productivity-description">Turn a target into daily and weekly milestones, then score focus quality, distractions, and completion rate.</p>
        </div>
        <button className="primary-button" onClick={() => downloadElementAsPdf("goal-productivity-summary-pdf", "goal-productivity-summary.pdf")} data-testid="goal-productivity-download-button"><Download size={17} /> Download summary</button>
      </section>

      <section className="planning-layout" data-testid="goal-productivity-layout">
        <div className="builder-panel planning-input-panel" data-testid="goal-productivity-input-panel">
          <div className="two-column-fields">
            <label className="field"><span>Goal name</span><input value={plan.goalName} onChange={(event) => update("goalName", event.target.value)} data-testid="goal-name-input" /></label>
            <label className="field"><span>Deadline</span><input type="date" value={plan.deadline} onChange={(event) => update("deadline", event.target.value)} data-testid="goal-deadline-input" /></label>
            <label className="field"><span>Target units</span><input type="number" value={plan.target} onChange={(event) => update("target", event.target.value)} data-testid="goal-target-input" /></label>
            <label className="field"><span>Current progress</span><input type="number" value={plan.current} onChange={(event) => update("current", event.target.value)} data-testid="goal-current-input" /></label>
            <label className="field"><span>Weekly focus hours</span><input type="number" value={plan.weeklyHours} onChange={(event) => update("weeklyHours", event.target.value)} data-testid="goal-weekly-hours-input" /></label>
            <label className="field"><span>Focus quality /10</span><input type="number" min="0" max="10" value={plan.focusQuality} onChange={(event) => update("focusQuality", event.target.value)} data-testid="goal-focus-quality-input" /></label>
            <label className="field"><span>Distractions per day</span><input type="number" value={plan.distractions} onChange={(event) => update("distractions", event.target.value)} data-testid="goal-distractions-input" /></label>
            <label className="field"><span>Completion rate %</span><input type="number" value={plan.completionRate} onChange={(event) => update("completionRate", event.target.value)} data-testid="goal-completion-rate-input" /></label>
          </div>
        </div>

        <div className="planning-summary-panel" id="goal-productivity-summary-pdf" data-testid="goal-productivity-summary-panel">
          <div className="summary-header"><p className="eyebrow">Goal summary</p><h2 data-testid="goal-summary-name">{plan.goalName}</h2></div>
          <div className="planning-metrics" data-testid="goal-productivity-metrics">
            <div data-testid="goal-days-result"><span>Days left</span><strong>{result.days}</strong></div>
            <div data-testid="goal-daily-target-result"><span>Daily target</span><strong>{formatNumber(result.dailyTarget, 1)}</strong></div>
            <div data-testid="goal-weekly-target-result"><span>Weekly target</span><strong>{formatNumber(result.weeklyTarget, 1)}</strong></div>
            <div className={result.productivityScore >= 65 ? "is-good" : "is-danger"} data-testid="goal-productivity-score-result"><span>Productivity score</span><strong>{result.productivityScore}/100</strong></div>
            <div className="wide-result" data-testid="goal-effective-hours-result"><span>Effective weekly focus time</span><strong>{formatNumber(result.effectiveWeeklyHours, 1)} hrs</strong></div>
          </div>
          <div className="chart-box" data-testid="goal-productivity-chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#a68a55" /></BarChart>
            </ResponsiveContainer>
          </div>
          <section className="recommendation-list" data-testid="goal-productivity-recommendations">
            <h3>Recommendations</h3>
            <p data-testid="goal-recommendation-0">Work backwards from the weekly target and block focus sessions before reactive tasks.</p>
            <p data-testid="goal-recommendation-1">If the productivity score is under 65, reduce distractions before increasing hours.</p>
          </section>
        </div>
      </section>
    </div>
  );
}