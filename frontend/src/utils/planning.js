export const formatNumber = (value, decimals = 0) =>
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(Number(value || 0));

export const makeBudgetItems = (categories) =>
  categories.map(([name, amount], index) => ({ id: `budget-${index + 1}`, name, amount }));

export const calculateBudget = (income, items) => {
  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const remaining = Number(income || 0) - total;
  const usedPercentage = Number(income || 0) > 0 ? (total / Number(income || 0)) * 100 : 0;
  const chartItems = items
    .filter((item) => Number(item.amount || 0) > 0)
    .map((item) => ({ name: item.name, value: Number(item.amount || 0) }));
  return { total, remaining, usedPercentage, chartItems };
};

export const budgetRecommendations = (type, income, total, remaining) => {
  const messages = [];
  const ratio = Number(income || 0) > 0 ? total / Number(income || 0) : 0;
  if (remaining < 0) messages.push("Your planned costs exceed the available budget. Reduce the largest category first or increase the budget before committing.");
  if (remaining >= 0 && ratio > 0.92) messages.push("The plan is workable but tight. Keep a contingency line visible so surprises do not derail the plan.");
  if (ratio < 0.75) messages.push("You have healthy headroom. Assign part of the remaining amount to savings, contingency, or runway.");
  if (type === "business") messages.push("For a business budget, separate tax set-aside and profit reserve from ordinary operating costs.");
  if (type === "startup") messages.push("For startup costs, check that the runway line covers enough months before revenue becomes reliable.");
  if (type === "event") messages.push("For wedding planning, agree the must-have categories first, then trim lower-priority supplier lines.");
  if (type === "personal") messages.push("For personal budgets, automate savings before discretionary spending where possible.");
  return messages.slice(0, 3);
};

export const calculateGoalPlan = ({ target, current, deadline, weeklyHours, focusQuality, distractions, completionRate }) => {
  const today = new Date();
  const end = deadline ? new Date(deadline) : today;
  const days = Math.max(1, Math.ceil((end - today) / 86400000));
  const remaining = Math.max(0, Number(target || 0) - Number(current || 0));
  const dailyTarget = remaining / days;
  const weeklyTarget = dailyTarget * 7;
  const focusModifier = Number(focusQuality || 0) / 10;
  const completionModifier = Number(completionRate || 0) / 100;
  const distractionPenalty = Math.min(35, Number(distractions || 0) * 4);
  const productivityScore = Math.max(0, Math.min(100, Math.round((focusModifier * 55 + completionModifier * 45) - distractionPenalty)));
  const effectiveWeeklyHours = Number(weeklyHours || 0) * (productivityScore / 100);
  return { days, remaining, dailyTarget, weeklyTarget, productivityScore, effectiveWeeklyHours };
};

export const calculateDigitalDetox = ({ dailyHours, targetHours, activeDays, hourlyValue }) => {
  const savedDaily = Math.max(0, Number(dailyHours || 0) - Number(targetHours || 0));
  const savedWeekly = savedDaily * Number(activeDays || 0);
  const savedMonthly = savedWeekly * 4.345;
  const savedYearly = savedWeekly * 52;
  const valueYearly = savedYearly * Number(hourlyValue || 0);
  return { savedDaily, savedWeekly, savedMonthly, savedYearly, valueYearly };
};