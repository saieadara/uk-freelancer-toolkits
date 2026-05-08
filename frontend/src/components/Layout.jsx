import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  ["Home", "/"],
  ["Invoices", "/invoices"],
  ["Quotes", "/quotes"],
  ["VAT Calculator", "/vat-calculator"],
  ["Tax Estimator", "/tax-estimator"],
  ["Receipts", "/receipts"],
  ["Templates", "/templates"],
  ["Planning Tools", "/planning"],
  ["Startup Toolkit", "/startup"],
  ["Hiring & Contracts", "/hiring"],
  ["Legal", "/legal"],
  ["Ops & Growth", "/ops"],
  ["Product", "/product"],
  ["Strategy", "/strategy"],
  ["Business Analyst", "/business-analysis"],
  ["Project Manager", "/project-management"],
];

export const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="site-shell" data-testid="site-shell">
      <header className="topbar" data-testid="main-navigation-header">
        <Link to="/" className="brand-mark" data-testid="brand-home-link" onClick={() => setOpen(false)}>
          <span className="brand-serif" data-testid="brand-name">UK Freelancer Toolkit</span>
          <span className="brand-sub" data-testid="brand-subtitle">Fast admin tools</span>
        </Link>
        <nav className="nav-links" data-testid="desktop-navigation-links">
          {navItems.map(([label, path]) => (
            <NavLink key={path} to={path} data-testid={`nav-link-${label.toLowerCase().replaceAll(" ", "-")}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="icon-button mobile-menu-button" data-testid="mobile-menu-toggle-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      {open && (
        <nav className="mobile-nav" data-testid="mobile-navigation-menu">
          {navItems.map(([label, path]) => (
            <NavLink key={path} to={path} data-testid={`mobile-nav-link-${label.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
      )}
      <main data-testid="main-content-area">{children}</main>
      <footer className="footer" data-testid="site-footer">
        <span data-testid="footer-brand">UK Freelancer Toolkit</span>
        <div className="footer-links" data-testid="footer-links">
          <Link to="/about">About us</Link>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/contact">Contact us</Link>
        </div>
        <span data-testid="footer-copy">Focused tools for UK freelancers. Estimates are guidance, not advice.</span>
      </footer>
    </div>
  );
};
