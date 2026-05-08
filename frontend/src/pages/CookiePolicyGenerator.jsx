import { Download, Copy, Cookie, Plus, Trash2 } from "lucide-react";
import { PremiumCapture } from "../components/PremiumCapture";
import { defaultCookiePolicy } from "../data/legal";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { downloadElementAsPdf } from "../utils/pdf";

const newId = () => `ck-${Math.random().toString(36).slice(2, 8)}`;

const baseFields = [
  { id: "websiteName", label: "Website / brand name" },
  { id: "websiteUrl", label: "Website URL" },
  { id: "contactEmail", label: "Privacy contact email" },
  { id: "effectiveDate", label: "Effective date", type: "date" },
  { id: "consentMechanism", label: "Consent mechanism", textarea: true },
];

export default function CookiePolicyGenerator() {
  const [policy, setPolicy] = useLocalStorage("legal-cookie-policy", defaultCookiePolicy());
  const previewId = "cookie-policy-preview";
  const update = (field, value) => setPolicy({ ...policy, [field]: value });

  const updateCookie = (id, field, value) => {
    setPolicy({ ...policy, cookies: policy.cookies.map((row) => (row.id === id ? { ...row, [field]: value } : row)) });
  };
  const removeCookie = (id) => setPolicy({ ...policy, cookies: policy.cookies.filter((row) => row.id !== id) });
  const addCookie = () => setPolicy({ ...policy, cookies: [...policy.cookies, { id: newId(), name: "new_cookie", category: "Analytics", purpose: "", retention: "" }] });

  const copyDoc = async () => {
    const text = document.getElementById(previewId)?.innerText || "";
    try { await navigator.clipboard.writeText(text); } catch (_e) {}
  };

  return (
    <div className="page narrow-page" data-testid="cookie-policy-page">
      <section className="tool-intro">
        <div>
          <p className="eyebrow"><Cookie size={14} /> Compliance & Legal</p>
          <h1>Cookie Policy Generator</h1>
          <p>List the cookies your site uses by category with purpose and retention. Pair with a banner that captures consent for non-essential cookies under PECR + UK GDPR.</p>
        </div>
        <div className="hero-actions export-actions">
          <button className="secondary-button" onClick={copyDoc}><Copy size={17} /> Copy text</button>
          <button className="primary-button" onClick={() => downloadElementAsPdf(previewId, `${(policy.websiteName || "site").replace(/\s+/g, "-")}-cookie-policy.pdf`)}><Download size={17} /> Download PDF</button>
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Site details</h2>
        <div className="hiring-form-grid">
          {baseFields.map((field) => (
            <label key={field.id} className={field.textarea ? "hiring-field-wide" : ""}>
              {field.label}
              {field.textarea
                ? <textarea rows={3} value={policy[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`cookie-field-${field.id}`} />
                : <input type={field.type || "text"} value={policy[field.id] || ""} onChange={(event) => update(field.id, event.target.value)} data-testid={`cookie-field-${field.id}`} />}
            </label>
          ))}
        </div>
      </section>

      <section className="calculator-panel">
        <div className="panel-heading">
          <h2>Cookies in use</h2>
          <button className="secondary-button" onClick={addCookie} data-testid="cookie-add-row"><Plus size={16} /> Add cookie</button>
        </div>
        <div className="line-items">
          {policy.cookies.map((row) => (
            <div key={row.id} className="line-item-row cookie-row">
              <input value={row.name} onChange={(event) => updateCookie(row.id, "name", event.target.value)} placeholder="Name" />
              <input value={row.category} onChange={(event) => updateCookie(row.id, "category", event.target.value)} placeholder="Category" />
              <input value={row.purpose} onChange={(event) => updateCookie(row.id, "purpose", event.target.value)} placeholder="Purpose" />
              <input value={row.retention} onChange={(event) => updateCookie(row.id, "retention", event.target.value)} placeholder="Retention" />
              <button className="icon-button" onClick={() => removeCookie(row.id)} aria-label="Remove cookie"><Trash2 size={16} /></button>
            </div>
          ))}
          {policy.cookies.length === 0 && <p className="form-message">No cookies listed. Click "Add cookie" to begin.</p>}
        </div>
      </section>

      <section className="calculator-panel">
        <h2>Cookie policy preview</h2>
        <div id={previewId} className="hiring-document" data-testid="cookie-policy-preview">
          <header>
            <p className="eyebrow">Cookie Policy</p>
            <h1>{policy.websiteName} Cookie Policy</h1>
            <p>Effective {policy.effectiveDate} · {policy.websiteUrl}</p>
          </header>

          <h3>1. What cookies are</h3>
          <p>Cookies are small text files placed on your device that allow a website to recognise you, remember your preferences, and measure how the site is used.</p>

          <h3>2. Consent</h3>
          <p>{policy.consentMechanism}</p>

          <h3>3. Cookies we use</h3>
          <table className="legal-cookie-table">
            <thead>
              <tr><th>Name</th><th>Category</th><th>Purpose</th><th>Retention</th></tr>
            </thead>
            <tbody>
              {policy.cookies.map((row) => (
                <tr key={row.id}><td>{row.name}</td><td>{row.category}</td><td>{row.purpose}</td><td>{row.retention}</td></tr>
              ))}
            </tbody>
          </table>

          <h3>4. Managing cookies</h3>
          <p>You can change your consent at any time using the Cookie Settings link in our footer, or by clearing cookies in your browser. Most browsers also allow you to block cookies entirely — note that this may break functionality.</p>

          <h3>5. Contact</h3>
          <p>Questions about cookies: {policy.contactEmail}.</p>
        </div>
      </section>

      <PremiumCapture source="cookie-policy-generator" />
    </div>
  );
}
