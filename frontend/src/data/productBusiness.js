export const productModules = [
  "Dashboard", "Purchases", "Sales", "Inventory", "Production", "Pricing", "CRM", "Reports", "Calendar", "Tasks", "Employees", "Template Export",
];

export const createProductBusinessSeed = () => ({
  products: [
    { id: "p-1", sku: "CNDL-001", name: "Botanical Candle", type: "finished", quantity: 42, reorder: 15, expiry: "2026-09-30", avgCost: 4.2, price: 14.99 },
    { id: "p-2", sku: "WAX-001", name: "Soy Wax", type: "ingredient", quantity: 120, reorder: 40, expiry: "2027-01-15", avgCost: 2.1, price: 0 },
    { id: "p-3", sku: "JAR-250", name: "250ml Glass Jar", type: "ingredient", quantity: 68, reorder: 80, expiry: "", avgCost: 1.05, price: 0 },
    { id: "p-4", sku: "SOAP-SET", name: "Soap Gift Set", type: "finished", quantity: 9, reorder: 12, expiry: "2026-06-01", avgCost: 6.8, price: 24.5 },
  ],
  suppliers: [{ id: "s-1", name: "North Supplies", email: "orders@northsupplies.co.uk", balance: 320 }, { id: "s-2", name: "Jar House", email: "hello@jarhouse.co.uk", balance: 0 }],
  clients: [{ id: "c-1", name: "Bloom Boutique", email: "buyer@bloom.co.uk", balance: 189 }, { id: "c-2", name: "Market Stall Co", email: "team@marketstall.co.uk", balance: 0 }],
  purchases: [{ id: "po-1", supplier: "North Supplies", total: 420, status: "partial", date: "2026-04-20" }],
  invoices: [{ id: "inv-1", client: "Bloom Boutique", total: 389, paid: 200, status: "partial", date: "2026-04-22" }],
  movements: [{ id: "m-1", productId: "p-1", type: "purchase", quantity: 30, date: "2026-04-20" }, { id: "m-2", productId: "p-1", type: "sale", quantity: -12, date: "2026-04-22" }],
  recipes: [{ id: "r-1", product: "Botanical Candle", batchSize: 12, ingredients: "Soy Wax x 3kg\n250ml Glass Jar x 12\nFragrance Oil x 180ml", cost: 52.4 }],
  pricing: [{ id: "pr-1", product: "Botanical Candle", materials: 4.2, labour: 2.4, overhead: 15, margin: 55, suggested: 15.18 }],
  tasks: [{ id: "t-1", title: "Reorder glass jars", priority: "High", due: "2026-04-30", status: "Open", assignee: "Maya" }, { id: "t-2", title: "Prepare Bloom delivery", priority: "Medium", due: "2026-05-02", status: "In progress", assignee: "Leo" }],
  employees: [{ id: "e-1", name: "Maya", role: "Production", hours: 32, rate: 16, tasksCompleted: 18 }, { id: "e-2", name: "Leo", role: "Sales", hours: 24, rate: 18, tasksCompleted: 11 }],
  activities: ["Invoice INV-1 created for Bloom Boutique", "Low stock alert: 250ml Glass Jar", "Purchase PO-1 added from North Supplies", "Task assigned to Maya"],
});

export const managementPrdSections = [
  ["Product Vision", "Replace a multi-tab spreadsheet with one connected product-business workspace where purchases, inventory, production, sales, invoices, reports, tasks, and employees update each other automatically."],
  ["Dashboard", "Today summary bar, KPI cards, revenue/expense/profit trend, low-stock alerts, pending invoices, upcoming deliveries, tasks, and recent activity."],
  ["Purchases / IN", "Supplier invoice form with multiple line items. Saving a purchase increments inventory, logs movements, posts expenses, and updates supplier history."],
  ["Sales / OUT", "Client invoice form with tax, discounts, payment status, printable/PDF view, inventory deduction, revenue posting, and client balance updates."],
  ["Inventory", "SKU list, real-time quantity, reorder threshold, expiry tracking, average cost, and movement log. Stock is never edited directly without a movement."],
  ["Production & Recipes", "Bill-of-material recipe builder. Producing a batch consumes ingredients, adds finished goods, and calculates production cost."],
  ["Pricing Calculator", "Materials + labour + overhead + target margin. Saves suggested prices to a pricing database tied to products."],
  ["CRM", "Supplier and client contact records with transaction history, total spend/revenue, and outstanding balances."],
  ["Financial Reports", "Monthly P&L, 12-month trend, date-range report, and balance grouped by payment method."],
  ["Calendar, Tasks, Employees", "Integrated schedule for deliveries/orders/deadlines, task tracker with priorities, and employee hours/pay/performance tracking."],
];