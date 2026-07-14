---
name: BeerBoard
description: Clear global beer intelligence for curious drinkers.
colors:
  background: "oklch(1 0 0)"
  surface: "oklch(0.968 0.006 190)"
  surface-strong: "oklch(0.925 0.012 190)"
  ink: "oklch(0.19 0.024 32)"
  muted: "oklch(0.43 0.025 32)"
  border: "oklch(0.84 0.012 190)"
  primary: "oklch(0.575 0.15 38)"
  primary-hover: "oklch(0.515 0.155 38)"
  primary-soft: "oklch(0.935 0.045 38)"
  accent: "oklch(0.285 0.058 190)"
  focus: "oklch(0.67 0.15 226)"
typography:
  display:
    fontFamily: "Geist, Geist Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "5.75rem"
    fontWeight: 760
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, Geist Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 720
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, Geist Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Geist Mono, Geist Mono Fallback, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  sm: "0.375rem"
  md: "0.625rem"
  lg: "0.875rem"
spacing:
  xs: "0.4rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 0.95rem"
  button-secondary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.background}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 0.95rem"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 0.75rem"
  panel:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.35rem"
---

# Design System: BeerBoard

## 1. Overview

**Creative North Star: "The Global Tasting Ledger"**

BeerBoard feels like a trusted field guide that has learned how to work on a screen. True white keeps dense catalog data legible. Measured terracotta supplies the human warmth of beer culture, while deep teal gives scores and high-confidence actions a sober data voice. The interface is informed, welcoming, and worldly without borrowing brewery nostalgia.

The system is flat by default, structured by rules, tonal panels, and spacing. It rejects faux-scientific labels, distressed heritage effects, repeated floating dashboard cards, gradients, and theatrical motion. Product familiarity wins over visual novelty.

**Key Characteristics:**

- True-white reading surface with a restrained terracotta accent.
- Geist for interface clarity; Geist Mono only for metrics, labels, IDs, and dates.
- Dense information organized into tables, definition lists, and clear route hierarchy.
- Rounded corners remain compact and functional, never soft or toy-like.
- Motion communicates state in 150–250ms and disappears under reduced motion.

## 2. Colors

The palette uses true white as architecture, terracotta as the human brand voice, and deep teal for data authority.

### Primary

- **Measured Terracotta:** Primary actions, current emphasis, chart shapes, and selected states. It occupies less than 10% of most screens.
- **Terracotta Wash:** Demonstration notices and text selection where a pale field needs to carry the same voice.

### Secondary

- **Deep Fermentation Teal:** Score panels, high-confidence secondary actions, and signed-in avatars.

### Neutral

- **True White:** Main page and component background.
- **Cool Reading Surface:** Filter bars, footer, hover rows, and non-elevated grouped content.
- **Warm Black Ink:** Primary copy and critical borders.
- **Earth Muted:** Supporting copy and labels; never used below WCAG AA contrast.

**The One Voice Rule.** Terracotta is used for action and evidence emphasis only. If more than one tenth of a product screen is terracotta, the interface has become decoration.

**The Color-Independent State Rule.** Higher, lower, equal, success, and error states always include text or an icon. Hue never carries meaning alone.

## 3. Typography

**Display Font:** Geist with system sans-serif fallbacks  
**Body Font:** Geist with system sans-serif fallbacks  
**Label/Mono Font:** Geist Mono with system monospace fallbacks

**Character:** One humanist-neutral sans family keeps the product direct across many languages and density levels. Mono is a functional instrument for measurements, dates, short labels, and identifiers—not a theme.

### Hierarchy

- **Display** (760, 5.75rem desktop / 4rem tablet / 3rem mobile, 0.98): Top-level catalog and detail titles only.
- **Headline** (720, 1.55rem, 1.15): Section and panel headings.
- **Title** (700, 1.15rem, 1.25): Beer, country, and style row titles.
- **Body** (400, 1rem, 1.55): Explanations and controls; prose remains at or below 72ch.
- **Label** (650, 0.72rem, 0.04em): Metric and form labels. Uppercase appears only in the data-label system.

**The Metric Voice Rule.** Geist Mono is reserved for values that benefit from stable width or technical distinction. Paragraphs and navigation never use mono.

## 4. Elevation

BeerBoard is flat by default. Borders and tonal surfaces establish hierarchy. The only structural shadow is a compact 6px–8px menu shadow used when a popover must sit above the page; cards and panels do not combine soft shadows with decorative borders.

### Shadow Vocabulary

- **Popover:** `0 6px 8px oklch(0.18 0.02 190 / 0.08)` for account menus and other true overlays only.

**The Flat-at-Rest Rule.** Content panels never use ambient shadows. If a panel looks detached from the page while idle, remove the shadow.

## 5. Components

Components are compact, familiar, and explicit about every state.

### Buttons

- **Shape:** Compact corners (0.375rem) and a 2.75rem minimum touch height.
- **Primary:** Measured Terracotta with white text for the main local action.
- **Hover / Focus:** Darker terracotta on hover; 3px blue focus ring with 3px offset.
- **Secondary / Ghost:** Deep teal for confident secondary actions; ghost buttons use a strong border and tonal hover field.

### Chips

- **Style:** Fully rounded only because chips are compact taxonomy objects. Neutral background, strong border, muted text.
- **State:** Hover shifts the border to terracotta and text to ink. Selected meaning must include copy or context.

### Cards / Containers

- **Corner Style:** Compact panels (0.875rem maximum).
- **Background:** True white for content; Cool Reading Surface for toolbars and noninteractive groupings.
- **Shadow Strategy:** No shadow at rest.
- **Border:** One neutral 1px rule when containment aids scanning.
- **Internal Padding:** 1.35rem standard, 1.5rem for major analysis panels.

### Inputs / Fields

- **Style:** True-white field, 1px strong neutral border, compact corners, and 2.75rem minimum height.
- **Focus:** Blue focus border and a restrained three-pixel focus halo.
- **Error / Disabled:** Errors pair a red rule with plain-language text; disabled controls remain legible and use reduced opacity.

### Navigation

Top navigation uses familiar text links and a two-pixel inset active rule. Mobile navigation becomes a vertical list below the sticky header. Account state is resolved in a focused client boundary so public pages stay cacheable and never flash a false signed-in identity.

### Score Panel

The score panel is the one committed-color surface. It combines the exact BeerBoard Index, rank, and release context. It never claims verified authority for demonstration data.

## 6. Do's and Don'ts

### Do:

- **Do** keep body text at WCAG 2.2 AA or better and prefer the ink token whenever muted contrast is uncertain.
- **Do** present dense catalog information through semantic tables, definition lists, and responsive structural changes.
- **Do** render missing measurements as “Not reported.”
- **Do** pair every visualization with exact accessible values.
- **Do** use true white for the main surface and carry warmth through terracotta—not cream backgrounds.
- **Do** keep state transitions between 150ms and 250ms and provide reduced-motion behavior.

### Don't:

- **Don't** build faux-scientific interfaces with tiny labels, unexplained jargon, or manufactured certainty.
- **Don't** use brewery-poster nostalgia, distressed textures, or ornamental “heritage” styling.
- **Don't** create generic AI dashboards from repeated floating cards, gradients, oversized hero metrics, or decorative motion.
- **Don't** present fictional demonstration data as verified fact.
- **Don't** use gradient text, glassmorphism, colored side-stripe cards, repeating stripe backgrounds, or 32px card radii.
- **Don't** pair a 1px decorative card border with a soft shadow wider than 8px.
