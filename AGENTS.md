# ترمه — Product Page UI

## Overview
Static Persian RTL product page (HTML/CSS/JS) for a boutique e-commerce single-product layout.
No build step, no dependencies, no framework.

## Structure
- `index.html` — page markup (Persian RTL, WoodMart/WooCommerce-style product page)
- `styles.css` — all styling + animation helper classes (appended at end, grouped by step)
- `script.js` — vanilla JS interactions (one IIFE, module-style `init*` functions)

## Running locally
```bash
docker compose -f docker-compose.base44.yml up -d
```
Served via nginx:alpine on port 3000. Files are bind-mounted (read-only), so edits
appear on browser refresh — call `reload_preview` after changes. There is no bundler: the
served `index.html`/`styles.css`/`script.js` ARE the source, so what runs in the preview is
exactly what is committed.

## JS architecture (script.js)
Single IIFE, early-returns if `.product` is missing; every module runs once:
`initRevealEffects`, `initGalleryEffects`, `initVariationEffects`, `initQuantityEffects`,
`initCartEffects`, `initTabsEffects`, `initPointerSpotlight`, `initTouchFeedback`,
`initBackToTop`, `initMobileSticky`, `initScrollPolish`, `initMotionRuntime`.

1. Intro reveal + one-time IntersectionObserver reveal (capped 45ms stagger, no replay)
2. Gallery: thumbnail active feedback, fade+scale-settle image swap, image counter,
   **RTL horizontal swipe** (drag left = next), desktop pointer spotlight
3. Variation: selected pop, field highlight, unavailable shake, reset fade
4. Quantity: direction-aware number slide, tactile press
5. CTA: press compression, ripple, loading/success/idle states, desktop magnetic pull
6. Tabs: panel fade/slide, aria wiring (ids injected in JS — panels keep existing ids),
   keyboard arrows (RTL), active tab scrolled into view only if the nav really overflows
7. Touch feedback: ONE delegated `pointerdown`/`pointerup` on `document` drives `.is-tap`
   press scale (`.975`) on chips, swatches, stepper, thumbs, tabs, cards, header icons;
   the same delegation spawns `.tap-ripple` (light surfaces) / `.cta-ripple` (dark CTA)
8. Scroll polish: one passive scroll listener + rAF; adds `.is-fast-scroll` on
   `documentElement` above ~1200px/s to switch decorative effects off, and toggles
   back-to-top visibility. The sticky bar's "CTA is off-screen" state is read here too.

## Motion tokens
`styles.css` ends with a step-3 block defining `--motion-fast/base/slow`
(160/320/480ms), `--ease-out`, `--ease-spring`, `--tap-scale`, `--mobile-toolbar-height`.
Use these instead of hardcoded durations in new work. Reveal transitions reuse
`--motion-slow`; `.is-tap` uses `--motion-fast`.

## Mobile sticky purchase bar
- Built in JS, appended to `body`; shows only when the main CTA is fully above the
  viewport (`state.ctaPast`, measured in the scroll rAF).
- Desktop (>=1100px): centered pill, `bottom: safe-area + 18px`.
- Mobile (<=1099px): `bottom: calc(var(--mobile-toolbar-height) + env(safe-area-inset-bottom) + 8px)`.
- `initMobileSticky()` detects a theme/plugin bottom toolbar dynamically (curated
  WoodMart/WoodMart-ish selector list + a shallow `body` child scan for fixed/sticky
  elements hugging the viewport bottom) and writes `--mobile-toolbar-height` on `:root`.
  If a candidate looks like a full-screen overlay (>40% of the viewport) detection is
  declared unreliable and the mobile bar is NOT activated — safety over the effect.
  Re-runs (debounced 200ms) on resize/orientationchange.
- Back-to-top lifts above the bar via `.sticky-buy.is-visible ~ .to-top` (sibling order:
  the bar is appended before the button).

## Touch / hover split
Desktop-only effects (pointer spotlight, magnetic CTA, hover zoom/lift) are gated in JS on
`(hover: hover) and (pointer: fine)`; `@media (hover: none)` at the end of `styles.css`
neutralizes the lingering `:hover` zoom/lift that touch devices otherwise keep after a tap.

## Accessibility
- `prefers-reduced-motion: reduce` disables all motion, ripples and pulses; state changes
  stay instant and functional. Runtime toggling is handled in `initMotionRuntime`.
- Tab keyboard navigation (ArrowLeft/Right for RTL); aria-selected/controls/labelledby
  synced via JS (no HTML changes).

## Safety
- All JS scoped to `.product` wrapper — returns early if not found.
- Only transform/opacity animated (no layout thrash); `.gallery__frame` uses
  `touch-action: pan-y pinch-zoom` so vertical page scroll is never blocked.
- RTL preserved; logical properties (`inset-inline-*`) used; no horizontal overflow
  (verified at 375 / 768 / 1280, `scrollWidth - clientWidth === 0`).

## Manual check-list (no test runner in this repo)
```
docker compose -f docker-compose.base44.yml up -d
```
Then in the preview at a phone width: tap a thumbnail, swipe the gallery, tap +/- on the
quantity, select a size, tap the disabled XL, tap add-to-cart (loading -> success),
switch tabs, scroll past the CTA (sticky bar appears above the safe area) and jump back to
the top (it must hide).
