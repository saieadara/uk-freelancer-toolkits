import { useMemo } from "react";
import { Download, Plus, Trash2 } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { budgetConfigs } from "../data/planningTools";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { calculateBudget, budgetRecommendations, makeBudgetItems } from "../utils/planning";
import { formatMoney } from "../utils/calculations";
import { downloadElementAsPdf } from "../utils/pdf";

const chartColors = ["#171c20", "#a68a55", "#66747d", "#c5a76a", "#2f3a40", "#d6dadf", "#705d35", "#8a949b", "#f8e8c0"];

export default function BudgetCalculator({ type }) {
  const config = budgetConfigs[type] || budgetConfigs["uk-budget-planner"];
  const [state, setState] = useLocalStorage(`planning-${config.id}`, {
    income: config.defaultIncome,
    items: makeBudgetItems(config.categories),
  });
  const summary = useMemo(() => calculateBudget(state.income, state.items), [state]);
  const recommendations = budgetRecommendations(config.recommendationType, state.income, summary.total, summary.remaining);
  const summaryId = `${config.id}-summary-pdf`;

  const updateItem = (index, field, value) => {
    setState({ ...state, items: state.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) });
  };
  const addItem = () => setState({ ...state, items: [...state.items, { id: `budget-${Date.now()}`, name: "New category", amount: 0 }] });
  const removeItem = (index) => setState({ ...state, items: state.items.length === 1 ? state.items : state.items.filter((_item, itemIndex) => itemIndex !== index) });

  return (
    <div className="tool-page planning-tool-page" data-testid={`${config.id}-page`}>
      <section className="tool-intro" data-testid={`${config.id}-intro-section`}>
        <div>
          <p className="eyebrow" data-testid={`${config.id}-eyebrow`}>{config.eyebrow}</p>
          <h1 data-testid={`${config.id}-title`}>{config.title}</h1>
          <p data-testid={`${config.id}-description`}>{config.description}</p>
        </div>
        <button className="primary-button" onClick={() => downloadElementAsPdf(summaryId, `${config.id}-summary.pdf`)} data-testid={`${config.id}-download-summary-button`}><Download size={17} /> Download summary</button>
      </section>

      <section className="planning-layout" data-testid={`${config.id}-layout`}>
        <div className="builder-panel planning-input-panel" data-testid={`${config.id}-input-panel`}>
          <label className="field" data-testid={`${config.id}-income-field`}>
            <span data-testid={`${config.id}-income-label`}>{config.incomeLabel}</span>
            <input type="number" value={state.income} onChange={(event) => setState({ ...state, income: event.target.value })} data-testid={`${config.id}-income-input`} />
          </label>
          <section className="form-section" data-testid={`${config.id}-categories-section`}>
            <div className="section-heading-row">
              <h3 data-testid={`${config.id}-categories-title`}>Categories</h3>
              <button className="text-button" type="button" onClick={addItem} data-testid={`${config.id}-add-category-button`}><Plus size={16} /> Add category</button>
            </div>
            <div className="budget-category-list" data-testid={`${config.id}-category-list`}>
              {state.items.map((item, index) => (
                <div className="budget-category-row" key={item.id} data-testid={`${config.id}-category-row-${index}`}>
                  <input value={item.name} onChange={(event) => updateItem(index, "name", event.target.value)} data-testid={`${config.id}-category-name-input-${index}`} />
                  <input type="number" value={item.amount} onChange={(event) => updateItem(index, "amount", event.target.value)} data-testid={`${config.id}-category-amount-input-${index}`} />
                  <button className="icon-button" type="button" onClick={() => removeItem(index)} disabled={state.items.length === 1} data-testid={`${config.id}-remove-category-button-${index}`} aria-label="Remove category"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="planning-summary-panel" id={summaryId} data-testid={`${config.id}-summary-panel`}>
          <div className="summary-header" data-testid={`${config.id}-summary-header`}>
            <p className="eyebrow" data-testid={`${config.id}-summary-eyebrow`}>{config.period} summary</p>
            <h2 data-testid={`${config.id}-summary-title`}>{config.title}</h2>
          </div>
          <div className="planning-metrics" data-testid={`${config.id}-metric-grid`}>
            <div data-testid={`${config.id}-income-metric`}><span>Budget</span><strong>{formatMoney(state.income)}</strong></div>
            <div data-testid={`${config.id}-planned-metric`}><span>Planned</span><strong>{formatMoney(summary.total)}</strong></div>
            <div data-testid={`${config.id}-remaining-metric`} className={summary.remaining < 0 ? "is-danger" : "is-good"}><span>Remaining</span><strong>{formatMoney(summary.remaining)}</strong></div>
            <div data-testid={`${config.id}-used-metric`}><span>Used</span><strong>{Math.round(summary.usedPercentage)}%</strong></div>
          </div>
          <div className="chart-box" data-testid={`${config.id}-chart-box`}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={summary.chartItems} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                  {summary.chartItems.map((_entry, index) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <section className="recommendation-list" data-testid={`${config.id}-recommendations`}>
            <h3 data-testid={`${config.id}-recommendations-title`}>Recommendations</h3>
            {recommendations.map((item, index) => <p key={item} data-testid={`${config.id}-recommendation-${index}`}>{item}</p>)}
          </section>
        </div>
      </section>
    </div>
  );
}