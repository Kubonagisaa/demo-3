# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Design-conscious professionals, remote knowledge workers, and urban minimalists seeking considered, timeless essentials for their workspace, living environment, wardrobe, and daily rituals.

## Product Purpose
HAVEN is a single-vendor concept department store offering thoughtfully curated, high-craft essentials across 6 core categories. It eliminates catalog noise and middlemen markups by delivering a unified aesthetic and material standard directly from verified manufacturers to the consumer.

## Positioning
Single-vendor curated lifestyle standard: factory-direct manufacturing without retail markup, paired with sustainable materials, meticulous finishing, and bilingual (EN/ZH) accessibility. A considered alternative to mass marketplaces.

## Operating Context
B2C e-commerce web application running on desktop and mobile browsers. Users browse curated collections, filter by category/color/pricing, inspect item craftsmanship in quick-view, manage a persistent bag with shipping threshold incentives ($150 worldwide free shipping), read editorial stories via Haven Journal, and toggle internationalization (English & Simplified Chinese).

## Capabilities and Constraints
- Multi-currency / internationalized display with immediate EN/ZH localization.
- Curated 6-department catalog (Workspace, Living, Wardrobe, Tech Gadgets, Personal Care, Travel Goods).
- Interactive shopping bag drawer with live threshold calculations and quantity manipulation.
- Responsive design with smooth Framer Motion micro-interactions and quick-view modals.
- Technical constraint: Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript.

## Brand Commitments
- Name: HAVEN
- Identity: "A More Considered Way to Live"
- Palette & Tone: Warm architectural neutrals, earth tones, subdued ceramics, walnut, brass, and brushed metals; calm, deliberate, editorial voice.
- Zero clutter: clean typographic hierarchy, no aggressive urgency banners or deceptive dark patterns.

## Evidence on Hand
- Representative catalog of 18+ curated products across 6 departments with real specifications, color variants, pricing, and photography assets (`app/lib/data.ts`).
- Full bilingual translation dictionary (`app/lib/i18n.tsx`).
- Production interactive components (`ProductCard`, `CartDrawer`, `ProductQuickView`, `HavenJournal`, `ProfileDrawer`).

## Product Principles
1. **Considered Curation Over Infinite Choice**: Every item must earn its place through utility, material integrity, and aesthetic harmony.
2. **Transparent Value**: Direct manufacturing connections without arbitrary retail markup; honest pricing and materials.
3. **Calm, High-Touch Experience**: Quiet editorial pacing, tactile micro-interactions, and frictionless checkout flow.
4. **Inclusive Internationalization**: Equal-first bilingual experience (English & Chinese) from day one.

## Accessibility & Inclusion
- Semantic HTML5 structure with ARIA live regions for cart and toasts.
- Full keyboard navigability across drawers, quick-view dialogs, and interactive controls.
- High-contrast text readability respecting light/dark tokens.
