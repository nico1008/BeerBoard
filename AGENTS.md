<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BeerBoard product rules

## Product direction

- BeerBoard is a friendly global beer guide for curious drinkers.
- Lead with beer, maker, place, style, and taste. Keep technical evidence available without making the product feel like a dashboard.
- Use clear everyday language. Sound knowledgeable, curious, and welcoming. Never sound snobbish.
- The current catalog is demonstration data. Keep that disclosure visible anywhere a ranking or score could be mistaken for a verified real-world claim.

## Interface system

- Use Outfit throughout. Align measurements with tabular numerals instead of a separate technical typeface.
- Use neutral backgrounds, amber for discovery and action, and bottle green for trust and depth.
- Prefer editorial spacing, open sections, ranked lists, and purposeful imagery over nested cards or dense data grids.
- Use Lucide for interface icons. Do not use emoji, hand-drawn SVG icons, or an additional icon library.
- Do not use gradient text, glassmorphism, decorative badges, oversized rounded containers, or repeated uppercase eyebrow labels.
- Motion must explain hierarchy or state. Keep task surfaces calm. Respect `prefers-reduced-motion`.

## User paths

- Every ranked beer must lead to its beer profile.
- Beer profiles must offer save, compare, country, style, and methodology paths.
- Country and style pages must lead back to individual beers.
- Comparison inputs must show human-readable beer names while keeping shareable slugs in the URL.
- Saving a beer requires authentication and must return the user to the intended beer.

## Quality bar

- Target WCAG 2.2 AA, visible keyboard focus, semantic controls, clear labels, and at least 44px touch targets.
- Check empty, loading, error, signed-out, and signed-in states when changing a flow.
- For broad UI work, run lint, typecheck, tests, build, and browser checks at desktop, tablet, and mobile widths.
- Preserve responsive behavior and verify that no page introduces horizontal scrolling.
