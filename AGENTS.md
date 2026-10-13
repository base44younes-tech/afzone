# ترمه — Product Page UI

## Overview
Static Persian RTL product page (HTML/CSS/JS) for a boutique e-commerce single-product layout.
No build step, no dependencies, no framework.

## Structure
- `index.html` — page markup (Persian RTL, WoodMart/WooCommerce-style product page)
- `styles.css` — all styling + animation helper classes (appended at end)
- `script.js` — vanilla JS interactions (scoped to `.product` wrapper)

## Running locally
```bash
docker compose -f docker-compose.base44.yml up -d
```
Served via nginx:alpine on port 3000. Files are bind-mounted (read-only), so edits
appear on browser refresh — call `reload_preview` after changes.

## JS interactions (script.js)
1. Page intro reveal (opacity + translate, no flash)
2. Scroll reveal via IntersectionObserver (one-time, no replay)
3. Gallery: thumbnail active feedback, image fade swap, desktop hover zoom
4. Variation: selected option pop, field highlight, unavailable shake, reset fade
5. Quantity: tactile press, number bump, scale feedback
6. Tabs: content fade/translate, aria sync, keyboard arrow navigation
7. Related cards: entrance reveal, hover zoom/lift (CSS-driven)

## Accessibility
- `prefers-reduced-motion: reduce` disables all motion; instant state changes only.
- Tab keyboard navigation (ArrowLeft/Right for RTL).
- aria-selected/controls/tabindex synced via JS (no HTML changes).

## Safety
- All JS scoped to `.product` wrapper — returns early if not found.
- Only transform/opacity animated (no layout thrash).
- RTL preserved; no horizontal overflow or z-index changes.
