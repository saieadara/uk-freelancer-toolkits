import { useMemo, useState } from "react";
import { Download, FileText, Plus } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { createProductBusinessSeed, managementPrdSections, productModules } from "../data/productBusiness";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatMoney } from "../utils/calculations";
import { downloadElementAsPdf } from "../utils/pdf";
import { downloadProductBusinessDocx } from "../utils/productBusinessDocx";

const trend = [
  { month: "Jan", revenue: 8400, expenses: 5200 }, { month: "Feb", revenue: 9100, expenses: 5600 }, { month: "Mar", revenue: 11800, expenses: 6700 }, { month: "Apr", revenue: 12600, expenses: 7100 },
  { month: "May", revenue: 14200, expenses: 7600 }, { month: "Jun", revenue: 15400, expenses: 8100 }, { month: "Jul", revenue: 14900, expenses: 8300 }, { month: "Aug", revenue: 16800, expenses: 8900 },
  { month: "Sep", revenue: 17600, expenses: 9300 }, { month: "Oct", revenue: 19100, expenses: 10100 }, { month: "Nov", revenue: 22000, expenses: 11900 }, { month: "Dec", revenue: 24800, expenses: 13200 },
];

const Field = ({ label, children }) => <label className="field product-field"><span>{label}</span>{children}</label>;

const ProductTable = ({ rows, columns, testId }) => (
  <div className="product-table" data-testid={testId}>
    <div className="product-table-head">{columns.map((column) => <span key={column.key}>{column.label}</span>)}</div>
    {rows.map((row) => <div className="product-table-row" key={row.id}>{columns.map((column) => <span key={column.key}>{column.render ? column.render(row) : row[column.key]}</span>)}</div>)}
  </div>
);

const Dashboard = ({ state, kpis }) => <div className="product-module-grid" data-testid="pbm-dashboard-module">
  <div className="product-kpi-grid" data-testid="pbm-kpi-grid">
    {kpis.map((kpi) => <div key={kpi.label} className="product-kpi-card" data-testid={`pbm-kpi-${kpi.label.toLowerCase().replaceAll(" ", "-")}`}><span>{kpi.label}</span><strong>{kpi.value}</strong><small>{kpi.note}</small></div>)}
  </div>
  <div className="product-chart-card" data-testid="pbm-trend-chart"><h3>12-month revenue / expense trend</h3><ResponsiveContainer width="100%" height={270}><AreaChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => formatMoney(value)} /><Area type="monotone" dataKey="revenue" stroke="#256f68" fill="#d9eee9" /><Area type="monotone" dataKey="expenses" stroke="#b46a3a" fill="#f8e1d2" /></AreaChart></ResponsiveContainer></div>
  <div className="product-split"><div className="product-panel"><h3>Low stock alerts</h3>{state.products.filter((p) => p.quantity <= p.reorder).map((p) => <p key={p.id}>{p.name}: {p.quantity} left</p>)}</div><div className="product-panel"><h3>Recent activity</h3>{state.activities.map((item) => <p key={item}>{item}</p>)}</div></div>
</div>;

export default function ProductBusinessManager() {
  const [state, setState] = useLocalStorage("startup-product-business-management", createProductBusinessSeed());
  const [active, setActive] = useState("Dashboard");
  const [purchase, setPurchase] = useState({ supplier: "North Supplies", productId: "p-1", quantity: 10, unitCost: 4.2 });
  const [sale, setSale] = useState({ client: "Bloom Boutique", productId: "p-1", quantity: 4, unitPrice: 14.99, tax: 20, discount: 0, paid: 0 });
  const [pricing, setPricing] = useState({ product: "New Product", materials: 12, labourHours: 2, labourRate: 18, overhead: 15, margin: 50 });

  const totals = useMemo(() => {
    const revenue = state.invoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);
    const expenses = state.purchases.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const lowStock = state.products.filter((product) => product.quantity <= product.reorder).length;
    const pending = state.invoices.filter((invoice) => invoice.status !== "paid").length;
    return { revenue, expenses, profit: revenue - expenses, lowStock, pending };
  }, [state]);

  const kpis = [
    { label: "Revenue", value: formatMoney(totals.revenue), note: "Invoices posted" },
    { label: "Expenses", value: formatMoney(totals.expenses), note: "Purchases logged" },
    { label: "Profit", value: formatMoney(totals.profit), note: "Revenue minus expenses" },
    { label: "Low stock", value: totals.lowStock, note: "Products needing attention" },
    { label: "Pending invoices", value: totals.pending, note: "Unpaid or partial" },
  ];

  const addPurchase = () => {
    const product = state.products.find((p) => p.id === purchase.productId);
    const total = Number(purchase.quantity) * Number(purchase.unitCost);
    setState({
      ...state,
      products: state.products.map((p) => p.id === purchase.productId ? { ...p, quantity: Number(p.quantity) + Number(purchase.quantity), avgCost: Number(purchase.unitCost) } : p),
      purchases: [{ id: `po-${Date.now()}`, supplier: purchase.supplier, total, status: "unpaid", date: new Date().toISOString().slice(0, 10) }, ...state.purchases],
      movements: [{ id: `m-${Date.now()}`, productId: purchase.productId, type: "purchase", quantity: Number(purchase.quantity), date: new Date().toISOString().slice(0, 10) }, ...state.movements],
      suppliers: state.suppliers.map((s) => s.name === purchase.supplier ? { ...s, balance: Number(s.balance) + total } : s),
      activities: [`Purchase added: ${purchase.quantity} × ${product?.name}`, ...state.activities].slice(0, 8),
    });
  };

  const addSale = () => {
    const product = state.products.find((p) => p.id === sale.productId);
    const subtotal = Number(sale.quantity) * Number(sale.unitPrice);
    const total = subtotal + subtotal * (Number(sale.tax) / 100) - Number(sale.discount || 0);
    const paid = Number(sale.paid || 0);
    setState({
      ...state,
      products: state.products.map((p) => p.id === sale.productId ? { ...p, quantity: Math.max(0, Number(p.quantity) - Number(sale.quantity)) } : p),
      invoices: [{ id: `inv-${Date.now()}`, client: sale.client, total, paid, status: paid >= total ? "paid" : paid > 0 ? "partial" : "unpaid", date: new Date().toISOString().slice(0, 10) }, ...state.invoices],
      movements: [{ id: `m-${Date.now()}`, productId: sale.productId, type: "sale", quantity: -Number(sale.quantity), date: new Date().toISOString().slice(0, 10) }, ...state.movements],
      clients: state.clients.map((c) => c.name === sale.client ? { ...c, balance: Number(c.balance) + (total - paid) } : c),
      activities: [`Invoice created: ${sale.quantity} × ${product?.name}`, ...state.activities].slice(0, 8),
    });
  };

  const savePricing = () => {
    const materials = Number(pricing.materials); const labour = Number(pricing.labourHours) * Number(pricing.labourRate); const base = materials + labour; const withOverhead = base * (1 + Number(pricing.overhead) / 100); const suggested = withOverhead / (1 - Number(pricing.margin) / 100);
    setState({ ...state, pricing: [{ id: `pr-${Date.now()}`, product: pricing.product, materials, labour, overhead: pricing.overhead, margin: pricing.margin, suggested }, ...state.pricing], activities: [`Pricing saved for ${pricing.product}`, ...state.activities].slice(0, 8) });
  };

  const renderModule = () => {
    if (active === "Dashboard") return <Dashboard state={state} kpis={kpis} />;
    if (active === "Purchases") return <div className="product-module-grid"><div className="product-form-panel"><h3>Record supplier invoice</h3><Field label="Supplier"><select value={purchase.supplier} onChange={(e) => setPurchase({ ...purchase, supplier: e.target.value })} data-testid="pbm-purchase-supplier-select">{state.suppliers.map((s) => <option key={s.id}>{s.name}</option>)}</select></Field><Field label="Product"><select value={purchase.productId} onChange={(e) => setPurchase({ ...purchase, productId: e.target.value })} data-testid="pbm-purchase-product-select">{state.products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field><Field label="Quantity"><input type="number" value={purchase.quantity} onChange={(e) => setPurchase({ ...purchase, quantity: e.target.value })} data-testid="pbm-purchase-quantity-input" /></Field><Field label="Unit cost"><input type="number" value={purchase.unitCost} onChange={(e) => setPurchase({ ...purchase, unitCost: e.target.value })} data-testid="pbm-purchase-cost-input" /></Field><button className="primary-button" onClick={addPurchase} data-testid="pbm-add-purchase-button"><Plus size={17} /> Save purchase</button></div><ProductTable testId="pbm-purchase-table" rows={state.purchases} columns={[{ key: "id", label: "PO" }, { key: "supplier", label: "Supplier" }, { key: "total", label: "Total", render: (r) => formatMoney(r.total) }, { key: "status", label: "Status" }, { key: "date", label: "Date" }]} /></div>;
    if (active === "Sales") return <div className="product-module-grid"><div className="product-form-panel"><h3>Create client invoice</h3><Field label="Client"><select value={sale.client} onChange={(e) => setSale({ ...sale, client: e.target.value })} data-testid="pbm-sale-client-select">{state.clients.map((c) => <option key={c.id}>{c.name}</option>)}</select></Field><Field label="Product"><select value={sale.productId} onChange={(e) => setSale({ ...sale, productId: e.target.value })} data-testid="pbm-sale-product-select">{state.products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field><Field label="Quantity"><input type="number" value={sale.quantity} onChange={(e) => setSale({ ...sale, quantity: e.target.value })} data-testid="pbm-sale-quantity-input" /></Field><Field label="Unit price"><input type="number" value={sale.unitPrice} onChange={(e) => setSale({ ...sale, unitPrice: e.target.value })} data-testid="pbm-sale-price-input" /></Field><Field label="Tax %"><input type="number" value={sale.tax} onChange={(e) => setSale({ ...sale, tax: e.target.value })} data-testid="pbm-sale-tax-input" /></Field><Field label="Discount"><input type="number" value={sale.discount} onChange={(e) => setSale({ ...sale, discount: e.target.value })} data-testid="pbm-sale-discount-input" /></Field><button className="primary-button" onClick={addSale} data-testid="pbm-add-sale-button"><Plus size={17} /> Save invoice</button></div><ProductTable testId="pbm-invoice-table" rows={state.invoices} columns={[{ key: "id", label: "Invoice" }, { key: "client", label: "Client" }, { key: "total", label: "Total", render: (r) => formatMoney(r.total) }, { key: "status", label: "Status" }, { key: "date", label: "Date" }]} /></div>;
    if (active === "Inventory") return <ProductTable testId="pbm-inventory-table" rows={state.products} columns={[{ key: "sku", label: "SKU" }, { key: "name", label: "Product" }, { key: "quantity", label: "Qty" }, { key: "reorder", label: "Reorder" }, { key: "expiry", label: "Expiry" }, { key: "avgCost", label: "Avg cost", render: (r) => formatMoney(r.avgCost) }]} />;
    if (active === "Production") return <div className="product-split"><ProductTable testId="pbm-recipes-table" rows={state.recipes} columns={[{ key: "product", label: "Product" }, { key: "batchSize", label: "Batch" }, { key: "ingredients", label: "Ingredients" }, { key: "cost", label: "Batch cost", render: (r) => formatMoney(r.cost) }]} /><div className="product-panel"><h3>Production rule</h3><p>Producing a batch consumes ingredient stock through logged inventory movements and adds finished goods back into inventory.</p></div></div>;
    if (active === "Pricing") return <div className="product-module-grid"><div className="product-form-panel"><h3>Pricing calculator</h3>{["product", "materials", "labourHours", "labourRate", "overhead", "margin"].map((key) => <Field key={key} label={key.replace(/([A-Z])/g, " $1")}><input value={pricing[key]} type={key === "product" ? "text" : "number"} onChange={(e) => setPricing({ ...pricing, [key]: e.target.value })} data-testid={`pbm-pricing-${key}-input`} /></Field>)}<button className="primary-button" onClick={savePricing} data-testid="pbm-save-pricing-button">Save pricing</button></div><ProductTable testId="pbm-pricing-table" rows={state.pricing} columns={[{ key: "product", label: "Product" }, { key: "materials", label: "Materials", render: (r) => formatMoney(r.materials) }, { key: "labour", label: "Labour", render: (r) => formatMoney(r.labour) }, { key: "margin", label: "Margin %" }, { key: "suggested", label: "Suggested", render: (r) => formatMoney(r.suggested) }]} /></div>;
    if (active === "CRM") return <div className="product-split"><ProductTable testId="pbm-suppliers-table" rows={state.suppliers} columns={[{ key: "name", label: "Supplier" }, { key: "email", label: "Email" }, { key: "balance", label: "Balance", render: (r) => formatMoney(r.balance) }]} /><ProductTable testId="pbm-clients-table" rows={state.clients} columns={[{ key: "name", label: "Client" }, { key: "email", label: "Email" }, { key: "balance", label: "Outstanding", render: (r) => formatMoney(r.balance) }]} /></div>;
    if (active === "Reports") return <div className="product-module-grid"><div className="product-kpi-grid">{kpis.slice(0, 3).map((k) => <div className="product-kpi-card" key={k.label}><span>{k.label}</span><strong>{k.value}</strong><small>{k.note}</small></div>)}</div><div className="product-chart-card"><h3>Profit trend</h3><ResponsiveContainer width="100%" height={280}><BarChart data={trend.map((t) => ({ ...t, profit: t.revenue - t.expenses }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => formatMoney(value)} /><Bar dataKey="profit" fill="#256f68" /></BarChart></ResponsiveContainer></div></div>;
    if (active === "Calendar") return <div className="product-calendar" data-testid="pbm-calendar-grid">{state.tasks.map((task) => <div key={task.id}><span>{task.due}</span><strong>{task.title}</strong><small>{task.priority} • {task.assignee}</small></div>)}</div>;
    if (active === "Tasks") return <ProductTable testId="pbm-tasks-table" rows={state.tasks} columns={[{ key: "title", label: "Task" }, { key: "priority", label: "Priority" }, { key: "due", label: "Due" }, { key: "assignee", label: "Assignee" }, { key: "status", label: "Status" }]} />;
    if (active === "Employees") return <ProductTable testId="pbm-employees-table" rows={state.employees} columns={[{ key: "name", label: "Employee" }, { key: "role", label: "Role" }, { key: "hours", label: "Hours" }, { key: "rate", label: "Rate", render: (r) => formatMoney(r.rate) }, { key: "tasksCompleted", label: "Tasks done" }, { key: "pay", label: "Pay", render: (r) => formatMoney(r.hours * r.rate) }]} />;
    return <div className="product-export-layout"><div className="hero-actions"><button className="secondary-button" onClick={() => downloadProductBusinessDocx(state)} data-testid="pbm-download-docx-button"><FileText size={17} /> Download Word PRD</button><button className="primary-button" onClick={() => downloadElementAsPdf("pbm-template-document", "product-business-management-system.pdf")} data-testid="pbm-download-pdf-button"><Download size={17} /> Download PDF PRD</button></div><article id="pbm-template-document" className="product-template-doc" data-testid="pbm-template-document"><h2>All-in-One Product Business Management System</h2>{managementPrdSections.map(([title, body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}</article></div>;
  };

  return <div className="tool-page product-business-page" data-testid="product-business-manager-page"><section className="tool-intro"><div><p className="eyebrow">Startup Toolkit</p><h1 data-testid="pbm-title">All-in-One Product Business Management System</h1><p data-testid="pbm-description">A spreadsheet replacement template and working local MVP where purchases, stock, production, sales, reports, tasks, and employees stay connected.</p></div></section><section className="product-workspace"><aside className="product-sidebar" data-testid="pbm-module-sidebar">{productModules.map((module) => <button key={module} className={active === module ? "active" : ""} onClick={() => setActive(module)} data-testid={`pbm-module-${module.toLowerCase().replaceAll(" ", "-")}-button`}>{module}</button>)}</aside><main className="product-main" data-testid="pbm-active-module"><div className="product-main-header"><h2 data-testid="pbm-active-module-title">{active}</h2><span data-testid="pbm-state-note">Sample data • local working MVP</span></div>{renderModule()}</main></section></div>;
}