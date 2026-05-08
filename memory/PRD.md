# UK Freelancer Toolkit PRD

## Original Problem Statement
Build a focused web product called UK Freelancer Toolkit: a lightweight, premium-feeling collection of fast UK freelancer admin tools. The full MVP includes Homepage, UK VAT Invoice Generator, Quote / Estimate Generator, UK VAT Calculator, Self-Employed Tax Estimator, Receipt Generator, Template download pages, premium teaser states, internal linking, mobile polish, html2pdf.js PDF export, localStorage persistence, and email capture for premium interest.

## Architecture Decisions
- Frontend: React with route-based pages and shared components for layout, form controls, document previews, line item editing, premium capture, calculations, and PDF export.
- Backend: FastAPI + MongoDB endpoint for premium email capture at `/api/waitlist`, preserving existing health/status endpoints.
- Persistence: localStorage for invoice, quote, and receipt defaults so repeat users can return quickly.
- PDF export: html2pdf.js exports the visible document/template preview to A4-style PDFs.
- Calculations: deterministic client-side utilities for VAT, document totals, and simplified self-employed tax estimates.

## User Personas
- UK freelancers, consultants, contractors, and solo service business owners.
- Newly self-employed workers needing quick admin outputs without signing up for accounting software.
- Repeat users who want to generate invoices, quotes, VAT breakdowns, tax estimates, receipts, or templates in under a few minutes.

## Core Requirements
- One tool, one job, one clear output.
- UK-specific defaults and language.
- No login required for free use.
- Live document previews and instant calculations.
- Professional, printable document aesthetic.
- Mobile-friendly navigation and responsive layouts.
- Premium teaser with email capture, without building a full accounting suite.

## Implemented (2026-04-28)
- Homepage with navigation, hero, tool directory cards, and premium email capture.
- UK VAT Invoice Generator with editable details, parties, line items, VAT modes, live preview, local persistence, and PDF export.
- Quote / Estimate Generator reusing the invoice generator structure with quote wording and validity date flow.
- UK VAT Calculator with add/remove VAT logic, result breakdown, clipboard-safe copy handling, and SEO explanation.
- Self-Employed Tax Estimator with profit, taxable income, income tax, National Insurance, total estimate, explanation, and disclaimer.
- Receipt Generator with editable receipt fields, live receipt preview, persistence, and PDF export.
- Templates index and individual template pages with downloadable PDF previews and links into live tools.
- Backend waitlist API with duplicate handling and retrieval endpoint.

## Testing Summary
- JavaScript and Python lint passed.
- Production frontend build succeeded with only an upstream html2pdf source-map warning.
- Backend curl tests passed for `/api/` and `/api/waitlist`.
- Playwright self-checks passed for home, invoice, VAT calculator, and fixed copy flow.
- Testing agent passed backend API suite and major frontend routes; reported clipboard denial issue was fixed and self-tested.

## Prioritized Backlog
### P0 Remaining
- None for current MVP scope.

### P1 Remaining
- Add explicit PDF watermark toggle/logic for free tier vs future paid tier.
- Add optional email capture after successful PDF export.
- Add richer editable template formats beyond PDF preview downloads.

### P2 Remaining
- Add late payment interest calculator.
- Add day rate to annual salary calculator.
- Add freelance hourly rate calculator.
- Add reverse charge VAT helper.
- Add proposal cover page generator.

## Next Tasks
- Review visual copy and wording for final brand tone.
- Add analytics events for tool usage, PDF exports, adjacent tool clicks, and premium interest.
- Add saved client database and document history when premium features are ready.


## Budget & Planning Toolkit Addition (2026-04-28)

### User Request
Add a separate Budget & Planning Toolkit experience with: UK Budget Planner, Marriage Budget Calculator, Business Budget Calculator, Start Up Expense Calculator, Goal & Productivity Calculator, and Digital Detox Calculator. Startup business plan document generator was intentionally deferred for a later startup toolkit.

### Implemented
- Added `/planning` homepage-style directory with six planning tool cards and navigation entry.
- Added category-by-category budget calculators for personal UK budgeting, wedding/marriage budgeting, business operating budgets, and startup expense planning.
- Added editable category rows, chart visualisations, dynamic budget recommendations, remaining budget metrics, and downloadable PDF summary buttons.
- Added Goal & Productivity Calculator with target/deadline planning, daily and weekly milestones, productivity score, effective focus time, chart, and recommendations.
- Added Digital Detox Calculator with daily/weekly/monthly/yearly saved time, optional yearly value, chart, recommendation, and downloadable summary.
- Added graceful fallback page for unavailable future tools.

### Testing Summary
- JavaScript lint passed.
- Production frontend build succeeded with only the existing html2pdf source-map warning.
- Playwright self-tests passed for `/planning`, UK Budget Planner updates, Goal & Productivity Calculator, Digital Detox Calculator, and unavailable-route fallback.
- Testing agent validated all six planning routes, mobile navigation, mobile overflow, charts, recommendations, and summary buttons with 100% frontend success.

### Backlog Updates
#### P0 Remaining
- None for the requested planning toolkit scope.

#### P1 Remaining
- Build the future Startup Toolkit and Startup Business Plan Document Generator.
- Add analytics for planning tool usage, category edits, and summary downloads.

#### P2 Remaining
- Add save/load named budget scenarios.
- Add CSV export for budget categories.
- Add comparison mode for planned vs actual spending.


## Startup Toolkit Addition (2026-04-28)

### User Request
Create a separate Startup Toolkit menu and start with a Startup Business Plan Document Generator. Use attached Etsy-style business plan screenshots as reference, but create a distinct original startup planner design. Generator must support guided editing, page-by-page preview, PDF export, and editable Word `.docx` export.

### Implemented
- Added Startup Toolkit navigation entry and `/startup` directory page.
- Added `/startup/business-plan-generator` with guided section menu and page-by-page business plan preview.
- Included full planner sections: Cover, Executive Summary, Vision & Mission, Business Structure, Ideal Client, Marketing Strategy, Competitive Analysis, explicit SWOT, Financial Outlook, Future Plan & SMART Goals, Team & Action Checklist, and Thank You/contact page.
- Added local persistence so business plan edits remain saved in the browser.
- Added PDF download using existing html2pdf.js flow.
- Added real editable Word `.docx` export using the `docx` package.
- Added distinct soft startup-planner visual style inspired by the reference without copying it directly.

### Testing Summary
- JavaScript lint passed.
- Production build passed with only existing html2pdf source-map warning and bundle-size warning from added Word export dependency.
- Self-tests passed for Startup Toolkit route, generator route, live preview updates, Word `.docx` download, PDF download, mobile Startup Toolkit nav, and explicit SWOT heading.
- Testing agent validated routes, section menu, live preview, mobile usability, and exports. Reported missing explicit SWOT heading was fixed and self-verified.

### Backlog Updates
#### P0 Remaining
- None for the requested Startup Business Plan Generator scope.

#### P1 Remaining
- Add more Startup Toolkit generators: pitch deck outline, funding plan, launch checklist, and customer discovery worksheet.
- Add branding controls for logo, colours, and cover-page style.

#### P2 Remaining
- Add section reorder/hide controls.
- Add example prompts per industry.
- Add CSV/table import for financial assumptions.


## Business Plan Colour Customizer (2026-04-28)

### User Request
Add a custom colour changer for the Startup Business Plan document so users can change document colour and font colour.

### Implemented
- Added a "Customize colours" panel inside the Startup Business Plan Generator.
- Added preset colour themes: Blush, Coral, Sage, Navy, and Mono.
- Added live colour inputs for document colour, font colour, and accent colour.
- Colour changes update the page-by-page preview instantly and persist locally with the business plan.
- Colour changes are included in PDF output and editable Word `.docx` output.

### Testing Summary
- JavaScript lint passed.
- Production build passed with existing non-blocking warnings.
- Testing agent validated colour panel, presets, inputs, persistence, DOCX export, and mobile layout.
- Testing agent found PDF export failed because `color-mix()` CSS was unsupported by html2pdf/html2canvas.
- Fixed by replacing `color-mix()` with computed hex CSS variables before export.
- Self-tested after fix: colour changes applied, PDF downloaded successfully, and Word downloaded successfully.

### Backlog Updates
#### P1 Remaining
- Add logo upload and cover layout controls.
- Add saved branded themes per business plan.


## Consulting Client Contract Generator (2026-04-28)

### User Request
Add a Consulting Client Contract generator to the Startup Toolkit, based on the attached consulting contract reference. Requirements: selectable consulting/freelance wording, guided editing plus page-by-page preview, custom colours, branding controls including logo and brand-name styling, PDF export, and editable Word `.docx` export.

### Implemented
- Added Consulting Client Contract Generator card to `/startup`.
- Added `/startup/consulting-client-contract` route.
- Added guided section menu: Branding, Parties, Engagement, Scope, Payment, Legal, and Signatures.
- Added selectable contract type: Consulting Services Agreement or Freelance Client Contract.
- Added live page-by-page contract preview: cover, parties, appointment, purpose, objectives, scope, deliverables, timeline, fees, payment, legal terms, liability, notices, and signatures.
- Added colour customization for document colour, font colour, and accent colour with presets.
- Added logo upload, logo removal, and brand-name style selector.
- Added PDF export using live preview and editable Word `.docx` export with selected colours and optional logo.

### Testing Summary
- JavaScript lint passed.
- Production build passed with existing non-blocking warnings.
- Self-tested route loading, contract type toggle, colour customization, PDF download, Word download, Startup Toolkit card route, mobile no-overflow, logo upload, and brand style changes.
- Testing agent validated the full requested frontend scope with 100% success and no broken flows.

### Backlog Updates
#### P1 Remaining
- Add additional contract templates: coaching agreement, retainer agreement, subcontractor agreement, and NDA.
- Add clause include/exclude toggles for advanced customization.

#### P2 Remaining
- Add saved client/contact presets shared with invoice and quote tools.
- Add contract comparison presets for UK/US legal language after legal review.


## Contract Signature Enhancements + Product Business Management System (2026-04-28)

### User Request
Enhance contract signatures with typed signature format plus title/date fields and draw/upload options. Add the All-in-One Product Business Management System template inside the Startup Toolkit, including a PRD/template generator, clickable dashboard prototype, working local MVP modules, and PDF + Word exports.

### Implemented: Contract Signatures
- Added typed signature fields for consultant and client.
- Added signature title and signature date fields for both parties.
- Added drawn signature canvases for consultant and client signatures.
- Added signature image upload controls for both parties.
- Updated live contract preview to show uploaded/drawn signature images or typed signature text.
- Updated Word export to include typed or image signatures plus title/date.
- PDF export continues to export the live signed contract preview.

### Implemented: Product Business Management System
- Added Product Business Management System card to Startup Toolkit.
- Added `/startup/product-business-management` route.
- Built a localStorage working MVP with seeded data and connected modules.
- Added modules: Dashboard, Purchases, Sales, Inventory, Production, Pricing, CRM, Reports, Calendar, Tasks, Employees, and Template Export.
- Purchases module increments inventory, logs a movement, posts a purchase row, updates supplier balance, and logs activity.
- Sales module creates invoice rows, decrements inventory, logs a movement, updates client balance, and logs activity.
- Pricing calculator saves pricing entries.
- Dashboard includes KPIs, low-stock alerts, recent activity, and 12-month revenue/expense chart.
- Template Export provides PDF and editable Word `.docx` PRD exports.

### Testing Summary
- JavaScript lint passed.
- Production build passed with existing non-blocking html2pdf source-map warning and bundle-size warning.
- Self-tested contract typed signature preview, drawn signature preview image, PBM route, purchase workflow, Word PRD export, and PDF PRD export.
- Testing agent validated all requested frontend flows with 100% success: signatures, draw/upload controls, contract exports, PBM modules, purchase/sale inventory synchronization, pricing save, template exports, mobile no-overflow, and console health.

### Notes
- Product Business Management is a local working MVP/prototype, not a server-backed multi-user system yet.
- No APIs are mocked; localStorage is used intentionally for the requested Startup Toolkit template/MVP experience.

### Backlog Updates
#### P1 Remaining
- Convert Product Business Management localStorage data model into backend persistence when needed.
- Add CSV import/export for every PBM list view.
- Add role-based auth and user accounts for PBM when moving beyond template/MVP stage.

#### P2 Remaining
- Add product recipe production execution that consumes multiple ingredients automatically.
- Add payment method balance reporting and custom date filters.
- Add client/supplier detail pages with transaction history.
