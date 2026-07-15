---
name: BeerBoard
description: A welcoming global field guide for curious beer drinkers.
colors:
  background: "oklch(0.99 0 0)"
  surface: "oklch(0.96 0.006 80)"
  surface-strong: "oklch(0.91 0.012 78)"
  ink: "oklch(0.2 0.027 150)"
  muted: "oklch(0.44 0.018 125)"
  border: "oklch(0.85 0.011 85)"
  primary: "oklch(0.72 0.17 72)"
  primary-hover: "oklch(0.65 0.18 68)"
  primary-soft: "oklch(0.94 0.052 76)"
  accent: "oklch(0.29 0.064 150)"
  focus: "oklch(0.67 0.15 226)"
typography:
  display:
    fontFamily: "Outfit, Outfit Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "6.5rem"
    fontWeight: 760
    lineHeight: 0.92
    letterSpacing: "-0.065em"
  body:
    fontFamily: "Outfit, Outfit Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  measurement:
    fontFamily: "Outfit, Outfit Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "0.375rem"
  md: "0.625rem"
  lg: "0.875rem"
---

# Design system: BeerBoard

## Creative north star

BeerBoard is a shared field guide with the energy of a good bottle shop: knowledgeable, open, and happy to help someone explore. It uses expressive editorial type, generous space, beer-color imagery, and orderly lists. Technical data stays available, but never becomes the visual identity.

The three-word direction is **curious, welcoming, worldly**.

## Color

- Near-white is the reading surface. It stays neutral rather than creamy.
- Amber carries warmth, discovery, and beer character.
- Bottle green carries trust, high-confidence actions, and dark full-width sections.
- Muted text must retain WCAG AA contrast at its rendered size.
- Color never carries comparison, error, or success meaning by itself.

## Typography

- Outfit is the product family for display, navigation, controls, and body text.
- Scores, measurements, ranks, and dates use Outfit with tabular numerals.
- Top-level editorial titles use tight leading and may reach 6.5rem on wide screens.
- Body copy stays at or below 72 characters per line where practical.
- Avoid repeated uppercase eyebrows. Use short sentence-case orientation text only when it adds meaning.

## Layout

- Discovery pages use open editorial sections and strong rules.
- Ranked beer results are semantic ordered lists, not data tables.
- Country and style directories use long-form directory rows with one clear destination.
- Technical measurements use definition lists and strips only when comparison benefits from alignment.
- Cards are reserved for distinct discovery choices. Do not nest cards.

## Components

### Navigation

The sticky header uses the BeerBoard wordmark, four primary destinations, visible search, and account state. The active route uses a two-pixel amber rule. Mobile navigation becomes a simple vertical list.

### Buttons and links

- Bottle green is the primary high-confidence action color.
- Ghost buttons use a clear one-pixel border and tonal hover state.
- Text links may use an arrow when they move deeper into discovery.
- Icon-only controls require a familiar symbol and an accessible name. Primary actions include text.

### Ranking rows

Each row presents rank, beer, brewery, place, style, strength, score, and compare action. Beer name is the strongest element. Score is evidence, not the headline.

### Beer visual

The beer specimen uses a glass and SRM-derived liquid tone. It communicates beer color rather than serving as arbitrary decoration.

### Motion

The discovery page may use GSAP scroll-linked scale and pinned storytelling to explain paths through the catalog. Task surfaces remain calm. State transitions use 150–250ms easing. All motion stops or becomes immediate under `prefers-reduced-motion`.

### Icons

Use Lucide only. Do not use emoji, hand-drawn SVG icons, or an additional icon system.

## Avoid

- Dashboard chrome, metric hero cards, spreadsheet-first pages, and dense filter walls.
- Gradient text, glassmorphism, decorative badges, giant rounded containers, and colored side stripes.
- Ambient card shadows, nested panels, or identical feature-card grids.
- Decorative motion on comparison, authentication, reviews, saved beers, or settings flows.
- Claims that demonstration rankings represent verified real-world authority.

## Verification

Broad interface work requires lint, typecheck, tests, production build, and browser checks at desktop, tablet, and mobile widths. Verify keyboard focus, reduced motion, empty results, comparison selection, review and saved-beer states, and horizontal overflow.
