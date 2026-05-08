---
name: Alexandria Pro
colors:
  surface: '#f6fafe'
  surface-dim: '#d6dadf'
  surface-bright: '#f6fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f9'
  surface-container: '#eaeef3'
  surface-container-high: '#e4e9ed'
  surface-container-highest: '#dfe3e7'
  on-surface: '#171c20'
  on-surface-variant: '#44474a'
  inverse-surface: '#2c3135'
  inverse-on-surface: '#edf1f6'
  outline: '#75777a'
  outline-variant: '#c5c6ca'
  surface-tint: '#5d5e61'
  primary: '#000101'
  on-primary: '#ffffff'
  primary-container: '#1a1c1e'
  on-primary-container: '#838486'
  inverse-primary: '#c6c6c9'
  secondary: '#5e5e5d'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfde'
  on-secondary-container: '#626361'
  tertiary: '#010100'
  on-tertiary: '#ffffff'
  tertiary-container: '#261a00'
  on-tertiary-container: '#95825a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e5'
  primary-fixed-dim: '#c6c6c9'
  on-primary-fixed: '#1a1c1e'
  on-primary-fixed-variant: '#454749'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c7c6c5'
  on-secondary-fixed: '#1a1c1b'
  on-secondary-fixed-variant: '#464746'
  tertiary-fixed: '#f8e0b1'
  tertiary-fixed-dim: '#dbc497'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#544522'
  background: '#f6fafe'
  on-background: '#171c20'
  surface-variant: '#dfe3e7'
typography:
  display:
    fontFamily: Newsreader
    fontSize: 4.5rem
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontFamily: Newsreader
    fontSize: 3rem
    fontWeight: '400'
    lineHeight: '1.2'
  h2:
    fontFamily: Newsreader
    fontSize: 2.25rem
    fontWeight: '500'
    lineHeight: '1.3'
  h3:
    fontFamily: Newsreader
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  caption:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-page: 64px
  section-gap: 80px
---

## Brand & Style

This design system is built upon the principles of high-end editorial curation and modern professional utility. It targets an audience that values intellectual precision, quiet authority, and a distraction-free environment. The brand personality is poised and architectural, favoring structured layouts over decorative excess.

The visual style is a fusion of **Minimalism** and **Editorial Design**. It leverages the expansive whitespace found in luxury broadsheets and the functional rigor of high-performance SaaS platforms. The emotional response is intended to be one of calm confidence, treating the user’s data and workflow with the reverence of a published manuscript.

## Colors

The palette is rooted in a "Warm White" foundation to provide a softer, more organic feel than pure digital white, reducing eye strain during deep work. "Deep Slate" serves as the primary ink color, providing high-contrast legibility and a sense of permanence.

The accent, a "Muted Gold," is used sparingly for primary actions, focus states, and sophisticated highlights. This ensures the UI remains authoritative rather than loud. A range of slate-tints (neutrals) are employed for secondary text and structural borders to maintain a monochromatic hierarchy.

## Typography

This design system employs a strict typographic hierarchy. **Newsreader** is reserved for headlines and editorial titles, bringing a classic, authoritative literary quality to the interface. Its high contrast between thick and thin strokes provides the "premium" feel.

**Inter** is the functional workhorse, used for all UI elements, inputs, labels, and navigation. It ensures maximum legibility at small sizes and maintains a modern, technical edge. Use `label-caps` for metadata and section headers to create clear visual separation without adding weight.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model for editorial content to preserve line-length readability, while utilizing a **Fluid Grid** for the toolkit’s dashboard components. A 12-column system is the standard, with generous 64px page margins to create a "frame" effect around the content.

Spacing follows an 8px rhythmic scale. To achieve the high-end editorial look, padding within containers should always feel slightly "too large" rather than "too small." Vertical rhythm is prioritized, with significant gaps between major sections to allow the design to breathe.

## Elevation & Depth

Depth in this design system is achieved through **low-contrast outlines** and subtle tonal shifts rather than aggressive shadows. 

1.  **Borders:** Use sharp 1px borders in a light slate (`#E2E2E2`) to define areas.
2.  **Tonal Layers:** Surfaces are stacked using subtle variations of the warm white background to indicate hierarchy.
3.  **Shadows:** When necessary for floating elements (like dropdowns), use a single, highly diffused shadow: `0 12px 40px rgba(0,0,0,0.04)`. This creates a soft "lift" that feels airy and premium rather than heavy or technical.

## Shapes

The shape language is strictly **Sharp**. 0px border radii are used across all components—buttons, input fields, cards, and containers. This reinforces the architectural and editorial nature of the system, mimicking the clean edges of paper and professional blueprints. 

Avoid any rounding unless it is specifically required by an external brand asset (e.g., a third-party logo). The sharpness is the key differentiator that provides the "professional toolkit" authority.

## Components

### Buttons
Primary buttons use a solid Deep Slate background with white Inter text. Secondary buttons use a 1px slate border with no background. Hover states should involve a subtle shift to the Muted Gold for the border or text, never a dramatic color flash.

### Input Fields
Inputs are defined by a bottom-only 1px border or a full 1px ghost border. Use Inter at `body-md` for user input. Focus states are indicated by the 1px border changing to Muted Gold.

### Cards
Cards are simple white containers with a 1px border. They do not use shadows by default. Hierarchy within cards is established through the use of `label-caps` for categories and `h3` for titles.

### Navigation
The sidebar or header navigation should use high-contrast Inter text with ample letter spacing. Active states should be marked by a thin 2px vertical or horizontal line in Muted Gold, maintaining the minimalist ethos.

### Data Tables
Tables should be minimalist, utilizing only horizontal rules (1px) to separate rows. Remove all vertical dividers. Headers should use the `label-caps` style for an organized, professional look.